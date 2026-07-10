import { Activity, Baby, Milk, Syringe } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Field, Input, Select } from "@/components/ui/Input";
import { useExpediente } from "@/store/expedienteStore";
import {
  ExpedienteFooter,
  Sec,
  ToggleField,
  useExpedienteSection,
} from "./formKit";

const num = (v: number) => (v === 0 ? "" : String(v));

export function ExpedientePerinatal({ pacienteId }: { pacienteId: string }) {
  const exp = useExpediente(pacienteId);
  const { form, set, dirty, saving, save } = useExpedienteSection(
    pacienteId,
    "perinatal",
    exp.perinatal,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Sec title="Embarazo y parto" icon={<Baby size={16} strokeWidth={1.75} />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de parto">
              <Select
                value={form.tipoParto}
                onChange={(e) =>
                  set("tipoParto", e.target.value as typeof form.tipoParto)
                }
              >
                <option value="no_especificado">No especificado</option>
                <option value="vaginal">Vaginal</option>
                <option value="cesarea">Cesárea</option>
              </Select>
            </Field>
            <Field label="Semanas de gestación">
              <Input
                type="number"
                inputMode="numeric"
                min={20}
                max={44}
                value={num(form.semanasGestacion)}
                onChange={(e) =>
                  set(
                    "semanasGestacion",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="Ej: 39"
              />
            </Field>
            <Field label="Peso al nacer (kg)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={num(form.pesoNacerKg)}
                onChange={(e) =>
                  set(
                    "pesoNacerKg",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="Ej: 3.4"
              />
            </Field>
            <Field label="Talla al nacer (cm)">
              <Input
                type="number"
                inputMode="numeric"
                value={num(form.tallaNacerCm)}
                onChange={(e) =>
                  set(
                    "tallaNacerCm",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="Ej: 50"
              />
            </Field>
          </div>
          <div className="mt-4">
            <ToggleField
              label="¿Complicaciones durante el embarazo o parto?"
              value={form.complicacionesParto}
              onChange={(v) => set("complicacionesParto", v)}
              detail={form.complicacionesDetalle}
              onDetail={(v) => set("complicacionesDetalle", v)}
              placeholder="Prematuridad, ingreso a neonatos, ictericia, etc."
            />
          </div>
        </Sec>

        <Sec
          title="Lactancia y alimentación temprana"
          icon={<Milk size={16} strokeWidth={1.75} />}
        >
          <ToggleField
            label="¿Recibió lactancia materna?"
            value={form.lactanciaMaterna}
            onChange={(v) => set("lactanciaMaterna", v)}
            detail={form.lactancia}
            onDetail={(v) => set("lactancia", v)}
            placeholder="Duración y detalle (ej: materna exclusiva 6 meses, luego fórmula)"
          />
          <div className="mt-4">
            <Field label="Edad de ablactación / introducción de sólidos (meses)">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={24}
                value={num(form.ablactacionMeses)}
                onChange={(e) =>
                  set(
                    "ablactacionMeses",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="Ej: 6"
              />
            </Field>
          </div>
        </Sec>

        <Sec
          title="Desarrollo psicomotor"
          icon={<Activity size={16} strokeWidth={1.75} />}
        >
          <ToggleField
            label="¿Desarrollo acorde a la edad?"
            value={form.desarrolloAcorde}
            onChange={(v) => set("desarrolloAcorde", v)}
            detail={form.hitos}
            onDetail={(v) => set("hitos", v)}
            placeholder="Hitos: sostén cefálico, sedestación, marcha, primeras palabras, control de esfínteres…"
            minH="min-h-[96px]"
          />
        </Sec>

        <Sec
          title="Esquema de vacunación"
          icon={<Syringe size={16} strokeWidth={1.75} />}
        >
          <ToggleField
            label="¿Esquema de vacunación completo para la edad?"
            value={form.esquemaCompleto}
            onChange={(v) => set("esquemaCompleto", v)}
            detail={form.vacunasNotas}
            onDetail={(v) => set("vacunasNotas", v)}
            placeholder="Notas: pendientes, refuerzos, vacunas no incluidas en el esquema nacional…"
          />

          {exp.vacunas.length > 0 ? (
            <div className="mt-4">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Vacunas registradas
              </span>
              <ul className="space-y-1.5">
                {exp.vacunas.map((v) => (
                  <li
                    key={v.nombre}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{v.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatVacunaFecha(v.fecha)}
                      {v.refuerzo ? ` · refuerzo ${formatVacunaFecha(v.refuerzo)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Sec>
      </div>

      <ExpedienteFooter
        dirty={dirty}
        saving={saving}
        onSave={save}
        label="perinatal y desarrollo"
      />
    </div>
  );
}

// Las fechas de vacuna pueden venir como rango ("2014-2024") o fecha ISO.
function formatVacunaFecha(fecha: string): string {
  const d = new Date(fecha);
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(+d)) {
    return format(d, "dd MMM yyyy", { locale: es });
  }
  return fecha;
}
