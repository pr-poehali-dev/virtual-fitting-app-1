"""
Парсит страницу товара с маркетплейса (Wildberries, Ozon, Lamoda)
и возвращает название, цену, фото и бренд.
"""
import json
import re
import urllib.request
import urllib.error
import gzip as gzip_module


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

HEADERS_HTML = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Cache-Control": "no-cache",
}

HEADERS_JSON = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
}


def fetch(url: str, headers: dict, timeout: int = 20) -> str:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read()
        enc = resp.headers.get("Content-Encoding", "")
        if enc == "gzip":
            raw = gzip_module.decompress(raw)
        return raw.decode("utf-8", errors="ignore")


def detect_marketplace(url: str) -> str:
    if "wildberries.ru" in url or "wb.ru" in url:
        return "wildberries"
    if "ozon.ru" in url:
        return "ozon"
    if "lamoda.ru" in url:
        return "lamoda"
    return "unknown"


# ── Wildberries ──────────────────────────────────────────────────────────────

def parse_wildberries(url: str) -> dict:
    match = re.search(r'/catalog/(\d+)/', url) or re.search(r'[?&]nm=(\d+)', url) or re.search(r'/(\d{6,})', url)
    if not match:
        raise ValueError("Не удалось определить артикул. Убедитесь, что ссылка ведёт на конкретный товар.")

    article_id = match.group(1)
    vol = int(article_id) // 100000
    part = int(article_id) // 1000

    api_url = f"https://card.wb.ru/cards/v2/detail?appType=1&curr=rub&dest=-1257786&spp=30&nm={article_id}"
    raw = fetch(api_url, HEADERS_JSON)
    data = json.loads(raw)

    products = data.get("data", {}).get("products", [])
    if not products:
        raise ValueError("Товар не найден на Wildberries")

    p = products[0]
    name = p.get("name", "").strip()
    brand = p.get("brand", "").strip()

    price_raw = p.get("salePriceU") or p.get("priceU") or 0
    price = f"{price_raw // 100:,} ₽".replace(",", "\u00a0")

    basket = str(vol % 16 + 1).zfill(2)
    img_url = f"https://basket-{basket}.wbbasket.ru/vol{vol}/part{part}/{article_id}/images/big/1.webp"

    return {"name": name, "brand": brand, "price": price, "image": img_url, "marketplace": "Wildberries", "url": url}


# ── Ozon ─────────────────────────────────────────────────────────────────────

def parse_ozon(url: str) -> dict:
    # Extract product id
    match = re.search(r'/product/[^/]+-(\d+)/?', url) or re.search(r'/(\d{6,})/?', url)
    if not match:
        raise ValueError("Не удалось определить ID товара Ozon. Проверьте ссылку.")

    product_id = match.group(1)

    # Ozon has a search/item API accessible without auth
    api_url = f"https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=/product/{product_id}/"
    try:
        raw = fetch(api_url, {**HEADERS_HTML, "Accept": "application/json"}, timeout=15)
        data = json.loads(raw)

        # Try to extract from widgetStates
        widget_states = data.get("widgetStates", {})
        name = ""
        price = ""
        image = ""
        brand = ""

        for key, val_str in widget_states.items():
            try:
                val = json.loads(val_str) if isinstance(val_str, str) else val_str
            except Exception:
                continue

            if not name and isinstance(val, dict):
                n = val.get("title") or val.get("name") or val.get("itemTitle")
                if n and isinstance(n, str) and len(n) > 3:
                    name = n.strip()

            if not price and isinstance(val, dict):
                pr = val.get("price") or val.get("finalPrice") or val.get("cardPrice")
                if pr and isinstance(pr, (str, int)):
                    price_str = str(pr).replace("\u00a0", "").replace(" ", "").replace(",", "")
                    if price_str.isdigit():
                        price = f"{int(price_str):,} ₽".replace(",", "\u00a0")

            if not image and isinstance(val, dict):
                imgs = val.get("images") or val.get("coverImage")
                if isinstance(imgs, list) and imgs:
                    image = imgs[0] if isinstance(imgs[0], str) else imgs[0].get("src", "")
                elif isinstance(imgs, str):
                    image = imgs

        if name:
            return {"name": name, "brand": brand, "price": price or "Цена не указана",
                    "image": image, "marketplace": "Ozon", "url": url}
    except Exception:
        pass

    # Fallback — try to get HTML og tags
    try:
        html = fetch(url, HEADERS_HTML, timeout=20)
        name = ""
        image = ""

        og_title = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html)
        if og_title:
            name = og_title.group(1).split(" купить")[0].strip()

        og_image = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
        if og_image:
            image = og_image.group(1)

        if not name:
            title = re.search(r'<title>([^<]+)</title>', html)
            if title:
                name = title.group(1).split("–")[0].split("-")[0].strip()

        if name:
            return {"name": name, "brand": "", "price": "Цена не указана",
                    "image": image, "marketplace": "Ozon", "url": url}
    except Exception:
        pass

    raise ValueError("Ozon не даёт получить данные товара автоматически. Попробуйте Wildberries.")


