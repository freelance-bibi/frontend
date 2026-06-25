import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImageIcon,
  ShieldCheck,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Star,
  Calendar,
  Wallet,
  Tag as TagIcon,
} from "lucide-react";
import {
  kworksApi,
  authApi,
  reviewsApi,
  extractError,
} from "../lib/api";
import {
  Button,
  Card,
  Avatar,
  Badge,
  PageLoader,
  Alert,
} from "../components/ui";
import { formatPrice, formatDate, statusInfo } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import TopUpModal from "../components/TopUpModal";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [kwork, setKwork] = useState(null);
  const [author, setAuthor] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [needTopUp, setNeedTopUp] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const k = await kworksApi.get(id);
      setKwork(k);
      const [a, r] = await Promise.allSettled([
        authApi.getUser(k.user_id),
        reviewsApi.rating(k.user_id),
      ]);
      if (a.status === "fulfilled") setAuthor(a.value);
      if (r.status === "fulfilled") setRating(r.value);
    } catch (err) {
      setError(extractError(err, "Объявление не найдено"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwner = user && kwork && user.id === kwork.user_id;
  const isClient = user && kwork && user.id === kwork.client_id;
  const canOrder =
    isAuthenticated &&
    kwork &&
    !isOwner &&
    kwork.status === "not_completed" &&
    !kwork.client_id;

  async function handleOrder() {
    setActing(true);
    setActionError("");
    try {
      const res = await kworksApi.order(kwork.id);
      if (res.chat_id) navigate(`/messages/${res.chat_id}`);
      else navigate("/messages");
    } catch (err) {
      setActionError(extractError(err, "Не удалось оформить заказ"));
      setActing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Удалить объявление? Это действие необратимо.")) return;
    setActing(true);
    try {
      await kworksApi.remove(kwork.id);
      navigate("/profile");
    } catch (err) {
      setActionError(extractError(err));
      setActing(false);
    }
  }

  async function handleComplete() {
    setActing(true);
    setActionError("");
    setNeedTopUp(false);
    try {
      const updated = await kworksApi.complete(kwork.id);
      setKwork((k) => ({ ...k, ...updated }));
      await refreshUser();
    } catch (err) {
      if (err?.response?.status === 402) {
        setNeedTopUp(true);
      }
      setActionError(extractError(err));
    } finally {
      setActing(false);
    }
  }

  const shortfall =
    kwork && user ? Math.max(0, kwork.price - (user.balance ?? 0)) : 0;

  if (loading) return <PageLoader />;

  if (error || !kwork) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Alert tone="red">{error || "Объявление не найдено"}</Alert>
        <Button as={Link} to="/tasks" variant="primary" className="mt-6">
          К списку объявлений
        </Button>
      </div>
    );
  }

  const status = statusInfo(kwork.status);
  const photos = kwork.photos || [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/tasks"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="size-4" /> Назад к объявлениям
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              {photos.length > 0 ? (
                <img
                  src={photos[activePhoto]}
                  alt={kwork.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-brand-300">
                  <ImageIcon className="size-14" />
                  <span className="text-sm">Без изображения</span>
                </div>
              )}
              <div className="absolute left-4 top-4">
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 scroll-thin">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                      i === activePhoto ? "ring-brand-500" : "ring-transparent"
                    }`}
                  >
                    <img src={p} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-6">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
              {kwork.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" /> {formatDate(kwork.created_at)}
              </span>
              {kwork.tags?.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <TagIcon className="size-4" />
                  {kwork.tags.map((t) => `#${t.name}`).join(", ")}
                </span>
              )}
            </div>
          </div>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-bold text-ink-900">Описание</h2>
            <p className="mt-3 whitespace-pre-line text-ink-700">
              {kwork.description || "Автор не оставил описание."}
            </p>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6 lg:sticky lg:top-20">
            <div className="text-sm text-ink-500">Стоимость работы</div>
            <div className="mt-1 font-display text-4xl font-extrabold text-ink-900">
              {formatPrice(kwork.price)}
            </div>

            {actionError && (
              <Alert tone="red" className="mt-4">
                {actionError}
              </Alert>
            )}

            <div className="mt-5 space-y-2.5">
              {isOwner ? (
                <>
                  <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                    Это ваше объявление.
                  </div>
                  {kwork.client_id && kwork.status !== "completed" && (
                    <>
                      <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
                        <div className="flex items-center justify-between text-ink-500">
                          <span>Ваш баланс</span>
                          <span className="font-semibold text-ink-900">
                            {formatPrice(user?.balance ?? 0)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-ink-500">
                          <span>К списанию</span>
                          <span className="font-semibold text-ink-900">
                            {formatPrice(kwork.price)}
                          </span>
                        </div>
                      </div>
                      {needTopUp ? (
                        <Button
                          variant="accent"
                          className="w-full"
                          onClick={() => setTopUpOpen(true)}
                        >
                          <Wallet className="size-4" /> Пополнить баланс
                          {shortfall > 0 ? ` на ${formatPrice(shortfall)}` : ""}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleComplete}
                          loading={acting}
                        >
                          <CheckCircle2 className="size-4" /> Подтвердить выполнение
                        </Button>
                      )}
                    </>
                  )}
                  {kwork.client_id && (
                    <Button
                      as={Link}
                      to="/messages"
                      variant="outline"
                      className="w-full"
                    >
                      <MessageSquare className="size-4" /> Перейти в чат
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={handleDelete}
                    loading={acting}
                  >
                    <Trash2 className="size-4" /> Удалить объявление
                  </Button>
                </>
              ) : canOrder ? (
                <>
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={handleOrder}
                    loading={acting}
                  >
                    <MessageSquare className="size-4" /> Откликнуться и написать
                  </Button>
                  <p className="text-center text-xs text-ink-300">
                    При отклике откроется чат с автором
                  </p>
                </>
              ) : isClient ? (
                <Button
                  as={Link}
                  to="/messages"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <MessageSquare className="size-4" /> Перейти в чат
                </Button>
              ) : !isAuthenticated ? (
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Войдите, чтобы откликнуться
                </Button>
              ) : (
                <div className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm text-ink-500">
                  Объявление уже {status.label.toLowerCase()}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-ink-500">
              <ShieldCheck className="size-4 text-mint-500" />
              Общайтесь и проводите сделку безопасно
            </div>
          </Card>

          {author && (
            <Card className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                Автор объявления
              </div>
              <Link
                to={`/users/${author.id}`}
                className="mt-3 flex items-center gap-3 group"
              >
                <Avatar user={author} size={52} />
                <div>
                  <div className="font-semibold text-ink-900 group-hover:text-brand-600">
                    {author.name}
                  </div>
                  <div className="text-sm text-ink-500">
                    {author.specialization || "Студент-фрилансер"}
                  </div>
                </div>
              </Link>

              {rating && rating.total_reviews > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-1 text-accent-500">
                    <Star className="size-4 fill-current" />
                    <span className="font-bold text-ink-900">
                      {rating.rating_percent}%
                    </span>
                  </div>
                  <span className="text-sm text-ink-500">
                    положительных ({rating.total_reviews})
                  </span>
                </div>
              )}

              <Button
                as={Link}
                to={`/users/${author.id}`}
                variant="outline"
                className="mt-4 w-full"
              >
                Открыть профиль
              </Button>
            </Card>
          )}
        </div>
      </div>

      <TopUpModal
        open={topUpOpen}
        suggestedAmount={shortfall}
        onClose={(success) => {
          setTopUpOpen(false);
          if (success) {
            setNeedTopUp(false);
            setActionError("");
          }
        }}
      />
    </div>
  );
}
