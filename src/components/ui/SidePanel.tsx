import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Panel lateral deslizante desde la derecha (drawer). Se usa para formularios
 * amplios como "Nueva consulta", igual que en el consultorio de referencia.
 */
export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  headerActions,
  footer,
  children,
  widthClass = "sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  widthClass?: string;
}) {
  const [render, setRender] = useState(open);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    }
    setEnter(false);
    const t = setTimeout(() => setRender(false), 250);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!render || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-200",
          enter ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-card shadow-elevated transition-transform duration-300 ease-gentle",
          widthClass,
          enter ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-navy">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-5 py-4 md:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
