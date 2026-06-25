import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, Plus, PackageOpen, X } from "lucide-react";
import { kworksApi, extractError } from "../lib/api";
import { CATEGORIES, matchCategory, SORT_OPTIONS } from "../lib/constants";
import { Button, Card, PageLoader, EmptyState, Alert } from "../components/ui";
import TaskCard, { TaskCardSkeleton } from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 9;
const FAKE_DELAY = 700;

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:bg-slate-900";

export default function TasksPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";
  const sort = searchParams.get("sort") || "new";
  const onlyOpen = searchParams.get("open") !== "0";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";

  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    kworksApi
      .list({ limit: 100 })
      .then((data) => {
        if (active) setAllTasks(data);
      })
      .catch((err) => active && setError(extractError(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function setParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, value);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let list = [...allTasks];

    if (onlyOpen) {
      list = list.filter((k) => k.status === "not_completed");
    }
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (k) =>
          k.title?.toLowerCase().includes(needle) ||
          k.description?.toLowerCase().includes(needle) ||
          (k.tags || []).some((t) => t.name.toLowerCase().includes(needle))
      );
    }
    if (cat) {
      list = list.filter((k) => matchCategory(k, cat));
    }
    if (minPrice) list = list.filter((k) => k.price >= Number(minPrice));
    if (maxPrice) list = list.filter((k) => k.price <= Number(maxPrice));

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else
      list.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

    return list;
  }, [allTasks, q, cat, sort, onlyOpen, minPrice, maxPrice]);

  const hasFilters = q || cat || minPrice || maxPrice || !onlyOpen;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [q, cat, sort, onlyOpen, minPrice, maxPrice, allTasks]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          timerRef.current = setTimeout(() => {
            setVisibleCount((c) => c + PAGE_SIZE);
            setLoadingMore(false);
          }, FAKE_DELAY);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visible.length]);

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
            Объявления
          </h1>
          <p className="mt-1 text-ink-500">
            {loading ? "Загружаем..." : `Найдено: ${filtered.length}`}
          </p>
        </div>
        {isAuthenticated && (
          <Button as={Link} to="/tasks/new" variant="accent">
            <Plus className="size-4" /> Разместить объявление
          </Button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", searchInput.trim());
        }}
        className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:bg-slate-900"
      >
        <div className="flex flex-1 items-center gap-2 pl-3">
          <Search className="size-5 text-ink-300" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск по объявлениям..."
            className="w-full bg-transparent py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setParam("q", "");
              }}
              className="text-ink-300 hover:text-ink-500"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary">
          Найти
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={!cat} onClick={() => setParam("cat", "")}>
          Все категории
        </Chip>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Chip
              key={c.id}
              active={cat === c.id}
              onClick={() => setParam("cat", cat === c.id ? "" : c.id)}
            >
              <Icon className="mr-1 size-4" />
              {c.label}
            </Chip>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-ink-900">
                <span className="flex size-8 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">
                  <SlidersHorizontal className="size-4" />
                </span>
                <span className="font-semibold">Фильтры</span>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-xs font-medium text-ink-400 transition hover:text-brand-600"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Цена, ₽
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="от"
                  value={minPrice}
                  onChange={(e) => setParam("min", e.target.value)}
                  className={FIELD_CLASS}
                />
                <span className="text-ink-300">—</span>
                <input
                  type="number"
                  min="0"
                  placeholder="до"
                  value={maxPrice}
                  onChange={(e) => setParam("max", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Сортировка
              </label>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className={`${FIELD_CLASS} cursor-pointer`}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 border-t border-slate-200/80 pt-5 dark:border-slate-200">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={onlyOpen}
                  onChange={(e) => setParam("open", e.target.checked ? "" : "0")}
                  className="size-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400 focus:ring-offset-0"
                />
                <span className="text-sm text-ink-700">Только открытые</span>
              </label>
            </div>

            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                className="mt-5 w-full"
                onClick={() => setSearchParams({})}
              >
                Сбросить фильтры
              </Button>
            )}
          </Card>
        </aside>

        <div>
          {error && <Alert tone="red" className="mb-4">{error}</Alert>}
          {loading ? (
            <PageLoader />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="Ничего не найдено"
              description="Попробуйте изменить параметры поиска или сбросить фильтры."
              action={
                hasFilters ? (
                  <Button variant="primary" onClick={() => setSearchParams({})}>
                    Сбросить фильтры
                  </Button>
                ) : null
              }
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((k) => (
                  <TaskCard key={k.id} kwork={k} />
                ))}
                {loadingMore &&
                  Array.from({
                    length: Math.min(PAGE_SIZE, filtered.length - visibleCount),
                  }).map((_, i) => <TaskCardSkeleton key={`skeleton-${i}`} />)}
              </div>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center py-8 text-sm text-ink-400"
                >
                  {loadingMore ? "Загружаем ещё..." : ""}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
          : "border border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-600 dark:bg-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
