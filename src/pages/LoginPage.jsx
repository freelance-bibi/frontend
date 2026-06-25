import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Hand } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { Input, Button, Alert } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { extractError } from "../lib/api";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/tasks";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractError(err, "Неверный логин или пароль"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={
        <span className="inline-flex items-center gap-2">
          С возвращением
          <Hand className="size-7 text-accent-400" />
        </span>
      }
      subtitle="Войди в аккаунт, чтобы продолжить"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert tone="red">{error}</Alert>
        <Input
          label="Логин"
          placeholder="ivan_student"
          autoComplete="username"
          value={form.username}
          onChange={update("username")}
          required
        />
        <Input
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={update("password")}
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Войти
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Нет аккаунта?{" "}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </AuthShell>
  );
}
