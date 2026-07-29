import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eraser, Redo2, Save, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Point = { x: number; y: number };
type Stroke = { color: string; width: number; points: Point[] };

const COLORS = ["#E88C7D", "#1F4068", "#7EB748", "#E89C4D", "#111827"];
const WIDTHS = [2, 4, 8];

/**
 * Lienzo de anotación: muestra una imagen y permite dibujar encima (marcar
 * hallazgos). Al guardar, aplana imagen + trazos en un PNG (data URL).
 */
export function DrawingCanvas({
  image,
  onSave,
  onClose,
}: {
  image: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const redoRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(WIDTHS[1]);
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  // Ajusta el canvas al tamaño renderizado de la imagen.
  const syncSize = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const r = img.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    redraw();
  };

  useLayoutEffect(() => {
    const ro = new ResizeObserver(syncSize);
    if (imgRef.current) ro.observe(imgRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of strokesRef.current) drawStroke(ctx, s);
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, s: Stroke, scale = 1) => {
    if (s.points.length === 0) return;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width * scale;
    ctx.beginPath();
    ctx.moveTo(s.points[0].x * scale, s.points[0].y * scale);
    for (let i = 1; i < s.points.length; i++) {
      ctx.lineTo(s.points[i].x * scale, s.points[i].y * scale);
    }
    // Punto único: dibuja un pequeño círculo para que se vea el clic.
    if (s.points.length === 1) {
      ctx.lineTo(s.points[0].x * scale + 0.1, s.points[0].y * scale + 0.1);
    }
    ctx.stroke();
  };

  const posFromEvent = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    redoRef.current = [];
    strokesRef.current.push({ color, width, points: [posFromEvent(e)] });
    redraw();
    rerender();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const cur = strokesRef.current[strokesRef.current.length - 1];
    cur.points.push(posFromEvent(e));
    redraw();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const undo = () => {
    const s = strokesRef.current.pop();
    if (s) redoRef.current.push(s);
    redraw();
    rerender();
  };
  const redo = () => {
    const s = redoRef.current.pop();
    if (s) strokesRef.current.push(s);
    redraw();
    rerender();
  };
  const clear = () => {
    strokesRef.current = [];
    redoRef.current = [];
    redraw();
    rerender();
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth || img.width;
    const natH = img.naturalHeight || img.height;
    const dispW = img.getBoundingClientRect().width || natW;
    const scale = natW / dispW;
    const out = document.createElement("canvas");
    out.width = natW;
    out.height = natH;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, natW, natH);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of strokesRef.current) drawStroke(ctx, s, scale);
    onSave(out.toDataURL("image/jpeg", 0.85));
  };

  const hasStrokes = strokesRef.current.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-foreground/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Dibujar sobre la imagen"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-card px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-navy">
            Dibujar sobre la imagen
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-transform",
                  color === c
                    ? "scale-110 border-navy"
                    : "border-transparent hover:scale-105",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {WIDTHS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWidth(w)}
                aria-label={`Grosor ${w}`}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                  width === w
                    ? "border-navy bg-navy/10"
                    : "border-border hover:bg-muted",
                )}
              >
                <span
                  className="rounded-full bg-foreground"
                  style={{ height: w, width: w }}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!hasStrokes}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
              aria-label="Deshacer"
              title="Deshacer"
            >
              <Undo2 size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={redoRef.current.length === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
              aria-label="Rehacer"
              title="Rehacer"
            >
              <Redo2 size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={!hasStrokes}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
              aria-label="Limpiar"
              title="Limpiar"
            >
              <Eraser size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="flex flex-1 items-center justify-center overflow-auto p-4"
      >
        <div className="relative inline-block">
          <img
            ref={imgRef}
            src={image}
            alt="Imagen para anotar"
            onLoad={syncSize}
            draggable={false}
            className="block max-h-[70vh] max-w-full select-none rounded-lg shadow-elevated"
          />
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-lg"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-card px-4 py-3 md:px-6">
        <Button variant="outline" onClick={onClose}>
          <X size={14} strokeWidth={1.75} />
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Save size={14} strokeWidth={1.75} />
          Guardar anotación
        </Button>
      </div>
    </div>,
    document.body,
  );
}
