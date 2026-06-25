import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="font-display text-7xl font-extrabold text-brand-500">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">
        Страница не найдена
      </h1>
      <p className="mt-2 max-w-md text-ink-500">
        Возможно, объявление было удалено или вы перешли по неверной ссылке.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg" className="mt-6">
        На главную
      </Button>
    </div>
  );
}
