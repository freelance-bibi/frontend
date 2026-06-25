import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { BrandMark, BrandName } from "./Brand";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <BrandMark className="size-9" />
              <BrandName />
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-500">
              Биржа фриланса для студентов. Находи заказы, прокачивай навыки и
              зарабатывай во время учёбы.
            </p>
          </div>

          <FooterCol
            title="Платформа"
            links={[
              { to: "/tasks", label: "Все объявления" },
              { to: "/tasks/new", label: "Разместить объявление" },
              { to: "/register", label: "Стать исполнителем" },
              { to: "/messages", label: "Сообщения" },
            ]}
          />
          <FooterCol
            title="Категории"
            links={[
              { to: "/tasks?cat=design", label: "Дизайн" },
              { to: "/tasks?cat=dev", label: "Разработка" },
              { to: "/tasks?cat=writing", label: "Тексты" },
              { to: "/tasks?cat=study", label: "Учёба" },
              { to: "/tasks?cat=marketing", label: "Маркетинг" },
            ]}
          />
          <FooterCol
            title="О платформе"
            links={[
              { to: "/#how", label: "Как это работает" },
              { to: "/#categories", label: "Категории" },
              { to: "/#partners", label: "Партнёры" },
              { to: "/login", label: "Войти в аккаунт" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-ink-300 sm:flex-row">
          <span>© {new Date().getFullYear()} БГИТУ Фриланс. Все права защищены.</span>
          <span className="inline-flex items-center gap-1">
            Сделано для студентов
            <Heart className="size-4 fill-brand-500 text-brand-500" />
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-ink-900">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link
              to={l.to}
              className="text-sm text-ink-500 transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