# ── Lamoda ───────────────────────────────────────────────────────────────────

def parse_lamoda(url: str) -> dict:
    try:
        html = fetch(url, HEADERS_HTML, timeout=20)
    except urllib.error.HTTPError as e:
        if e.code in (403, 429):
            raise ValueError("Lamoda заблокировала запрос. Попробуйте Wildberries.")
        raise

    name = ""
    price = ""
    image = ""
    brand = ""

    # JSON-LD first
    jsonld = re.search(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
    if jsonld:
        try:
            ld = json.loads(jsonld.group(1))
            if isinstance(ld, list):
                ld = ld[0]
            name = ld.get("name", "").strip()
            brand = (ld.get("brand") or {}).get("name", "").strip()
            offers = ld.get("offers") or {}
            if isinstance(offers, list):
                offers = offers[0]
            pr = offers.get("price")
            if pr:
                price = f"{int(float(str(pr))):,} ₽".replace(",", "\u00a0")
            imgs = ld.get("image") or []
            if isinstance(imgs, list) and imgs:
                image = imgs[0]
            elif isinstance(imgs, str):
                image = imgs
        except Exception:
            pass

    if not name:
        og = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html)
        if og:
            name = og.group(1).strip()

    if not image:
        og_img = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
        if og_img:
            image = og_img.group(1)

    if not name:
        raise ValueError("Не удалось получить данные с Lamoda. Попробуйте Wildberries.")

    return {"name": name, "brand": brand, "price": price or "Цена не указана",
            "image": image, "marketplace": "Lamoda", "url": url}


# ── Handler ──────────────────────────────────────────────────────────────────

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        url = body.get("url", "").strip()

        if not url:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "URL не указан"}, ensure_ascii=False),
            }

        if not url.startswith("http"):
            url = "https://" + url

        marketplace = detect_marketplace(url)

        if marketplace == "unknown":
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps(
                    {"error": "Поддерживаются: Wildberries, Ozon, Lamoda. Вставьте ссылку на конкретный товар."},
                    ensure_ascii=False
                ),
            }

        parsers = {
            "wildberries": parse_wildberries,
            "ozon": parse_ozon,
            "lamoda": parse_lamoda,
        }
        result = parsers[marketplace](url)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(result, ensure_ascii=False),
        }

    except urllib.error.HTTPError as e:
        msg = f"Сайт вернул ошибку {e.code}. Попробуйте другую ссылку."
        return {"statusCode": 502, "headers": CORS_HEADERS,
                "body": json.dumps({"error": msg}, ensure_ascii=False)}

    except urllib.error.URLError:
        return {"statusCode": 502, "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Не удалось подключиться к сайту. Проверьте ссылку."}, ensure_ascii=False)}

    except ValueError as e:
        return {"statusCode": 422, "headers": CORS_HEADERS,
                "body": json.dumps({"error": str(e)}, ensure_ascii=False)}

    except Exception as e:
        return {"statusCode": 500, "headers": CORS_HEADERS,
                "body": json.dumps({"error": f"Ошибка: {str(e)}"}, ensure_ascii=False)}
