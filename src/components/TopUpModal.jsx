import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreditCard, X, Wallet } from "lucide-react";
import { authApi, extractError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Alert } from "./ui";
import {
  formatPrice,
  formatSignedPrice,
  formatDateTime,
  transactionTypeInfo,
} from "../lib/format";

const PRESETS = [500, 1000, 2500, 5000];

export default function TopUpModal({ open, onClose, suggestedAmount }) {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [card, setCard] = useState("");
  const [holder, setHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  async function loadTransactions() {
    setTxLoading(true);
    try {
      const data = await authApi.transactions({ limit: 10 });
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      setAmount(suggestedAmount && suggestedAmount > 0 ? suggestedAmount : 1000);
      setError("");
      loadTransactions();
    }
  }, [open, suggestedAmount]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Введите сумму больше нуля");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.topUp({
        amount: Math.round(value),
        card_number: card || null,
        card_holder: holder || null,
      });
      await refreshUser();
      await loadTransactions();
      onClose?.(true);
    } catch (err) {
      setError(extractError(err, "Не удалось пополнить баланс"));
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
        onClick={() => onClose?.(false)}
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/40 dark:bg-slate-900">
        <button
          onClick={() => onClose?.(false)}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-slate-100"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Wallet className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink-900">Пополнение баланса</h2>
            <p className="text-sm text-ink-500">
              Текущий баланс: {formatPrice(user?.balance ?? 0)}
            </p>
          </div>
        </div>

        {error && (
          <Alert tone="red" className="mt-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                  Number(amount) === p
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                    : "border-slate-200 text-ink-700 hover:border-slate-300"
                }`}
              >
                {p} ₽
              </button>
            ))}
          </div>

          <Input
            label="Сумма пополнения, ₽"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <CreditCard className="size-4" /> Данные карты (демо)
            </div>
            <div className="space-y-3">
              <Input
                placeholder="0000 0000 0000 0000"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                inputMode="numeric"
                maxLength={19}
              />
              <Input
                placeholder="IVAN IVANOV"
                value={holder}
                onChange={(e) => setHolder(e.target.value.toUpperCase())}
              />
            </div>
            <p className="mt-2 text-xs text-ink-400">
              Это заглушка оплаты — реальные деньги не списываются.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Пополнить на {formatPrice(Number(amount) || 0)}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
            История операций
          </h3>
          {txLoading ? (
            <p className="text-sm text-ink-400">Загрузка…</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-ink-400">Операций пока нет</p>
          ) : (
            <ul className="max-h-48 space-y-2 overflow-y-auto">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-800">
                      {tx.description || transactionTypeInfo(tx.type).label}
                    </p>
                    <p className="text-xs text-ink-400">
                      {formatDateTime(tx.created_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-semibold ${
                      tx.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {formatSignedPrice(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
