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
  bare = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  widthClass?: string;
  /** Sin backdrop y con el fondo "traspasable" (para montar sobre un calendario
   *  interactivo, como el modal de agendar desde la lista de espera). */
  bare?: boolean;
}) {
  // Se mantiene montado durante la animación de salida; el drawer se desmonta
  // al terminar su animación (onAnimationEnd), igual que en el consultorio de
  // referencia (slide-in / slide-out-to-right).
  const [render, setRender] = useState(open);

  useEffect(() => {
    if (open) setRender(true);
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
      className={cn("fixed inset-0 z-50", bare && "pointer-events-none")}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {bare ? null : (
        <div
          className={cn(
            "absolute inset-0 bg-foreground/30 backdrop-blur-[2px]",
            open ? "animate-overlay-in" : "animate-overlay-out",
          )}
          onClick={onClose}
        />
      )}
      <div
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !open) setRender(false);
        }}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-card shadow-elevated",
          bare && "pointer-events-auto",
          widthClass,
          open ? "animate-slide-in-right" : "animate-slide-out-right",
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
