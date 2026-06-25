import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      aria-label="Переключить тему"
      className={`inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-700 transition hover:bg-slate-50 hover:text-brand-600 dark:bg-slate-900 ${className}`}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
