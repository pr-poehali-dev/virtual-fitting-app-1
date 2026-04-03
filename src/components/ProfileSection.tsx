import Icon from "@/components/ui/icon";
import { AVATAR_IMG, measurements } from "@/components/constants";

export default function ProfileSection() {
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
