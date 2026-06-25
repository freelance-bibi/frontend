import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Star,
  MessageSquareQuote,
  Maximize2,
  FolderOpen,
} from "lucide-react";
import {
  reviewsApi,
  authApi,
  portfolioApi,
  skillsApi,
  extractError,
} from "../lib/api";
import { Card, Button, Avatar, Badge, Alert, Textarea, Input, EmptyState } from "./ui";
import TaskCard from "./TaskCard";
import { formatDate, timeAgo } from "../lib/format";

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-ink-900">{children}</h2>
      {action}
    </div>
  );
}

export function SkillsBlock({ skills, editable, onChanged, inline = false }) {
  const [adding, setAdding] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function openAdd() {
    setAdding(true);
    try {
      setAllSkills(await skillsApi.all());
    } catch {
      setAllSkills([]);
    }
  }

  async function addExisting(skillId) {
    setBusy(true);
    setError("");
    try {
      await skillsApi.addToMe([skillId]);
      await onChanged?.();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }

  async function createAndAdd() {
    const name = newSkill.trim();
    if (!name) return;
    setBusy(true);
    setError("");
    try {
      let skill = allSkills.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      if (!skill) skill = await skillsApi.create(name);
      await skillsApi.addToMe([skill.id]);
      setNewSkill("");
      await onChanged?.();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(skillId) {
    setBusy(true);
    try {
      await skillsApi.removeFromMe(skillId);
      await onChanged?.();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }

  const ownedIds = new Set(skills.map((s) => s.id));
  const available = allSkills.filter((s) => !ownedIds.has(s.id));

  const editor = editable && adding && (
    <div className="mt-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Новый навык, напр. Figma"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createAndAdd())}
        />
        <Button size="sm" onClick={createAndAdd} loading={busy}>
          Добавить
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
          Готово
        </Button>
      </div>

      {available.length > 0 && (
        <>
          <div className="mt-3 text-xs font-medium text-ink-500">
            Выбрать из существующих:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {available.slice(0, 20).map((s) => (
              <button
                key={s.id}
                onClick={() => addExisting(s.id)}
                disabled={busy}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                + {s.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const chips = (
    <div className="flex flex-wrap items-center gap-2">
      {skills.map((s) => (
        <span
          key={s.id}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
        >
          {s.name}
          {editable && (
            <button
              onClick={() => remove(s.id)}
              disabled={busy}
              className="text-brand-400 hover:text-red-500"
            >
              <X className="size-3.5" />
            </button>
          )}
        </span>
      ))}
      {editable && !adding && (
        <Button variant="subtle" size="sm" onClick={openAdd}>
          <Plus className="size-4" /> Добавить
        </Button>
      )}
    </div>
  );

  if (inline) {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        {error && <Alert tone="red">{error}</Alert>}
        {skills.length === 0 && !adding ? (
          editable ? (
            <Button variant="subtle" size="sm" onClick={openAdd}>
              <Plus className="size-4" /> Добавить навык
            </Button>
          ) : (
            <span className="text-sm text-ink-400">Навыки не указаны</span>
          )
        ) : (
          chips
        )}
        {editor}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <SectionTitle
        action={
          editable &&
          !adding && (
            <Button variant="subtle" size="sm" onClick={openAdd}>
              <Plus className="size-4" /> Добавить
            </Button>
          )
        }
      >
        Навыки
      </SectionTitle>

      {error && <Alert tone="red" className="mb-3">{error}</Alert>}

      {skills.length === 0 && !adding ? (
        <p className="text-sm text-ink-400">Навыки не указаны</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
            >
              {s.name}
              {editable && (
                <button
                  onClick={() => remove(s.id)}
                  disabled={busy}
                  className="text-brand-400 hover:text-red-500"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {editable && adding && (
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Новый навык, напр. Figma"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createAndAdd())}
            />
            <Button size="sm" onClick={createAndAdd} loading={busy}>
              Добавить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Готово
            </Button>
          </div>

          {available.length > 0 && (
            <>
              <div className="mt-3 text-xs font-medium text-ink-500">
                Выбрать из существующих:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {available.slice(0, 20).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addExisting(s.id)}
                    disabled={busy}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Закрыть"
      >
        <X className="size-5" />
      </button>
      <img
        src={item.photo_url}
        alt={item.title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
      />
      {item.title && (
        <p className="mt-4 max-w-2xl text-center text-base font-medium text-white">
          {item.title}
        </p>
      )}
    </div>
  );
}

export function PortfolioBlock({ items, editable, onChanged }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  async function create() {
    if (!title.trim()) return;
    setBusy(true);
    setError("");
    try {
      const item = await portfolioApi.create(title.trim());
      if (file) {
        try {
          await portfolioApi.uploadImage(item.id, file);
        } catch {
          setFile(null);
        }
      }
      setTitle("");
      setFile(null);
      setCreating(false);
      await onChanged?.();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    setBusy(true);
    try {
      await portfolioApi.remove(id);
      await onChanged?.();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-ink-900">Портфолио</h2>
          {items.length > 0 && (
            <Badge tone="brand">
              {items.length}{" "}
              {pluralWorks(items.length)}
            </Badge>
          )}
        </div>
        {editable && !creating && (
          <Button variant="subtle" size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Добавить работу
          </Button>
        )}
      </div>

      {error && <Alert tone="red" className="mb-3">{error}</Alert>}

      {editable && creating && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <Input
            label="Название работы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Лендинг для кофейни"
          />
          <div className="mt-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-600">
              <ImageIcon className="size-4" />
              {file ? file.name : "Прикрепить изображение"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={create} loading={busy}>
              Сохранить
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setFile(null);
                setTitle("");
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Работ пока нет"
          description={
            editable
              ? "Добавьте свои лучшие работы, чтобы заказчики увидели, что вы умеете."
              : "Здесь появятся выполненные работы исполнителя."
          }
          action={
            editable && !creating ? (
              <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
                <Plus className="size-4" /> Добавить первую работу
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const hasPhoto = !!item.photo_url;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => hasPhoto && setPreview(item)}
                className={`group relative block aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-inset ring-slate-200 transition duration-200 hover:ring-2 hover:ring-brand-400 dark:bg-slate-800 dark:ring-slate-700 ${
                  hasPhoto ? "cursor-zoom-in" : "cursor-default"
                }`}
              >
                {hasPhoto ? (
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 text-brand-200 dark:from-slate-800 dark:to-slate-900 dark:text-slate-600">
                    <ImageIcon className="size-9" />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-8">
                  <p className="line-clamp-2 text-left text-sm font-semibold text-white">
                    {item.title}
                  </p>
                </div>

                {hasPhoto && (
                  <span className="pointer-events-none absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-sm transition group-hover:opacity-100 dark:bg-slate-700/90">
                    <Maximize2 className="size-4" />
                  </span>
                )}

                {editable && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(item.id);
                      }
                    }}
                    aria-disabled={busy}
                    className="absolute left-2.5 top-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition hover:bg-red-500 group-hover:opacity-100"
                    aria-label="Удалить работу"
                  >
                    <Trash2 className="size-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
    </Card>
  );
}

function pluralWorks(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "работа";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "работы";
  return "работ";
}

export function ReviewsBlock({ userId, allowReview }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ text: "", status: "positive" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [revs, rat] = await Promise.allSettled([
        reviewsApi.forUser(userId),
        reviewsApi.rating(userId),
      ]);
      const list = revs.status === "fulfilled" ? revs.value : [];
      setReviews(list);
      if (rat.status === "fulfilled") setRating(rat.value);

      const ids = [...new Set(list.map((r) => r.author_id))];
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            return [id, await authApi.getUser(id)];
          } catch {
            return [id, { id, name: "Пользователь" }];
          }
        })
      );
      setAuthors(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    setBusy(true);
    setError("");
    try {
      await reviewsApi.create({
        target_id: Number(userId),
        text: form.text.trim(),
        status: form.status,
      });
      setForm({ text: "", status: "positive" });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(extractError(err, "Не удалось оставить отзыв"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-6">
      <SectionTitle
        action={
          allowReview && !showForm ? (
            <Button variant="subtle" size="sm" onClick={() => setShowForm(true)}>
              <MessageSquareQuote className="size-4" /> Оставить отзыв
            </Button>
          ) : null
        }
      >
        Отзывы
      </SectionTitle>

      {rating && rating.total_reviews > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-1.5 text-accent-500">
            <Star className="size-5 fill-current" />
            <span className="text-xl font-extrabold text-ink-900">
              {rating.rating_percent}%
            </span>
          </div>
          <div className="text-sm text-ink-500">
            положительных · всего {rating.total_reviews}{" "}
            <span className="text-mint-500">▲{rating.positive}</span>{" "}
            <span className="text-red-400">▼{rating.negative}</span>
          </div>
        </div>
      )}

      {error && <Alert tone="red" className="mb-3">{error}</Alert>}

      {allowReview && showForm && (
        <form onSubmit={submit} className="mb-5 rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: "positive" }))}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                form.status === "positive"
                  ? "bg-mint-500/15 text-mint-500 ring-1 ring-mint-500/30"
                  : "bg-slate-100 text-ink-500"
              }`}
            >
              <ThumbsUp className="size-4" /> Положительный
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: "negative" }))}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                form.status === "negative"
                  ? "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30"
                  : "bg-slate-100 text-ink-500"
              }`}
            >
              <ThumbsDown className="size-4" /> Отрицательный
            </button>
          </div>
          <Textarea
            rows={3}
            placeholder="Расскажите о работе с этим человеком..."
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" type="submit" loading={busy}>
              Опубликовать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Отмена
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink-400">Загрузка...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink-400">Отзывов пока нет</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => {
            const author = authors[r.author_id];
            return (
              <div
                key={r.id}
                className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <Avatar user={author} name={author?.name} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/users/${r.author_id}`}
                      className="font-semibold text-ink-900 hover:text-brand-600"
                    >
                      {author?.name || "Пользователь"}
                    </Link>
                    <Badge tone={r.status === "positive" ? "mint" : "red"}>
                      {r.status === "positive" ? (
                        <>
                          <ThumbsUp className="size-3" /> Хорошо
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="size-3" /> Плохо
                        </>
                      )}
                    </Badge>
                    <span className="ml-auto text-xs text-ink-300">
                      {timeAgo(r.created_at)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-700">{r.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export function UserKworksBlock({ kworks, title = "Объявления", emptyText }) {
  return (
    <div>
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      {kworks.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-ink-400">
            {emptyText || "Объявлений пока нет"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {kworks.map((k) => (
            <TaskCard key={k.id} kwork={k} />
          ))}
        </div>
      )}
    </div>
  );
}

export function MemberSince({ date }) {
  return (
    <span className="text-sm text-ink-400">
      На платформе с {formatDate(date)}
    </span>
  );
}
