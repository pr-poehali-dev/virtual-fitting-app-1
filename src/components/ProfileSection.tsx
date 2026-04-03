import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AVATAR_IMG } from "@/components/constants";

const BODY_TYPES = ["Прямоугольник", "Трапеция", "Песочные часы", "Яблоко", "Груша"];

interface Profile {
  name: string;
  height: string;
  chest: string;
  waist: string;
  hips: string;
  size: string;
  weight: string;
  bodyType: string;
}

const DEFAULT_PROFILE: Profile = {
  name: "Алексей М.",
  height: "178",
  chest: "96",
  waist: "78",
  hips: "102",
  size: "M / 48",
  weight: "72",
  bodyType: "Прямоугольник",
};

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem("fitroom_profile");
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function ProfileSection() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);

  const handleEdit = () => {
    setDraft({ ...profile });
    setEditing(true);
  };

  const handleSave = () => {
    setProfile(draft);
    localStorage.setItem("fitroom_profile", JSON.stringify(draft));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditing(false);
  };

  const field = (key: keyof Profile, label: string, unit?: string) => (
    <div className="glass rounded-xl p-3 text-center">
      {editing ? (
        <input
          type="text"
          value={draft[key]}
          onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
          className="w-full bg-transparent text-center text-base font-body font-bold text-teal outline-none border-b border-teal/40 focus:border-teal pb-0.5"
        />
      ) : (
        <p className="text-lg font-body font-bold text-foreground">{profile[key]}</p>
      )}
      {unit && <p className="text-[10px] text-muted-foreground font-body mt-0.5">{unit}</p>}
      <p className="text-[10px] text-muted-foreground/70 font-body mt-0.5">{label}</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-5 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-foreground">Мои размеры</h2>
          <p className="text-muted-foreground text-sm font-body mt-1">Антропометрические данные</p>
        </div>
        {!editing ? (
          <button
            onClick={handleEdit}
            className="glass px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:glass-active transition-all"
          >
            <Icon name="Pencil" size={13} className="text-teal" />
            <span className="text-xs font-body text-teal">Изменить</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="glass px-3 py-1.5 rounded-xl text-xs font-body text-muted-foreground hover:bg-white/5 transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="glass-active px-3 py-1.5 rounded-xl text-xs font-body text-teal hover:glow-teal-sm transition-all"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-20 h-20 opacity-10 animate-pulse-slow">
          <div className="w-full h-full rounded-full border-2 border-teal/50" />
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden">
            <img src={AVATAR_IMG} alt="Силуэт" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="bg-transparent font-body font-semibold text-foreground outline-none border-b border-teal/40 focus:border-teal w-full pb-0.5"
                placeholder="Имя"
              />
            ) : (
              <p className="font-body font-semibold text-foreground">{profile.name}</p>
            )}
            <p className="text-xs text-muted-foreground font-body mt-0.5">3D профиль · {editing ? "Редактирование..." : "Сохранён"}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${editing ? "bg-amber-400" : "bg-teal"}`} />
              <span className={`text-[10px] font-body ${editing ? "text-amber-400" : "text-teal"}`}>
                {editing ? "Режим редактирования" : "Профиль активен"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {field("height", "Рост", "см")}
          {field("chest", "Грудь", "см")}
          {field("waist", "Талия", "см")}
          {field("hips", "Бёдра", "см")}
          {field("size", "Размер")}
          {field("weight", "Вес", "кг")}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={14} className="text-teal" />
          <h3 className="font-body font-semibold text-foreground">Тип телосложения</h3>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
          {BODY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => editing && setDraft(d => ({ ...d, bodyType: type }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                (editing ? draft.bodyType : profile.bodyType) === type
                  ? "glass-active text-teal"
                  : "glass text-muted-foreground"
              } ${editing ? "cursor-pointer hover:glass-active" : "cursor-default"}`}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          {editing
            ? "Выберите тип телосложения, наиболее близкий к вашему."
            : `Тип «${profile.bodyType}» — AI подбирает вещи, которые выгодно подчёркивают вашу фигуру.`}
        </p>
      </div>

      {!editing && (
        <button
          onClick={handleEdit}
          className="w-full glass-active rounded-2xl p-4 flex items-center justify-center gap-2 hover:glow-teal transition-all duration-300"
        >
          <Icon name="RefreshCw" size={16} className="text-teal" />
          <span className="font-body font-medium text-teal text-sm">Обновить замеры</span>
        </button>
      )}
    </div>
  );
}
