import { useRef } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  MAX_FILE_BYTES,
  MAX_FILES_PER_CONSULTA,
  useArchivos,
} from "@/store/expedienteStore";
import type { ArchivoMock } from "@/lib/mock";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const isImage = (mime: string) => mime.startsWith("image/");

export function ConsultaArchivosSection({
  consultaId,
}: {
  consultaId: string;
}) {
  const { archivos, addArchivo, removeArchivo } = useArchivos(consultaId);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = MAX_FILES_PER_CONSULTA - archivos.length;
    if (remaining <= 0) {
      toast.error(
        `Solo se permiten ${MAX_FILES_PER_CONSULTA} archivos por consulta.`,
      );
      return;
    }

    const list = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toast.warning(
        `Solo se aceptaron ${remaining} de ${files.length} archivos por el límite.`,
      );
    }

    for (const file of list) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(
          `${file.name} excede ${formatBytes(MAX_FILE_BYTES)}. Comprime el archivo o elimínalo.`,
        );
        continue;
      }
      try {
        const data = await fileToBase64(file);
        const archivo: ArchivoMock = {
          id: `arc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          consultaId,
          nombre: file.name,
          mimeType: file.type || "application/octet-stream",
          tamanoBytes: file.size,
          data,
          subidoEn: new Date().toISOString(),
        };
        addArchivo(archivo);
      } catch {
        toast.error(`No se pudo leer ${file.name}.`);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDownload = (a: ArchivoMock) => {
    const link = document.createElement("a");
    link.href = a.data;
    link.download = a.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (a: ArchivoMock) => {
    if (!window.confirm(`¿Eliminar el archivo "${a.nombre}"?`)) return;
    removeArchivo(a.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Paperclip size={14} strokeWidth={1.75} className="text-navy" />
            Archivos adjuntos
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {archivos.length} de {MAX_FILES_PER_CONSULTA} · máx{" "}
            {formatBytes(MAX_FILE_BYTES)} por archivo
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePick}
          disabled={archivos.length >= MAX_FILES_PER_CONSULTA}
        >
          <Upload size={14} strokeWidth={1.75} />
          Subir archivo
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {archivos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
          <Paperclip
            size={20}
            strokeWidth={1.5}
            className="mx-auto text-muted-foreground/60"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Aún no hay archivos en esta consulta.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {archivos.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {isImage(a.mimeType) ? (
                  <img
                    src={a.data}
                    alt={a.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText
                    size={20}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {a.nombre}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(a.tamanoBytes)} ·{" "}
                  {format(new Date(a.subidoEn), "dd MMM yyyy · HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {isImage(a.mimeType) ? (
                  <a
                    href={a.data}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Ver ${a.nombre}`}
                    title="Ver"
                  >
                    <ImageIcon size={14} strokeWidth={1.75} />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDownload(a)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Descargar ${a.nombre}`}
                  title="Descargar"
                >
                  <Download size={14} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                  aria-label={`Eliminar ${a.nombre}`}
                  title="Eliminar"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
