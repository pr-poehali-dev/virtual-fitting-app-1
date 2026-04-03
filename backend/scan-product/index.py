"""
Парсит страницу товара с маркетплейса (Wildberries, Ozon, Lamoda, Zara, H&M, Uniqlo)
и возвращает название, цену, фото и бренд.
"""
import json
import re
import os
import urllib.request
import urllib.error


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def detect_marketplace(url: str) -> str:
    if "wildberries.ru" in url or "wb.ru" in url:
        return "wildberries"
    if "ozon.ru" in url:
        return "ozon"
    if "lamoda.ru" in url:
        return "lamoda"
    if "zara.com" in url:
        return "zara"
    if "hm.com" in url or "h&m" in url.lower():
        return "hm"
    if "uniqlo.com" in url:
        return "uniqlo"
    return "unknown"


def fetch_html(url: str) -> str:
    import gzip
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read()
        encoding = resp.headers.get("Content-Encoding", "")
        if encoding == "gzip":
            raw = gzip.decompress(raw)
        return raw.decode("utf-8", errors="ignore")


def parse_wildberries(url: str) -> dict:
    # Extract article id from URL
    match = re.search(r'/catalog/(\d+)/', url)
    if not match:
        match = re.search(r'/(\d+)/', url)
    if not match:
        raise ValueError("Не удалось определить артикул товара")

    article_id = match.group(1)

    # WB has a public card API
    vol = int(article_id) // 100000
    part = int(article_id) // 1000
    basket = str(vol % 16 + 1).zfill(2)

    api_url = f"https://card.wb.ru/cards/v2/detail?appType=1&curr=rub&dest=-1257786&spp=30&nm={article_id}"
    req = urllib.request.Request(api_url, headers={**HEADERS, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())

    products = data.get("data", {}).get("products", [])
    if not products:
        raise ValueError("Товар не найден")

    p = products[0]
    name = p.get("name", "")
    brand = p.get("brand", "")
    price_raw = p.get("salePriceU") or p.get("priceU", 0)
    price = f"{price_raw // 100:,} ₽".replace(",", " ")

    # Build image URL
    img_vol = int(article_id) // 100000
    img_url = f"https://basket-{str(img_vol % 16 + 1).zfill(2)}.wbbasket.ru/vol{img_vol}/part{part}/{article_id}/images/big/1.webp"

    return {
        "name": name,
        "brand": brand,
        "price": price,
        "image": img_url,
        "marketplace": "Wildberries",
        "url": url,
    }


def parse_ozon(url: str) -> dict:
    html = fetch_html(url)

    name = ""
    price = ""
    image = ""
    brand = ""

    # Try to get name from og:title or title tag
    og_title = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    if og_title:
        name = og_title.group(1).split(" купить")[0].strip()

    title_tag = re.search(r'<title>([^<]+)</title>', html)
    if not name and title_tag:
        name = title_tag.group(1).split(" –")[0].split(" -")[0].strip()

    # Price from JSON-LD or meta
    price_match = re.search(r'"price":\s*"?(\d[\d\s]*)"?', html)
    if price_match:
        price = f"{price_match.group(1).replace(' ', '')} ₽"

    # Image from og:image
    og_image = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if og_image:
        image = og_image.group(1)

    # Brand from JSON-LD
    brand_match = re.search(r'"brand"[:\s]+[{"]+"name"[:\s]+"([^"]+)"', html)
    if brand_match:
        brand = brand_match.group(1)

    if not name:
        raise ValueError("Не удалось получить данные товара с Ozon")

    return {
        "name": name,
        "brand": brand,
        "price": price or "Цена не указана",
        "image": image,
        "marketplace": "Ozon",
        "url": url,
    }


def parse_lamoda(url: str) -> dict:
    html = fetch_html(url)

    name = ""
    price = ""
    image = ""
    brand = ""

    og_title = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    if og_title:
        name = og_title.group(1).strip()

    og_image = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if og_image:
        image = og_image.group(1)

    price_match = re.search(r'class="[^"]*price[^"]*"[^>]*>\s*(?:<[^>]+>)*\s*([\d\s]+)\s*(?:₽|руб)', html)
    if price_match:
        price = f"{price_match.group(1).strip()} ₽"

    brand_match = re.search(r'"brand":\s*"([^"]+)"', html)
    if brand_match:
        brand = brand_match.group(1)

    if not name:
        title_tag = re.search(r'<title>([^<]+)</title>', html)
        if title_tag:
            name = title_tag.group(1).split(" —")[0].strip()

    if not name:
        raise ValueError("Не удалось получить данные товара с Lamoda")

    return {
        "name": name,
        "brand": brand,
        "price": price or "Цена не указана",
        "image": image,
        "marketplace": "Lamoda",
        "url": url,
    }


def parse_generic(url: str, marketplace_name: str) -> dict:
    html = fetch_html(url)

    name = ""
    price = ""
    image = ""
    brand = ""

    og_title = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    if og_title:
        name = og_title.group(1).strip()

    if not name:
        title_tag = re.search(r'<title>([^<]+)</title>', html)
        if title_tag:
            name = title_tag.group(1).split("|")[0].split("—")[0].strip()

    og_image = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if og_image:
        image = og_image.group(1)

    price_match = re.search(r'"price"[:\s]+"?([\d.,]+)"?', html)
    if price_match:
        try:
            price = f"{int(float(price_match.group(1).replace(',', '.').replace(' ', ''))):,} ₽".replace(",", " ")
        except Exception:
            pass

    brand_match = re.search(r'"brand"[^}]*"name"[:\s]+"([^"]+)"', html)
    if brand_match:
        brand = brand_match.group(1)

    if not name:
        raise ValueError(f"Не удалось получить данные товара с {marketplace_name}")

    return {
        "name": name,
        "brand": brand,
        "price": price or "Цена не указана",
        "image": image,
        "marketplace": marketplace_name,
        "url": url,
    }


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

        if marketplace == "wildberries":
            result = parse_wildberries(url)
        elif marketplace == "ozon":
            result = parse_ozon(url)
        elif marketplace == "lamoda":
            result = parse_lamoda(url)
        elif marketplace == "unknown":
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Маркетплейс не поддерживается. Поддерживаются: Wildberries, Ozon, Lamoda, Zara, H&M, Uniqlo"}, ensure_ascii=False),
            }
        else:
            name_map = {"zara": "Zara", "hm": "H&M", "uniqlo": "Uniqlo"}
            result = parse_generic(url, name_map.get(marketplace, marketplace))

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(result, ensure_ascii=False),
        }

    except urllib.error.HTTPError as e:
        return {
            "statusCode": 502,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": f"Сайт недоступен: {e.code}"}, ensure_ascii=False),
        }
    except urllib.error.URLError as e:
        return {
            "statusCode": 502,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Не удалось подключиться к сайту"}, ensure_ascii=False),
        }
    except ValueError as e:
        return {
            "statusCode": 422,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}, ensure_ascii=False),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": f"Ошибка парсинга: {str(e)}"}, ensure_ascii=False),
        }
