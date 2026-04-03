import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AVATAR_IMG, CLOTHES_IMG } from "@/components/constants";
import { useAppContext, ScannedProduct } from "@/components/AppContext";

const SCAN_API = "https://functions.poehali.dev/2c0579a1-2652-4c03-b52e-89035b911bc1";

interface ProductResult {
  name: string;
  brand: string;
  price: string;
  image: string;
  marketplace: string;
  url: string;
}

export function ScanSection() {
  const { addProduct } = useAppContext();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState<ProductResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setProduct(null);
    setError(null);
    setAdded(false);

    try {
      const resp = await fetch(SCAN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Ошибка при получении товара");
      } else {
        setProduct(data);
      }
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setScanning(false);
    }
  };

  const handleAddToTryOn = () => {
    if (!product) return;
    addProduct(product);
    setAdded(true);
  };

  const handleReset = () => {
    setUrl("");
    setProduct(null);
    setError(null);
    setAdded(false);
  };

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Сканирование</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Загрузите товар с маркетплейса</p>
      </div>

      <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${scanning ? "glow-teal" : ""}`}
        style={{ height: 280 }}>
        <div className="absolute inset-0 glass flex flex-col items-center justify-center gap-4">

          {!scanning && !product && !error && (
            <>
              <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center">
                <Icon name="Camera" size={32} className="text-teal/70" />
              </div>
              <p className="text-muted-foreground font-body text-sm text-center px-8">
                Вставьте ссылку на товар или загрузите фото с маркетплейса
              </p>
            </>
          )}

          {scanning && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
                <p className="text-teal font-body text-sm">Анализирую товар...</p>
              </div>
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-teal rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal rounded-tr-sm" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-teal rounded-bl-sm" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal rounded-br-sm" />
              <div className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal to-transparent animate-pulse" style={{ top: "50%" }} />
            </>
          )}

          {error && !scanning && (
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                <Icon name="AlertCircle" size={24} className="text-destructive" />
              </div>
              <p className="text-destructive font-body text-sm">{error}</p>
              <button onClick={handleReset} className="text-xs text-muted-foreground font-body underline">
                Попробовать снова
              </button>
            </div>
          )}

          {product && !scanning && (
            <div className="absolute inset-0 flex">
              {product.image && (
                <img src={product.image} alt={product.name}
                  className="w-1/2 h-full object-cover opacity-70"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className={`flex flex-col justify-end p-4 ${product.image ? "w-1/2" : "w-full"}`}>
                <span className="text-[9px] font-body text-teal/80 uppercase tracking-widest mb-1">{product.marketplace}</span>
                {product.brand && <p className="text-xs font-body text-muted-foreground">{product.brand}</p>}
                <p className="font-body font-semibold text-foreground text-sm leading-snug mt-0.5">{product.name}</p>
                <p className="text-teal font-body font-bold text-base mt-1">{product.price}</p>
              </div>
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, transparent 30%, hsl(220,18%,9%) 100%)"
              }} />
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Icon name="Link" size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleScan()}
          placeholder="Вставьте ссылку с Ozon, Wildberries, Lamoda..."
          className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        {url && (
          <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="glass-active rounded-2xl p-4 flex items-center justify-center gap-2 hover:glow-teal transition-all duration-300 disabled:opacity-40"
        >
          <Icon name="ScanLine" size={16} className="text-teal" />
          <span className="font-body font-medium text-teal text-sm">{scanning ? "Сканирую..." : "Сканировать"}</span>
        </button>

        {product ? (
          <button
            onClick={handleAddToTryOn}
            disabled={added}
            className={`rounded-2xl p-4 flex items-center justify-center gap-2 transition-all duration-300 ${
              added ? "glass text-muted-foreground" : "glass-active hover:glow-teal-sm"
            }`}
          >
            <Icon name={added ? "Check" : "Plus"} size={16} className={added ? "text-muted-foreground" : "text-teal"} />
            <span className={`font-body font-medium text-sm ${added ? "text-muted-foreground" : "text-teal"}`}>
              {added ? "Добавлено" : "В примерку"}
            </span>
          </button>
        ) : (
          <button className="glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
            <Icon name="Upload" size={16} className="text-muted-foreground" />
            <span className="font-body font-medium text-muted-foreground text-sm">Загрузить фото</span>
          </button>
        )}
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-body text-muted-foreground mb-3">Поддерживаемые магазины</p>
        <div className="flex gap-2 flex-wrap">
          {["Wildberries", "Ozon", "Lamoda", "Zara", "H&M", "Uniqlo"].map(m => (
            <span key={m} className="glass px-3 py-1 rounded-lg text-xs font-body text-muted-foreground">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FavoritesSection() {
  const { scannedProducts, toggleFavorite, removeProduct } = useAppContext();
  const favorites = scannedProducts.filter(p => p.favorited);

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Избранное</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Сохранённые товары</p>
      </div>

      {favorites.length === 0 ? (
        <div className="glass rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
          <Icon name="Heart" size={32} className="text-muted-foreground/40" />
          <p className="font-body text-muted-foreground text-sm">Пока ничего нет</p>
          <p className="font-body text-muted-foreground/60 text-xs">Отсканируйте товар и нажмите ♥ в истории</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <ProductCard key={fav.id} product={fav} onToggleFavorite={toggleFavorite} onRemove={removeProduct} />
          ))}
        </div>
      )}

      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-body text-muted-foreground/60 text-center">
          Нажмите ♥ в истории, чтобы добавить товар сюда
        </p>
      </div>
    </div>
  );
}

export function HistorySection() {
  const { scannedProducts, toggleFavorite, removeProduct } = useAppContext();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Только что";
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
    if (diff < 172800) return "Вчера";
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">История</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Ранее добавленные товары</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Добавлено", value: String(scannedProducts.length) },
          { label: "В избранном", value: String(scannedProducts.filter(p => p.favorited).length) },
          { label: "Магазинов", value: String(new Set(scannedProducts.map(p => p.marketplace)).size) },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <p className="text-2xl font-display font-light text-teal">{s.value}</p>
            <p className="text-[10px] font-body text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {scannedProducts.length === 0 ? (
        <div className="glass rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
          <Icon name="Clock" size={32} className="text-muted-foreground/40" />
          <p className="font-body text-muted-foreground text-sm">История пуста</p>
          <p className="font-body text-muted-foreground/60 text-xs">Отсканируйте первый товар в разделе «Скан»</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scannedProducts.map((item) => (
            <div key={item.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:glass-active transition-all duration-300">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Shirt" size={18} className="text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-foreground text-sm truncate">{item.name}</p>
                <p className="text-xs font-body text-muted-foreground">{item.marketplace} · {formatDate(item.addedAt)}</p>
              </div>
              <span className="text-teal font-body text-xs font-medium flex-shrink-0">{item.price}</span>
              <button
                onClick={() => toggleFavorite(item.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  item.favorited ? "glass-active" : "glass hover:glass-active"
                }`}
              >
                <Icon name="Heart" size={13} className={item.favorited ? "text-teal fill-current" : "text-muted-foreground"} />
              </button>
              <button
                onClick={() => removeProduct(item.id)}
                className="glass w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-all flex-shrink-0"
              >
                <Icon name="Trash2" size={13} className="text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onToggleFavorite, onRemove }: {
  product: ScannedProduct;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:glass-active transition-all duration-300 group">
      <div className="flex gap-4 p-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
          {product.image ? (
            <img src={product.image} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="Shirt" size={24} className="text-muted-foreground/40" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 gap-2">
            <h3 className="font-body font-semibold text-foreground text-sm leading-snug line-clamp-2">{product.name}</h3>
            <button onClick={() => onToggleFavorite(product.id)} className="text-teal hover:text-teal/80 transition-colors flex-shrink-0 mt-0.5">
              <Icon name="Heart" size={16} className="fill-current" />
            </button>
          </div>
          {product.brand && <p className="text-xs font-body text-muted-foreground">{product.brand}</p>}
          <p className="text-teal font-body font-bold text-sm mt-1">{product.price}</p>
          <p className="text-[10px] text-muted-foreground/60 font-body mt-0.5">{product.marketplace}</p>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-3">
        <button className="text-xs font-body text-teal hover:text-teal/80 transition-colors">Примерить снова</button>
        <span className="text-white/10">·</span>
        <button
          onClick={() => onRemove(product.id)}
          className="text-xs font-body text-muted-foreground hover:text-destructive transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export function ShareSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Поделиться</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Отправьте образ друзьям</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="relative" style={{ height: 200 }}>
          <img src={AVATAR_IMG} alt="Образ" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, hsl(220,20%,6%) 0%, transparent 50%)"
          }} />
          <div className="absolute bottom-4 left-4">
            <p className="font-display text-xl text-foreground">Образ #1</p>
            <p className="font-body text-xs text-muted-foreground">Пальто + Прямые брюки</p>
          </div>
          <div className="absolute top-4 right-4 glass-active px-2.5 py-1 rounded-lg">
            <span className="text-xs font-body text-teal">Идеально подходит</span>
          </div>
        </div>
        <div className="p-4">
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <span className="text-xs font-body text-muted-foreground flex-1 truncate">fitroom.app/share/abc123</span>
            <button
              onClick={handleCopy}
              className="glass-active rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-all"
            >
              <Icon name={copied ? "Check" : "Copy"} size={12} className="text-teal" />
              <span className="text-xs font-body text-teal">{copied ? "Скопировано" : "Копировать"}</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-body text-muted-foreground mb-3 tracking-wide uppercase">Отправить через</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "MessageCircle", label: "Telegram", color: "text-teal" },
            { icon: "Send", label: "WhatsApp", color: "text-green-400" },
            { icon: "Instagram", label: "Instagram", color: "text-pink-400" },
            { icon: "Mail", label: "Email", color: "text-blue-400" },
          ].map((ch, i) => (
            <button key={i} className="glass rounded-xl p-4 flex items-center gap-3 hover:glass-active transition-all">
              <Icon name={ch.icon} size={18} className={ch.color} />
              <span className="font-body font-medium text-foreground text-sm">{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-active rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="MessageSquare" size={14} className="text-teal" />
          <h3 className="font-body font-semibold text-foreground text-sm">Запросить мнение</h3>
        </div>
        <p className="text-xs font-body text-muted-foreground mb-3">Друзья смогут оценить образ и оставить комментарий</p>
        <button className="w-full glass rounded-xl py-2.5 text-sm font-body font-medium text-teal hover:glow-teal-sm transition-all">
          Отправить запрос
        </button>
      </div>
    </div>
  );
}
