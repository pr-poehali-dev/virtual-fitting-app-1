import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AVATAR_IMG, CLOTHES_IMG, historyItems, favoritesItems } from "@/components/constants";

export function ScanSection({ scanning, scanDone, onScan }: { scanning: boolean; scanDone: boolean; onScan: () => void }) {
  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Сканирование</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Загрузите товар с маркетплейса</p>
      </div>

      <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${scanning ? "glow-teal" : ""}`}
        style={{ height: 280 }}>
        <div className="absolute inset-0 glass flex flex-col items-center justify-center gap-4">
          {!scanning && !scanDone && (
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
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
              <p className="text-teal font-body text-sm">Анализирую товар...</p>
            </div>
          )}
          {scanDone && !scanning && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full glass-active flex items-center justify-center">
                <Icon name="CheckCircle2" size={28} className="text-teal" />
              </div>
              <p className="text-teal font-body font-medium text-sm">Товар добавлен в примерку</p>
              <p className="text-muted-foreground font-body text-xs">Пальто оверсайз · Zara</p>
            </div>
          )}
          {scanning && (
            <>
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-teal rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal rounded-tr-sm" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-teal rounded-bl-sm" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal rounded-br-sm" />
              <div className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal to-transparent animate-pulse" style={{ top: "50%" }} />
            </>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Icon name="Link" size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Вставьте ссылку с Ozon, Wildberries, Lamoda..."
          className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onScan}
          disabled={scanning}
          className="glass-active rounded-2xl p-4 flex items-center justify-center gap-2 hover:glow-teal transition-all duration-300 disabled:opacity-50"
        >
          <Icon name="ScanLine" size={16} className="text-teal" />
          <span className="font-body font-medium text-teal text-sm">{scanning ? "Сканирую..." : "Сканировать"}</span>
        </button>
        <button className="glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
          <Icon name="Upload" size={16} className="text-muted-foreground" />
          <span className="font-body font-medium text-muted-foreground text-sm">Загрузить фото</span>
        </button>
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-body text-muted-foreground mb-3">Поддерживаемые магазины</p>
        <div className="flex gap-2 flex-wrap">
          {["Ozon", "Wildberries", "Lamoda", "Zara", "H&M", "Uniqlo"].map(m => (
            <span key={m} className="glass px-3 py-1 rounded-lg text-xs font-body text-muted-foreground">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FavoritesSection() {
  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Избранное</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Сохранённые образы</p>
      </div>

      <div className="space-y-3">
        {favoritesItems.map((fav, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden hover:glass-active transition-all duration-300 group">
            <div className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={CLOTHES_IMG} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-body font-semibold text-foreground">{fav.name}</h3>
                  <button className="text-teal/60 hover:text-teal transition-colors">
                    <Icon name="Heart" size={16} className="fill-current" />
                  </button>
                </div>
                <p className="text-xs font-body text-muted-foreground mb-2">{fav.items}</p>
                <p className="text-[10px] text-muted-foreground/60 font-body">Сохранено {fav.saved}</p>
              </div>
            </div>
            <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-3">
              <button className="text-xs font-body text-teal hover:text-teal/80 transition-colors">Примерить снова</button>
              <span className="text-white/10">·</span>
              <button className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">Поделиться</button>
              <span className="text-white/10">·</span>
              <button className="text-xs font-body text-muted-foreground hover:text-destructive transition-colors">Удалить</button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 border border-dashed border-white/10 hover:glass-active transition-all">
        <Icon name="Plus" size={16} className="text-muted-foreground" />
        <span className="font-body text-sm text-muted-foreground">Создать новый образ</span>
      </button>
    </div>
  );
}

export function HistorySection() {
  const fitColors: Record<string, string> = {
    "Идеально": "text-teal",
    "Хорошо": "text-green-400",
    "Маловато": "text-amber-400",
  };

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">История</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Ранее примеренные вещи</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Примерок", value: "24" },
          { label: "Идеально", value: "14" },
          { label: "Куплено", value: "7" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <p className="text-2xl font-display font-light text-teal">{s.value}</p>
            <p className="text-[10px] font-body text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {historyItems.map((item, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 hover:glass-active transition-all duration-300">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={CLOTHES_IMG} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-foreground text-sm">{item.name}</p>
              <p className="text-xs font-body text-muted-foreground">{item.date}</p>
            </div>
            <span className={`text-xs font-body font-medium ${fitColors[item.fit] || "text-muted-foreground"}`}>
              {item.fit}
            </span>
            <button className="glass w-8 h-8 rounded-lg flex items-center justify-center hover:glass-active transition-all">
              <Icon name="RotateCcw" size={12} className="text-muted-foreground" />
            </button>
          </div>
        ))}
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
