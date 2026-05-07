import { useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ImagePlus, Plus, StickyNote, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Input";
import {
  MAX_FILE_BYTES,
  useNotas,
} from "@/store/expedienteStore";
import type { NotaBitacoraMock } from "@/lib/mock";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ConsultaNotasSection({ consultaId }: { consultaId: string }) {
  const { notas, addNota, removeNota } = useNotas(consultaId);
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState<{
    data: string;
    nombre: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTexto("");
    setImagen(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handlePickImage = () => inputRef.current?.click();

  const handleImageChange = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes en las notas.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(
        `La imagen excede ${formatBytes(MAX_FILE_BYTES)}. Comprime la imagen antes de adjuntarla.`,
      );
      return;
    }
    try {
      const data = await fileToBase64(file);
      setImagen({ data, nombre: file.name });
    } catch {
      toast.error("No se pudo leer la imagen.");
    }
  };

  const handleSave = () => {
    if (!texto.trim()) return;
    const nota: NotaBitacoraMock = {
      id: `nota-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      consultaId,
      fecha: new Date().toISOString(),
      texto: texto.trim(),
      imagen: imagen?.data,
      imagenNombre: imagen?.nombre,
    };
    addNota(nota);
    setOpen(false);
    reset();
  };

  const handleDelete = (n: NotaBitacoraMock) => {
    if (!window.confirm("¿Eliminar esta nota?")) return;
    removeNota(n.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <StickyNote size={14} strokeWidth={1.75} className="text-navy" />
            Bitácora de notas
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Seguimiento posterior a la consulta — observaciones, evolución,
            interconsultas.
          </p>
        </div>
        {!open ? (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus size={14} strokeWidth={1.75} />
            Nueva nota
          </Button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
          <Field label="Texto" required>
            <Textarea
              rows={4}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Evolución, interconsulta, ajuste de plan…"
              autoFocus
            />
          </Field>

          {imagen ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-2">
              <img
                src={imagen.data}
                alt={imagen.nombre}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {imagen.nombre}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Imagen lista para adjuntar
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImagen(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                aria-label="Quitar imagen"
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handlePickImage}>
              <ImagePlus size={14} strokeWidth={1.75} />
              {imagen ? "Cambiar imagen" : "Adjuntar imagen"}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!texto.trim()}
              >
                Guardar nota
              </Button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
          />
        </div>
      ) : null}

      {notas.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
          <StickyNote
            size={20}
            strokeWidth={1.5}
            className="mx-auto text-muted-foreground/60"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Aún no hay notas de seguimiento.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {notas.map((n) => (
            <li
              key={n.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {format(new Date(n.fecha), "dd MMM yyyy · HH:mm", {
                      locale: es,
                    })}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {n.texto}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(n)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                  aria-label="Eliminar nota"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
              {n.imagen ? (
                <a
                  href={n.imagen}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={n.imagen}
                    alt={n.imagenNombre ?? "Nota adjunta"}
                    className="max-h-72 w-full object-cover"
                  />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
