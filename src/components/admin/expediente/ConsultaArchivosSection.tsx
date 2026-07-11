import { useRef } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Pencil,
  ScanLine,
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
import { MAX_IMAGENES_ENDOSCOPIA, type ArchivoMock } from "@/lib/mock";

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

  const endoImgs = archivos.filter((a) => a.tipo === "endoscopia");
  const dibujos = archivos.filter((a) => a.tipo === "dibujo");
  const documentos = archivos.filter(
    (a) => !a.tipo || a.tipo === "documento",
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_FILES_PER_CONSULTA - documentos.length;
    if (remaining <= 0) {
      toast.error(`Solo se permiten ${MAX_FILES_PER_CONSULTA} documentos por consulta.`);
      return;
    }
    const list = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toast.warning(`Solo se aceptaron ${remaining} de ${files.length} documentos.`);
    }
    for (const file of list) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} excede ${formatBytes(MAX_FILE_BYTES)}.`);
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
          tipo: "documento",
        };
        addArchivo(archivo);
      } catch {
        toast.error(`No se pudo leer ${file.name}.`);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = (a: ArchivoMock) => {
    if (!window.confirm(`¿Eliminar "${a.nombre}"?`)) return;
    removeArchivo(a.id);
  };

  const nada = archivos.length === 0;

  return (
    <div className="space-y-5">
      {endoImgs.length > 0 ? (
        <Group
          icon={<ScanLine size={14} strokeWidth={1.75} className="text-navy" />}
          title="Imágenes de endoscopía"
          count={`${endoImgs.length} de ${MAX_IMAGENES_ENDOSCOPIA}`}
        >
          <Gallery archivos={endoImgs} onDelete={handleDelete} />
        </Group>
      ) : null}

      {dibujos.length > 0 ? (
        <Group
          icon={<Pencil size={14} strokeWidth={1.75} className="text-navy" />}
          title="Imágenes anotadas"
        >
          <Gallery archivos={dibujos} onDelete={handleDelete} />
        </Group>
      ) : null}

      <div>
        <div className="flex items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Paperclip size={14} strokeWidth={1.75} className="text-navy" />
            Documentos
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={documentos.length >= MAX_FILES_PER_CONSULTA}
          >
            <Upload size={14} strokeWidth={1.75} />
            Subir documento
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

        {documentos.length === 0 ? (
          nada ? (
            <div className="mt-3 rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
              <Paperclip
                size={20}
                strokeWidth={1.5}
                className="mx-auto text-muted-foreground/60"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Sin adjuntos en esta consulta.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Sin documentos adjuntos.
            </p>
          )
        ) : (
          <ul className="mt-3 space-y-2">
            {documentos.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {isImage(a.mimeType) ? (
                    <img src={a.data} alt={a.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <FileText size={18} strokeWidth={1.5} className="text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{a.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(a.tamanoBytes)} ·{" "}
                    {format(new Date(a.subidoEn), "dd MMM yyyy · HH:mm", { locale: es })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <a
                    href={a.data}
                    download={a.nombre}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={`Descargar ${a.nombre}`}
                    title="Descargar"
                  >
                    {isImage(a.mimeType) ? (
                      <ImageIcon size={14} strokeWidth={1.75} />
                    ) : (
                      <Download size={14} strokeWidth={1.75} />
                    )}
                  </a>
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
    </div>
  );
}

function Group({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon}
          {title}
        </h4>
        {count ? (
          <span className="text-xs text-muted-foreground">{count}</span>
        ) : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Gallery({
  archivos,
  onDelete,
}: {
  archivos: ArchivoMock[];
  onDelete: (a: ArchivoMock) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {archivos.map((a) => (
        <div
          key={a.id}
          className="group relative overflow-hidden rounded-xl border border-border bg-card"
        >
          <a href={a.data} target="_blank" rel="noreferrer">
            <img
              src={a.data}
              alt={a.nombre}
              className="aspect-square w-full object-cover"
            />
          </a>
          <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <a
              href={a.data}
              download={a.nombre}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-navy shadow-soft hover:bg-card"
              aria-label={`Descargar ${a.nombre}`}
              title="Descargar"
            >
              <Download size={13} strokeWidth={1.75} />
            </a>
            <button
              type="button"
              onClick={() => onDelete(a)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-coral shadow-soft hover:bg-card"
              aria-label={`Eliminar ${a.nombre}`}
              title="Eliminar"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
