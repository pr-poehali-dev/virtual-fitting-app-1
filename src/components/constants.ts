export const AVATAR_IMG = "https://cdn.poehali.dev/projects/b6a87b73-ede5-4bb9-8bc3-e0bdc8107046/files/0459cc92-f36a-4ef4-9ec0-f742eb26bbb1.jpg";
export const CLOTHES_IMG = "https://cdn.poehali.dev/projects/b6a87b73-ede5-4bb9-8bc3-e0bdc8107046/files/70617807-7fc2-4829-a98e-b60e6ee400a7.jpg";

export type Section = "tryon" | "profile" | "scan" | "favorites" | "history" | "share";

export const navItems = [
  { id: "tryon" as Section, icon: "Scan", label: "Примерка" },
  { id: "profile" as Section, icon: "User", label: "Профиль" },
  { id: "scan" as Section, icon: "Camera", label: "Скан" },
  { id: "favorites" as Section, icon: "Heart", label: "Избранное" },
  { id: "history" as Section, icon: "Clock", label: "История" },
  { id: "share" as Section, icon: "Share2", label: "Поделиться" },
];

export const aiRecommendations = [
  { label: "Оверсайз-пальто", match: 94, tag: "Твой стиль" },
  { label: "Прямые брюки", match: 88, tag: "Тренд" },
  { label: "Водолазка", match: 82, tag: "Базовое" },
];

export const measurements = [
  { label: "Рост", value: "178", unit: "см" },
  { label: "Грудь", value: "96", unit: "см" },
  { label: "Талия", value: "78", unit: "см" },
  { label: "Бёдра", value: "102", unit: "см" },
  { label: "Размер", value: "M / 48", unit: "" },
  { label: "Вес", value: "72", unit: "кг" },
];

export const historyItems = [
  { name: "Куртка Zara", date: "Вчера", fit: "Идеально" },
  { name: "Платье H&M", date: "3 дня назад", fit: "Маловато" },
  { name: "Пальто Pull&Bear", date: "Неделю назад", fit: "Хорошо" },
  { name: "Джинсы Levi's", date: "2 недели назад", fit: "Идеально" },
];

export const favoritesItems = [
  { name: "Образ #1", items: "Пальто + Брюки", saved: "5 янв" },
  { name: "Образ #2", items: "Куртка + Джинсы", saved: "12 янв" },
  { name: "Образ #3", items: "Платье + Поясок", saved: "20 янв" },
];
