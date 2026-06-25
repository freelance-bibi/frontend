import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { Input, Button, Alert } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { extractError } from "../lib/api";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      return;
    }
    if (form.password !== form.password2) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        specialization: form.specialization.trim() || null,
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(extractError(err, "Не удалось зарегистрироваться"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="Заполни данные — это займёт минуту"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert tone="red">{error}</Alert>
        <Input
          label="Имя и фамилия"
          placeholder="Иван Петров"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Логин"
            placeholder="ivan_student"
            autoComplete="username"
            value={form.username}
            onChange={update("username")}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="ivan@univer.ru"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            required
          />
        </div>
        <Input
          label="Специализация (необязательно)"
          placeholder="Веб-разработчик, дизайнер..."
          value={form.specialization}
          onChange={update("specialization")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Пароль"
            type="password"
            placeholder="мин. 6 символов"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            required
          />
          <Input
            label="Повторите пароль"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password2}
            onChange={update("password2")}
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Зарегистрироваться
        </Button>
        <p className="text-center text-xs text-ink-300">
          Регистрируясь, вы соглашаетесь с условиями использования платформы.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:underline"
        >
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
