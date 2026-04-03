import { useState } from "react";
import Icon from "@/components/ui/icon";

const AVATAR_IMG = "https://cdn.poehali.dev/projects/b6a87b73-ede5-4bb9-8bc3-e0bdc8107046/files/0459cc92-f36a-4ef4-9ec0-f742eb26bbb1.jpg";
const CLOTHES_IMG = "https://cdn.poehali.dev/projects/b6a87b73-ede5-4bb9-8bc3-e0bdc8107046/files/70617807-7fc2-4829-a98e-b60e6ee400a7.jpg";

type Section = "tryon" | "profile" | "scan" | "favorites" | "history" | "share";

const navItems = [
  { id: "tryon" as Section, icon: "Scan", label: "Примерка" },
  { id: "profile" as Section, icon: "User", label: "Профиль" },
  { id: "scan" as Section, icon: "Camera", label: "Скан" },
  { id: "favorites" as Section, icon: "Heart", label: "Избранное" },
  { id: "history" as Section, icon: "Clock", label: "История" },
  { id: "share" as Section, icon: "Share2", label: "Поделиться" },
];

const aiRecommendations = [
  { label: "Оверсайз-пальто", match: 94, tag: "Твой стиль" },
  { label: "Прямые брюки", match: 88, tag: "Тренд" },
  { label: "Водолазка", match: 82, tag: "Базовое" },
];

const measurements = [
  { label: "Рост", value: "178", unit: "см" },
  { label: "Грудь", value: "96", unit: "см" },
  { label: "Талия", value: "78", unit: "см" },
  { label: "Бёдра", value: "102", unit: "см" },
  { label: "Размер", value: "M / 48", unit: "" },
  { label: "Вес", value: "72", unit: "кг" },
];

const historyItems = [
  { name: "Куртка Zara", date: "Вчера", fit: "Идеально" },
  { name: "Платье H&M", date: "3 дня назад", fit: "Маловато" },
  { name: "Пальто Pull&Bear", date: "Неделю назад", fit: "Хорошо" },
  { name: "Джинсы Levi's", date: "2 недели назад", fit: "Идеально" },
];

