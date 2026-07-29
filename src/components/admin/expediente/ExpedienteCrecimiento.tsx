import { useState } from "react";
import { Plus, TrendingUp, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useExpediente, useExpedienteEditable } from "@/store/expedienteStore";
import type { AntropometriaMock } from "@/lib/mock";

function todayISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const emptyDraft = { fecha: todayISO(), pesoKg: "", tallaCm: "", percentilPeso: "" };

export function ExpedienteCrecimiento({ pacienteId }: { pacienteId: string }) {
  const exp = useExpediente(pacienteId);
  const { update } = useExpedienteEditable(pacienteId);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const data = [...exp.antropometria].sort(
    (a, b) => +new Date(b.fecha) - +new Date(a.fecha),
  );

  const peso = Number(draft.pesoKg);
  const talla = Number(draft.tallaCm);
  const imc =
    peso > 0 && talla > 0
      ? Number((peso / (talla / 100) ** 2).toFixed(1))
      : 0;
  const valid = !!draft.fecha && peso > 0 && talla > 0;

  const handleAdd = () => {
    if (!valid) return;
    const nueva: AntropometriaMock = {
      fecha: draft.fecha,
      pesoKg: peso,
      tallaCm: talla,
      imc,
      percentilPeso: draft.percentilPeso.trim() || undefined,
    };
    update({ antropometria: [nueva, ...exp.antropometria] });
    setDraft({ ...emptyDraft, fecha: todayISO() });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Curva de crecimiento
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Peso, talla e IMC seriados por consulta.
          </p>
        </div>
        {!showForm ? (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Plus size={14} strokeWidth={1.75} />
            Agregar medición
          </Button>
        ) : null}
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp size={16} strokeWidth={1.75} className="text-navy" />
              Nueva medición
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Cancelar"
            >
              <X size={15} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Fecha">
              <Input
                type="date"
                value={draft.fecha}
                onChange={(e) => setDraft((d) => ({ ...d, fecha: e.target.value }))}
              />
            </Field>
            <Field label="Peso (kg)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={draft.pesoKg}
                onChange={(e) => setDraft((d) => ({ ...d, pesoKg: e.target.value }))}
                placeholder="Ej: 18.4"
              />
            </Field>
            <Field label="Talla (cm)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={draft.tallaCm}
                onChange={(e) => setDraft((d) => ({ ...d, tallaCm: e.target.value }))}
                placeholder="Ej: 108"
              />
            </Field>
            <Field label="Percentil peso" hint="Opcional">
              <Input
                value={draft.percentilPeso}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, percentilPeso: e.target.value }))
                }
                placeholder="Ej: p25"
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              IMC calculado:{" "}
              <span className="font-semibold text-foreground">
                {imc > 0 ? imc.toFixed(1) : "—"}
              </span>
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd} disabled={!valid}>
                <Plus size={14} strokeWidth={1.75} />
                Guardar medición
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {data.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay registros de antropometría para este paciente.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">
              Histórico de mediciones
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.length} registro{data.length === 1 ? "" : "s"} · más reciente
              primero
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Peso</th>
                  <th className="px-5 py-3">Talla</th>
                  <th className="px-5 py-3">IMC</th>
                  <th className="px-5 py-3">Percentil peso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row) => (
                  <tr key={`${row.fecha}-${row.pesoKg}`}>
                    <td className="px-5 py-3 capitalize text-muted-foreground">
                      {format(new Date(row.fecha), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-5 py-3 text-foreground">{row.pesoKg} kg</td>
                    <td className="px-5 py-3 text-foreground">{row.tallaCm} cm</td>
                    <td className="px-5 py-3 text-foreground">
                      {row.imc.toFixed(1)}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {row.percentilPeso ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
