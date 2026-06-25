import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Wallet,
  MessagesSquare,
  Star,
  TrendingUp,
  Zap,
  Building2,
  Cpu,
  Factory,
  Landmark,
} from "lucide-react";
import { kworksApi } from "../lib/api";
import { CATEGORIES } from "../lib/constants";
import { Button, Card, Avatar } from "../components/ui";
import TaskCard from "../components/TaskCard";

const HERO_TEXT = "Зарабатывай на том,\nчто умеешь";
const HERO_HIGHLIGHT_FROM = HERO_TEXT.indexOf("умеешь");

const PARTNER_GROUPS = [
  {
    id: "build",
    icon: Building2,
    label: "Строительство и архитектура",
    items: [
      "СРО строителей Брянской области",
      "СРО проектировщиков Брянской области",
      "Управление автомобильных дорог Брянской области",
      "Профильные компании региона",
    ],
  },
  {
    id: "it",
    icon: Cpu,
    label: "ИТ и цифровые технологии",
    items: ["Яндекс", "Деснол-софт", "Веб-центр"],
  },
  {
    id: "industry",
    icon: Factory,
    label: "Машиностроение и лесной комплекс",
    items: [
      "АО «Брянсксельмаш»",
      "АО «Брянский автомобильный завод» (БАЗ)",
      "Лесопромышленные предприятия региона",
    ],
  },
  {
    id: "finance",
    icon: Landmark,
    label: "Финансовый сектор",
    items: [
      "Сбербанк",
      "ВТБ",
      "Промсвязьбанк",
      "Россельхозбанк",
      "Центральный банк РФ",
    ],
  },
];

