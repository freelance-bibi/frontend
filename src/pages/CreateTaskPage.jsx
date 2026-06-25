import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, X, Info } from "lucide-react";
import { kworksApi, extractError } from "../lib/api";
import { Input, Textarea, Button, Card, Alert } from "../components/ui";
import { formatPrice } from "../lib/format";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const addFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!imageFiles.length) return;
    setImages((prev) => {
      const next = imageFiles.slice(0, 5 - prev.length).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });
  }, []);

  function handleFiles(e) {
    addFiles(e.target.files || []);
    e.target.value = "";
  }

  useEffect(() => {
    function handlePaste(e) {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = [];
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length) {
        e.preventDefault();
        addFiles(files);
      }
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [addFiles]);

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const priceNum = Number(form.price);
    if (!form.title.trim()) return setError("Введите заголовок");
    if (!priceNum || priceNum <= 0) return setError("Укажите корректную цену");

    setLoading(true);
    try {
      const { id } = await kworksApi.create({
        title: form.title.trim(),
        description: form.description.trim() || null,
        price: priceNum,
        tag_ids: [],
      });

      for (const img of images) {
        try {
          await kworksApi.uploadImage(id, img.file);
        } catch {
          continue;
        }
      }

      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(extractError(err, "Не удалось создать объявление"));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/tasks"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="size-4" /> Назад
      </Link>

      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
        Новое объявление
      </h1>
      <p className="mt-1 text-ink-500">
        Опишите услугу, которую предлагаете, или задачу, которую нужно решить.
      </p>

      <Card className="mt-6 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert tone="red">{error}</Alert>

          <Input
            label="Заголовок"
            placeholder="Например: Сделаю лендинг на React за 3 дня"
            value={form.title}
            onChange={update("title")}
            maxLength={255}
            required
          />

          <Textarea
            label="Описание"
            placeholder="Что входит в работу, сроки, что нужно от заказчика..."
            rows={6}
            value={form.description}
            onChange={update("description")}
          />

          <div>
            <Input
              label="Цена, ₽"
              type="number"
              min="1"
              placeholder="3000"
              value={form.price}
              onChange={update("price")}
              required
            />
            {form.price > 0 && (
              <p className="mt-1.5 text-xs text-ink-500">
                Будет показано как {formatPrice(Number(form.price))}
              </p>
            )}
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">
              Изображения (до 5 штук){" "}
              <span className="font-normal text-ink-400">
                — можно вставить из буфера через Ctrl+V
              </span>
            </span>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="group relative size-24 overflow-hidden rounded-xl border border-slate-200"
                >
                  <img src={img.url} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-ink-300 transition hover:border-brand-300 hover:text-brand-500">
                  <ImagePlus className="size-6" />
                  <span className="text-xs">Добавить</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              Когда кто-то откликнется на объявление, система автоматически
              создаст с ним чат.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="flex-1"
            >
              Опубликовать
            </Button>
            <Button
              as={Link}
              to="/tasks"
              variant="outline"
              size="lg"
              type="button"
            >
              Отмена
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