const favoritesItems = [
  { name: "Образ #1", items: "Пальто + Брюки", saved: "5 янв" },
  { name: "Образ #2", items: "Куртка + Джинсы", saved: "12 янв" },
  { name: "Образ #3", items: "Платье + Поясок", saved: "20 янв" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("tryon");
  const [rotateY, setRotateY] = useState(0);
  const [scanDone, setScanDone] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanDone(true);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(186,80%,54%) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-6"
          style={{ background: "radial-gradient(circle, hsl(200,70%,50%) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight text-gradient">FitRoom</h1>
          <p className="text-muted-foreground text-xs font-body tracking-widest uppercase mt-0.5">Виртуальная примерочная</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-active transition-all duration-300">
            <Icon name="Bell" size={15} className="text-muted-foreground" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-primary/50 flex items-center justify-center glow-teal-sm">
            <span className="text-background text-xs font-bold font-body">АМ</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10 px-5 pb-28 overflow-y-auto">
        {activeSection === "tryon" && <TryOnSection rotateY={rotateY} setRotateY={setRotateY} />}
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "scan" && <ScanSection scanning={scanning} scanDone={scanDone} onScan={handleScan} />}
        {activeSection === "favorites" && <FavoritesSection />}
        {activeSection === "history" && <HistorySection />}
        {activeSection === "share" && <ShareSection />}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-4 mb-5 glass rounded-2xl px-2 py-3 glow-teal-sm">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? "glass-active nav-item-active" : "hover:bg-white/5"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className={`transition-colors duration-300 ${isActive ? "text-teal" : "text-muted-foreground"}`}
                  />
                  <span className={`text-[9px] font-body font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? "text-teal" : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

function TryOnSection({ rotateY, setRotateY }: { rotateY: number; setRotateY: (v: number) => void }) {
  const [selectedItem, setSelectedItem] = useState<number | null>(0);
  const clothes = [
    { name: "Оверсайз-пальто", brand: "Zara", size: "M", price: "8 990 ₽" },
    { name: "Прямые брюки", brand: "H&M", size: "46", price: "2 499 ₽" },
    { name: "Кашемир-джемпер", brand: "Uniqlo", size: "M", price: "3 990 ₽" },
  ];

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      {/* 3D Model view */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 340 }}>
        <div className="absolute inset-0 glass">
          <img src={AVATAR_IMG} alt="3D модель" className="w-full h-full object-cover opacity-80 animate-float" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, hsl(220,20%,6%) 0%, transparent 40%, transparent 70%, hsl(220,20%,6%) 100%)"
          }} />
        </div>

        {/* Rotate control */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => setRotateY(r => r - 45)}
            className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-active transition-all"
          >
            <Icon name="RotateCcw" size={14} className="text-teal" />
          </button>
          <div className="glass px-4 py-1.5 rounded-full">
            <span className="text-xs font-body text-muted-foreground">{((rotateY % 360 + 360) % 360)}°</span>
          </div>
          <button
            onClick={() => setRotateY(r => r + 45)}
            className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-active transition-all"
          >
            <Icon name="RotateCw" size={14} className="text-teal" />
          </button>
        </div>

        {/* Size badge */}
        <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-xl">
          <span className="text-xs font-body text-teal font-medium">Размер M · 48</span>
        </div>

        {/* AI badge */}
        <div className="absolute top-4 left-4 glass-active px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-xs font-body text-teal font-medium">AI анализ</span>
        </div>
      </div>

      {/* Clothes selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-foreground/90">Примеряемые вещи</h2>
          <button className="text-teal text-xs font-body">Добавить</button>
        </div>
        <div className="space-y-2">
          {clothes.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedItem(i)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left ${
                selectedItem === i ? "glass-active" : "glass hover:bg-white/5"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${selectedItem === i ? "glow-teal-sm" : ""}`}>
                <img src={CLOTHES_IMG} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs font-body text-muted-foreground">{item.brand} · {item.size}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-body font-medium text-teal">{item.price}</p>
                {selectedItem === i && (
                  <span className="text-[9px] text-teal/70 font-body">На модели</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={14} className="text-teal" />
          <h2 className="font-display text-lg text-foreground/90">AI-рекомендации</h2>
        </div>
        <div className="space-y-2">
          {aiRecommendations.map((rec, i) => (
            <div key={i} className="glass rounded-xl p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-body font-medium text-foreground">{rec.label}</span>
                  <span className="text-[9px] font-body px-1.5 py-0.5 rounded-full glass-active text-teal">{rec.tag}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${rec.match}%`, background: "linear-gradient(90deg, hsl(186,80%,54%), hsl(200,80%,60%))" }}
                  />
                </div>
              </div>
              <span className="text-teal font-body font-bold text-sm flex-shrink-0">{rec.match}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div>
        <h2 className="font-display text-2xl font-light text-foreground">Мои размеры</h2>
        <p className="text-muted-foreground text-sm font-body mt-1">Антропометрические данные</p>
      </div>

      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-20 h-20 opacity-10 animate-pulse-slow">
          <div className="w-full h-full rounded-full border-2 border-teal/50" />
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden">
            <img src={AVATAR_IMG} alt="Силуэт" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-body font-semibold text-foreground">Алексей М.</p>
            <p className="text-xs text-muted-foreground font-body">3D профиль · Обновлён 2 дня назад</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal" />
              <span className="text-[10px] text-teal font-body">Профиль активен</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {measurements.map((m, i) => (
            <div key={i} className="glass rounded-xl p-3 text-center">
              <p className="text-lg font-body font-bold text-foreground">{m.value}</p>
              {m.unit && <p className="text-[10px] text-muted-foreground font-body">{m.unit}</p>}
              <p className="text-[10px] text-muted-foreground/70 font-body mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={14} className="text-teal" />
          <h3 className="font-body font-semibold text-foreground">Тип телосложения</h3>
        </div>
        <div className="flex gap-2 mb-3">
          {["Прямоугольник", "Трапеция", "Песочные часы"].map((type, i) => (
            <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
              i === 0 ? "glass-active text-teal" : "glass text-muted-foreground"
            }`}>{type}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          На основе ваших параметров AI определил тип «Прямоугольник». Рекомендуются вещи, создающие визуальную талию.
        </p>
      </div>

      <button className="w-full glass-active rounded-2xl p-4 flex items-center justify-center gap-2 hover:glow-teal transition-all duration-300">
        <Icon name="RefreshCw" size={16} className="text-teal" />
        <span className="font-body font-medium text-teal text-sm">Обновить замеры</span>
      </button>
    </div>
  );
}

function ScanSection({ scanning, scanDone, onScan }: { scanning: boolean; scanDone: boolean; onScan: () => void }) {
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

function FavoritesSection() {
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

function HistorySection() {
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

function ShareSection() {
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
