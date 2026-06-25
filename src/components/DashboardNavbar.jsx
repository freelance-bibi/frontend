import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/constants";
import { Avatar } from "./ui";
import { formatPrice } from "../lib/format";
import TopUpModal from "./TopUpModal";
import Logo from "./Brand";
import ThemeToggle from "./ThemeToggle";

export default function DashboardNavbar({ onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <button
        type="button"
        onClick={onToggleSidebar}
        title="Свернуть/развернуть меню"
        className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-700 transition hover:bg-slate-50 dark:hover:bg-slate-800 lg:flex"
      >
        <Menu className="size-6" />
      </button>

      <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-5 sm:px-8 lg:pr-10 lg:pl-[4.5rem]">
        <Logo to="/" />

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setTopUpOpen(true)}
                title="Пополнить баланс"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:bg-brand-50 dark:bg-slate-900 dark:hover:bg-brand-500/15"
              >
                <Wallet className="size-4 text-brand-600" />
                {formatPrice(user?.balance ?? 0)}
                <span className="flex size-4 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Plus className="size-3" />
                </span>
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition hover:bg-slate-50"
                >
                  <Avatar user={user} size={36} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-200/60 dark:bg-slate-900">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-slate-50"
                    >
                      <User className="size-4 text-ink-500" />
                      Мой профиль
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="size-4 text-ink-500" />
                      Сообщения
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="size-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
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
          className="absolute right-5 ml-auto flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-slate-50 md:hidden sm:right-8"
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
            <Link
              to="/tasks"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
            >
              Объявления
            </Link>
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

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setTopUpOpen(true);
                  }}
                  className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-ink-900"
                >
                  <span className="flex items-center gap-2">
                    <Wallet className="size-4 text-brand-600" />
                    Баланс: {formatPrice(user?.balance ?? 0)}
                  </span>
                  <span className="text-brand-600">Пополнить</span>
                </button>
                <Link
                  to="/messages"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                >
                  Сообщения
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                >
                  Мой профиль
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                >
                  <Home className="size-4" />
                  На главную
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-slate-50"
                >
                  <Home className="size-4" />
                  На главную
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Регистрация / Вход
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </header>
  );
}
