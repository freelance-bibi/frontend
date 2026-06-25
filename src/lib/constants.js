import {
  Palette,
  Code2,
  PenLine,
  BookOpen,
  TrendingUp,
  Clapperboard,
  Headphones,
  Sparkles,
} from "lucide-react";

export const CATEGORIES = [
  { id: "design", label: "Дизайн", icon: Palette, keywords: ["дизайн", "логотип", "figma", "ui", "ux", "баннер", "иллюстрац"] },
  { id: "dev", label: "Разработка", icon: Code2, keywords: ["сайт", "код", "бэкенд", "фронтенд", "python", "react", "бот", "приложен", "разработ"] },
  { id: "writing", label: "Тексты", icon: PenLine, keywords: ["текст", "копирайт", "статья", "рерайт", "перевод", "эссе"] },
  { id: "study", label: "Учёба", icon: BookOpen, keywords: ["курсов", "диплом", "реферат", "лаборатор", "контрольн", "задач", "решен"] },
  { id: "marketing", label: "Маркетинг", icon: TrendingUp, keywords: ["smm", "реклам", "маркетинг", "продвижен", "таргет", "seo"] },
  { id: "video", label: "Видео и фото", icon: Clapperboard, keywords: ["видео", "монтаж", "фото", "обработк", "съёмк"] },
  { id: "music", label: "Аудио", icon: Headphones, keywords: ["звук", "аудио", "озвуч", "подкаст", "музык"] },
  { id: "other", label: "Другое", icon: Sparkles, keywords: [] },
];

export function matchCategory(kwork, categoryId) {
  if (!categoryId) return true;
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat || !cat.keywords.length) return categoryId === "other";
  const haystack = (
    (kwork.title || "") +
    " " +
    (kwork.description || "") +
    " " +
    (kwork.tags || []).map((t) => t.name).join(" ")
  ).toLowerCase();
  return cat.keywords.some((kw) => haystack.includes(kw));
}

export const SORT_OPTIONS = [
  { id: "new", label: "Сначала новые" },
  { id: "price_asc", label: "Сначала дешевле" },
  { id: "price_desc", label: "Сначала дороже" },
];
