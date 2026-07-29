import { useEffect, useRef, useState } from "react";
import { FileText, Image as ImageIcon, ScanLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Botón "Subir archivo" que despliega las tres opciones de adjunto de la
 * consulta: imágenes de endoscopía (galería), imagen para dibujar/anotar y
 * documento. Cada opción dispara su propio flujo de carga.
 */
export function UploadMenu({
  onEndoscopia,
  onDibujo,
  onDocumento,
  endoscopiaDisabled,
}: {
  onEndoscopia: () => void;
  onDibujo: () => void;
  onDocumento: () => void;
  endoscopiaDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Con el menú abierto, Escape solo lo cierra (no el panel contenedor).
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Upload size={14} strokeWidth={1.75} />
        Subir archivo
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-72 origin-top-right overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated"
        >
          <MenuItem
            icon={<ScanLine size={16} strokeWidth={1.75} />}
            title="Subir imagen de endoscopía"
            desc="JPG, PNG o WEBP (máx. 10 MB, hasta 5 imágenes)"
            disabled={endoscopiaDisabled}
            onClick={() => pick(onEndoscopia)}
          />
          <MenuItem
            icon={<ImageIcon size={16} strokeWidth={1.75} />}
            title="Subir imagen para dibujar"
            desc="JPG, PNG o WEBP (máx. 10 MB)"
            onClick={() => pick(onDibujo)}
          />
          <MenuItem
            icon={<FileText size={16} strokeWidth={1.75} />}
            title="Subir documento"
            desc="PDF, archivos, imágenes adjuntas"
            onClick={() => pick(onDocumento)}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  icon,
  title,
  desc,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <span className="mt-0.5 text-navy group-hover:text-offwhite group-disabled:group-hover:text-navy">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground group-hover:text-offwhite group-disabled:group-hover:text-foreground">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground group-hover:text-offwhite/80 group-disabled:group-hover:text-muted-foreground">
          {desc}
        </span>
      </span>
    </button>
  );
}
