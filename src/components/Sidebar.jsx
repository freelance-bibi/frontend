import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  Plus,
  MessageSquare,
  User,
  ChevronDown,
} from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";

const itemBase = "flex items-center gap-3 rounded-xl text-sm font-medium transition";
const itemIdle =
  "text-ink-700 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-slate-800";
const itemActive =
  "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300";

export default function Sidebar({ collapsed = false }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get("cat") || "";
  const onTasks = location.pathname === "/tasks";

  const [catsOpen, setCatsOpen] = useState(true);

  const navItems = [
    { to: "/messages", label: "Сообщения", icon: MessageSquare, show: isAuthenticated },
    { to: "/profile", label: "Мой профиль", icon: User, show: isAuthenticated },
  ].filter((i) => i.show);

  const renderItem = (to, label, Icon, active, extra = "") => (
    <Link
      key={to}
      to={to}
      title={collapsed ? label : undefined}
      className={`${itemBase} ${active ? itemActive : itemIdle} ${
        collapsed ? "justify-center px-2 py-2.5" : `px-3 py-2.5 ${extra}`
      }`}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  return (
    <aside
      className={`sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] shrink-0 overflow-y-auto border-r border-slate-200/70 bg-white/60 px-3 py-4 transition-[width] duration-200 lg:block dark:border-slate-800 dark:bg-slate-900/40 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      <nav className="flex flex-col gap-1">
        {isAuthenticated && (
          <Link
            to="/tasks/new"
            title={collapsed ? "Разместить" : undefined}
            className={`mb-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition-colors hover:bg-brand-700 ${
              collapsed ? "size-11 self-center p-0" : "px-4 py-2.5 text-sm"
            }`}
          >
            <Plus className="size-[18px] shrink-0" />
            {!collapsed && "Разместить"}
          </Link>
        )}

        <div className={collapsed ? "" : "flex items-center gap-1"}>
          <Link
            to="/tasks"
            title={collapsed ? "Объявления" : undefined}
            className={`${itemBase} flex-1 ${
              onTasks && !activeCat ? itemActive : itemIdle
            } ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}`}
          >
            <LayoutGrid className="size-[18px] shrink-0" />
            {!collapsed && <span className="truncate">Объявления</span>}
          </Link>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCatsOpen((v) => !v)}
              title={catsOpen ? "Скрыть категории" : "Показать категории"}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-ink-400 transition hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-slate-800"
            >
              <ChevronDown
                className={`size-4 transition ${catsOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {!collapsed && catsOpen && (
          <div className="ml-[18px] flex flex-col gap-0.5 border-l border-slate-200/80 pl-3 dark:border-slate-800">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = onTasks && activeCat === cat.id;
              return (
                <Link
                  key={cat.id}
                  to={`/tasks?cat=${cat.id}`}
                  className={`${itemBase} px-3 py-2 ${
                    active ? itemActive : itemIdle
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return renderItem(item.to, item.label, item.icon, active, "mt-0.5");
        })}
      </nav>
    </aside>
  );
}
