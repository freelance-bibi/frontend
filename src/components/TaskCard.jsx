import { Link } from "react-router-dom";
import { ImageIcon, Clock } from "lucide-react";
import { Badge } from "./ui";
import { formatPrice, statusInfo, timeAgo } from "../lib/format";

export default function TaskCard({ kwork }) {
  const cover = kwork.photos?.[0];
  const status = statusInfo(kwork.status);

  return (
    <Link
      to={`/tasks/${kwork.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/10 dark:bg-slate-900"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        {cover ? (
          <img
            src={cover}
            alt={kwork.title}
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-brand-300">
            <ImageIcon className="size-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge
            tone={status.tone}
            className="bg-white/90 shadow-md shadow-black/10 ring-black/5 backdrop-blur-sm dark:bg-slate-900/90 dark:ring-white/10"
          >
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {kwork.tags?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {kwork.tags.slice(0, 2).map((t) => (
              <span
                key={t.id}
                className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="line-clamp-2 font-semibold text-ink-900 transition group-hover:text-brand-600">
          {kwork.title}
        </h3>

        {kwork.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">
            {kwork.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-1 text-xs text-ink-300">
            <Clock className="size-3.5" />
            {timeAgo(kwork.created_at)}
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-ink-300">от</span>
            <span className="text-lg font-bold text-ink-900">
              {formatPrice(kwork.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:bg-slate-900">
      <div className="aspect-[16/10] bg-slate-200/70 dark:bg-slate-800" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex gap-1.5">
          <div className="h-4 w-12 rounded-md bg-slate-200/70 dark:bg-slate-800" />
          <div className="h-4 w-16 rounded-md bg-slate-200/70 dark:bg-slate-800" />
        </div>
        <div className="h-4 w-3/4 rounded bg-slate-200/70 dark:bg-slate-800" />
        <div className="mt-2 h-3 w-full rounded bg-slate-200/70 dark:bg-slate-800" />
        <div className="mt-1.5 h-3 w-5/6 rounded bg-slate-200/70 dark:bg-slate-800" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-3 w-16 rounded bg-slate-200/70 dark:bg-slate-800" />
          <div className="h-6 w-20 rounded bg-slate-200/70 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
