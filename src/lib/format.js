export function formatPrice(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function formatSignedPrice(value) {
  if (value === null || value === undefined) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = new Intl.NumberFormat("ru-RU").format(Math.abs(value));
  return `${sign}${abs} ₽`;
}

const TX_TYPE_MAP = {
  topup: { label: "Пополнение" },
  payment: { label: "Оплата заказа" },
  earning: { label: "Оплата за работу" },
};

export function transactionTypeInfo(type) {
  return TX_TYPE_MAP[type] || { label: type };
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "только что";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} дн назад`;
  return formatDate(iso);
}

export function isValidPhone(value) {
  if (!value) return true;
  if (!/^\+?[\d\s()-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const STATUS_MAP = {
  not_completed: { label: "Открыто", tone: "mint" },
  in_process: { label: "В работе", tone: "amber" },
  completed: { label: "Выполнено", tone: "gray" },
};

export function statusInfo(status) {
  return STATUS_MAP[status] || { label: status, tone: "gray" };
}

export function colorFromString(str = "") {
  const colors = [
    "#4055f6",
    "#7c3aed",
    "#db2777",
    "#ea580c",
    "#0891b2",
    "#059669",
    "#d97706",
    "#4f46e5",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
