import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AVATAR_IMG, CLOTHES_IMG, aiRecommendations } from "@/components/constants";

export default function TryOnSection({ rotateY, setRotateY }: { rotateY: number; setRotateY: (v: number) => void }) {
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
