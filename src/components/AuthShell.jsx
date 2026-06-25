import { Link } from "react-router-dom";
import { Star, Check } from "lucide-react";
import { BrandMark, BrandName } from "./Brand";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-10 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 inline-flex items-center gap-2">
            <BrandMark className="size-9" />
            <BrandName />
          </Link>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-ink-500">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-brand-600 lg:flex lg:w-1/2">
        <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-[28rem] rounded-full bg-accent-400/20" />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Фриланс, который
            <br />
            работает на твою учёбу
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            Присоединяйся к тысячам студентов, которые зарабатывают на своих
            навыках и набирают портфолио ещё до диплома.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Бесплатная регистрация",
              "Заказы под любой навык",
              "Встроенный чат и отзывы",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-brand-50">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-1 text-accent-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm text-brand-50">
              «За семестр я собрала портфолио и нашла первых клиентов прямо
              здесь. Очень удобно совмещать с парами!»
            </p>
            <p className="mt-3 text-sm font-semibold">— Мария, 3 курс</p>
          </div>
        </div>
      </div>
    </div>
  );
}
