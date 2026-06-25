import { Link } from "react-router-dom";

export function BrandMark({ className = "size-10" }) {
  return (
    <img
      src="/bgitu.png"
      alt="БГИТУ"
      className={`object-contain ${className}`}
    />
  );
}

export function BrandName({ className = "" }) {
  return (
    <span
      aria-label="БГИТУ Фриланс"
      className={`flex flex-col leading-none ${className}`}
    >
      <span className="brand-lockup font-logo text-[1.05rem] font-extrabold uppercase tracking-tight text-ink-900 sm:text-[1.15rem]">
        Фриланс
      </span>
      <span className="brand-lockup mt-[0.3rem] text-[0.58rem] font-bold uppercase tracking-[0.32em] text-brand-500">
        БГИТУ
      </span>
    </span>
  );
}

export default function Logo({ className = "", showMark = true, to = "/" }) {
  return (
    <Link
      to={to}
      aria-label="БГИТУ Фриланс — на главную"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      {showMark && (
        <BrandMark className="size-10 transition-transform duration-200 ease-out group-hover:-rotate-6" />
      )}
      <BrandName />
    </Link>
  );
}
