import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { citasMock, pacientePorId } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function startOfWeek(d: Date) {
  const out = new Date(d);
  const day = out.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  out.setDate(out.getDate() + diff);
  out.setHours(0, 0, 0, 0);
  return out;
}

export default function Calendario() {
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(anchor);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [anchor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof citasMock>();
    for (const c of citasMock) {
      const k = new Date(c.fechaHora).toDateString();
      const arr = map.get(k) ?? [];
      arr.push(c);
      map.set(k, arr);
    }
    return map;
  }, []);

  const move = (delta: number) => {
    const next = new Date(anchor);
    next.setDate(next.getDate() + delta * 7);
    setAnchor(next);
  };

  const rangeLabel = `${days[0].getDate()} ${days[0].toLocaleString("es-MX", { month: "short" })} — ${days[6].getDate()} ${days[6].toLocaleString("es-MX", { month: "short" })}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Calendario</span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy">
            Agenda semanal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => move(-1)}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAnchor(startOfWeek(new Date()))}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={() => move(1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-3">
        {days.map((d, i) => {
          const events = (eventsByDay.get(d.toDateString()) ?? []).sort(
            (a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora),
          );
          const isToday = d.toDateString() === new Date().toDateString();
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "min-h-[280px] rounded-2xl border bg-card p-3",
                isToday ? "border-navy/40" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {DAYS_ES[i]}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday ? "bg-navy text-offwhite" : "text-foreground",
                  )}
                >
                  {d.getDate()}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {events.length === 0 ? (
                  <span className="block text-xs text-muted-foreground">—</span>
                ) : (
                  events.map((c) => {
                    const p = pacientePorId(c.pacienteId);
                    return (
                      <div
                        key={c.id}
                        className="rounded-lg border-l-2 border-leaf bg-muted/30 p-2"
                      >
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {new Intl.DateTimeFormat("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(c.fechaHora))}
                        </div>
                        <div className="mt-0.5 truncate text-xs font-medium text-foreground">
                          {p ? `${p.nombre} ${p.apellidoPaterno}` : c.pacienteId}
                        </div>
                        <Badge
                          variant={c.estado === "confirmada" ? "leaf" : "navy"}
                          className="mt-1"
                        >
                          {c.servicioSlug}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