const PARTNER_ROWS = [
  PARTNER_GROUPS.flatMap((g) => g.items.map((name) => ({ name, group: g }))),
  PARTNER_GROUPS.flatMap((g) =>
    [...g.items].reverse().map((name) => ({ name, group: g }))
  ),
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    kworksApi
      .list({ limit: 8 })
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    if (typedCount >= HERO_TEXT.length) return;
    const t = setTimeout(() => setTypedCount((c) => c + 1), 75);
    return () => clearTimeout(t);
  }, [typedCount]);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/tasks${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <>
      <section className="relative -mt-[4.5rem] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0" />
          <div className="animate-blob-a absolute -left-40 -top-40 size-[30rem] rounded-full bg-brand-400/30 blur-3xl" />
          <div className="animate-blob-b absolute -right-32 top-24 size-[28rem] rounded-full bg-brand-500/25 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-[calc(4.5rem+4rem)] sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-[calc(4.5rem+6rem)] lg:px-8">
          <div className="animate-fade-up">
            <h1 className="mt-5 min-h-[2.2em] font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              {HERO_TEXT.slice(0, typedCount)
                .split("\n")
                .map((line, li, lines) => {
                  const start = HERO_TEXT.slice(0, typedCount)
                    .split("\n")
                    .slice(0, li)
                    .reduce((acc, l) => acc + l.length + 1, 0);
                  const hlStart = Math.max(0, HERO_HIGHLIGHT_FROM - start);
                  return (
                    <span key={li}>
                      {line.slice(0, hlStart)}
                      <span className="text-brand-500">{line.slice(hlStart)}</span>
                      {li < lines.length - 1 && <br />}
                    </span>
                  );
                })}
              <span className="ml-0.5 animate-pulse text-brand-500" aria-hidden="true">
                |
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-500">
              БГИТУ Фриланс соединяет студентов, которым нужна помощь, с теми, кто
              готов её оказать. Дизайн, код, тексты, курсовые — найди заказ или
              исполнителя за пару минут.
            </p>

            <form
              onSubmit={handleSearch}
              className="liquid-glass mt-7 flex max-w-md items-center gap-2 rounded-2xl p-1.5"
            >
              <div className="flex flex-1 items-center gap-2 pl-3">
                <Search className="size-5 text-ink-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Например: логотип, лендинг, курсовая..."
                  className="w-full bg-transparent py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary">
                Найти
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Stat value="2 500+" label="исполнителей" />
              <Stat value="4 800+" label="заказов" />
              <Stat value="98%" label="довольных" />
            </div>
          </div>

          <div className="relative animate-fade-up lg:h-[30rem]">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <Feature
            icon={Wallet}
            title="Без комиссий"
            text="Платформа создана вузом, поэтому не берёт комиссий — оплата напрямую в чате."
          />
          <Feature
            icon={ShieldCheck}
            title="Отзывы и рейтинг"
            text="Репутация на основе реальных сделок."
          />
          <Feature
            icon={MessagesSquare}
            title="Встроенный чат"
            text="Общайтесь с исполнителем напрямую, не покидая платформу."
          />
          <Feature
            icon={Zap}
            title="Быстрый старт"
            text="Регистрация и первое объявление за 2 минуты."
          />
        </div>
      </section>

      <section id="how" className="scroll-mt-20 bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Как это работает"
            title="Три простых шага"
            subtitle="От регистрации до первого заказа"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              n="1"
              title="Создай аккаунт"
              text="Зарегистрируйся, заполни профиль, добавь навыки и портфолио."
            />
            <Step
              n="2"
              title="Найди заказ или размести услугу"
              text="Откликайся на объявления или публикуй свои услуги с ценой."
            />
            <Step
              n="3"
              title="Общайся и выполняй"
              text="При заказе автоматически открывается чат — обсуждайте детали и сдавайте работу."
            />
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Категории"
          title="Чем можно заняться"
          subtitle="Выбирай направление и смотри актуальные объявления"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
            <Link
              key={cat.id}
              to={`/tasks?cat=${cat.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:bg-slate-900"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:scale-110 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon className="size-6" />
              </span>
              <div>
                <div className="font-semibold text-ink-900">{cat.label}</div>
                <div className="flex items-center gap-1 text-xs text-brand-500">
                  Смотреть <ArrowRight className="size-3" />
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <section id="partners" className="scroll-mt-20 border-y border-slate-200 bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Партнёры"
            title="Нам доверяют"
            subtitle="Основные стратегические и индустриальные партнёры вуза"
          />
        </div>

        <div className="mt-12 flex flex-col gap-4">
          {PARTNER_ROWS.map((row, i) => (
            <div key={i} className="marquee">
              <div
                className="marquee__track gap-4"
                style={{
                  "--marquee-duration": `${90 + i * 20}s`,
                  animationDirection: i % 2 ? "reverse" : "normal",
                }}
              >
                {[...row, ...row].map((p, j) => (
                  <PartnerChip key={`${i}-${j}`} name={p.name} group={p.group} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {tasks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHead
              align="left"
              eyebrow="Свежие объявления"
              title="Последние заказы"
              subtitle="Только что опубликованы на платформе"
            />
            <Button as={Link} to="/tasks" variant="outline" className="hidden sm:inline-flex">
              Все объявления <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tasks.slice(0, 4).map((k) => (
              <TaskCard key={k.id} kwork={k} />
            ))}
          </div>
        </section>
      )}

    </>
  );
}

function PartnerChip({ name, group }) {
  const Icon = group.icon;
  return (
    <div
      title={group.label}
      className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:bg-slate-900"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        <Icon className="size-4" />
      </span>
      <span className="whitespace-nowrap font-semibold text-ink-900">
        {name}
      </span>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="font-display text-2xl font-extrabold text-ink-900">
        {value}
      </div>
      <div className="text-sm text-ink-500">{label}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-semibold text-ink-900">{title}</h3>
        <p className="mt-0.5 text-sm text-ink-500">{text}</p>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-ink-500 ${
            align === "center" ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-xl font-extrabold text-white shadow-lg shadow-brand-500/30">
        {n}
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-500">{text}</p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-full max-w-md">
      <Card
        className="float-card liquid-glass-strong absolute left-0 top-4 w-64 p-5"
        style={{ "--card-rotate": "-4deg", "--float-duration": "6s", "--float-delay": "0s" }}
      >
        <div className="flex items-center gap-3">
          <Avatar name="Анна К" size={44} />
          <div>
            <div className="font-semibold text-ink-900">Анна К.</div>
            <div className="text-xs text-ink-500">UI/UX дизайнер</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-accent-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
          <span className="ml-1 text-xs text-ink-500">5.0</span>
        </div>
      </Card>

      <Card
        className="float-card absolute right-0 top-32 w-72 overflow-hidden p-0 shadow-xl"
        style={{ "--card-rotate": "3deg", "--float-duration": "7s", "--float-delay": "-2s" }}
      >
        <img
          src="/compas.png"
          alt="Telegram-бот для расписания"
          className="aspect-[16/9] w-full object-cover object-top"
        />
        <div className="p-4">
          <div className="text-xs font-semibold text-brand-500">#разработка</div>
          <div className="mt-1 font-semibold text-ink-900">
            Telegram-бот для расписания
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-ink-900">3 500 ₽</span>
            <span className="rounded-full bg-mint-500/10 px-2 py-0.5 text-xs font-semibold text-mint-500">
              Открыто
            </span>
          </div>
        </div>
      </Card>

      <Card
        className="float-card liquid-glass-strong absolute bottom-2 left-6 flex w-56 items-center gap-3 p-4"
        style={{ "--card-rotate": "0deg", "--float-duration": "5.5s", "--float-delay": "-1s" }}
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-mint-500/10 text-mint-500">
          <TrendingUp className="size-5" />
        </div>
        <div>
          <div className="text-xs text-ink-500">Заработано за месяц</div>
          <div className="font-display text-xl font-extrabold text-ink-900">
            24 900 ₽
          </div>
        </div>
      </Card>
    </div>
  );
}
