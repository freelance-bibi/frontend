import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/constants";
import Logo from "./Brand";
import ThemeToggle from "./ThemeToggle";
import { Avatar } from "./ui";

const navLink =
  "text-[15px] font-medium text-ink-900 transition hover:text-brand-600";

export default function LandingNavbar() {
  const { isAuthenticated, user } = useAuth();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-slate-200/50 bg-white/55 backdrop-blur-xl backdrop-saturate-150 dark:border-slate-700/50 dark:bg-slate-900/55"
          : "border-b border-transparent bg-transparent dark:border-slate-700/50 dark:bg-slate-900/55"
      }`}
    >
      <div className="relative mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:px-10">
        <div className="items-center flex">
          <Logo />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className={`inline-flex items-center gap-1 ${navLink}`}
            >
              Категории
              <ChevronDown
                className={`size-4 transition ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            {catOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-200/60 dark:bg-slate-900">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/tasks?cat=${cat.id}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-slate-50 hover:text-brand-600"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/#how" className={navLink}>
            Для студентов
          </Link>
          <Link to="/#partners" className={navLink}>
            Партнёры
          </Link>
          <Link to="/tasks" className={navLink}>
            Объявления
          </Link>
        </nav>

        <div className="hidden items-center justify-self-end gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 py-1 pl-1 pr-5 text-[15px] font-semibold text-white transition hover:bg-brand-700"
            >
              <Avatar user={user} size={32} />
              Мой кабинет
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-brand-700"
            >
              Регистрация / Вход
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        <button
          type="button"
          className="absolute right-5 flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-50 md:hidden sm:right-8"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden dark:bg-slate-900">
          <nav className="flex flex-col gap-1">
            <div className="mb-1 flex items-center justify-between rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium text-ink-700">Тема</span>
              <ThemeToggle className="size-9" />
            </div>
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-300">
              Категории
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/tasks?cat=${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/#how"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
            >
              Для студентов
            </Link>
            <Link
              to="/#partners"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
            >
              Партнёры
            </Link>
            <Link
              to="/tasks"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
            >
              Объявления
            </Link>

            {isAuthenticated ? (
              <Link
                to="/tasks"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 py-1 pl-1 pr-5 text-sm font-semibold text-white"
              >
                <Avatar user={user} size={32} />
                Мой кабинет
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Регистрация / Вход
                <ArrowRight className="size-4" />
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
