import { useState } from "react";
import { Activity, Stethoscope, Utensils } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { useExpediente } from "@/store/expedienteStore";
import {
  ExpedienteFooter,
  Sec,
  ToggleField,
  useExpedienteSection,
} from "./formKit";

const BRISTOL: { value: number; label: string }[] = [
  { value: 1, label: "1 · Bolitas duras separadas" },
  { value: 2, label: "2 · Alargada y grumosa" },
  { value: 3, label: "3 · Con grietas en la superficie" },
  { value: 4, label: "4 · Lisa y blanda (normal)" },
  { value: 5, label: "5 · Trozos blandos y definidos" },
  { value: 6, label: "6 · Trozos pastosos, deshechos" },
  { value: 7, label: "7 · Líquida, sin trozos sólidos" },
];

const num = (v: number) => (v === 0 ? "" : String(v));

export function ExpedienteNutricion({ pacienteId }: { pacienteId: string }) {
  const exp = useExpediente(pacienteId);

  const habito = useExpedienteSection(
    pacienteId,
    "habitoDigestivo",
    exp.habitoDigestivo,
  );
  const alim = useExpedienteSection(pacienteId, "alimentacion", exp.alimentacion);

  // Editor de listas por coma con estado local para no romper el cursor.
  const [prefText, setPrefText] = useState(
    alim.form.alimentosPreferidos.join(", "),
  );
  const [rechText, setRechText] = useState(
    alim.form.alimentosRechazados.join(", "),
  );

  const toArray = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const dirty = habito.dirty || alim.dirty;
  const saving = habito.saving || alim.saving;
  const saveBoth = () => {
    habito.save();
    alim.save();
  };

  const h = habito.form;
  const a = alim.form;

  return (
    <div className="space-y-4">
      <Sec title="Hábito intestinal" icon={<Activity size={16} strokeWidth={1.75} />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Escala de Bristol">
            <Select
              value={h.bristolEscala}
              onChange={(e) => habito.set("bristolEscala", Number(e.target.value))}
            >
              {BRISTOL.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Deposiciones por semana">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={num(h.frecuenciaSemanal)}
              onChange={(e) =>
                habito.set(
                  "frecuenciaSemanal",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              placeholder="Ej: 7"
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <ToggleField
            label="Dolor al defecar"
            value={h.dolorDefecar}
            onChange={(v) => habito.set("dolorDefecar", v)}
            detail={h.dolorDefecarDetalle}
            onDetail={(v) => habito.set("dolorDefecarDetalle", v)}
            placeholder="Intensidad, relación con las deposiciones…"
          />
          <ToggleField
            label="Sangrado"
            value={h.sangrado}
            onChange={(v) => habito.set("sangrado", v)}
            detail={h.sangradoDetalle}
            onDetail={(v) => habito.set("sangradoDetalle", v)}
            placeholder="Color, cantidad, relación con las deposiciones…"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Distensión abdominal">
            <Textarea
              value={h.distension}
              onChange={(e) => habito.set("distension", e.target.value)}
              placeholder="Frecuencia, relación con las comidas…"
              className="min-h-[72px]"
            />
          </Field>
          <Field label="Reflujo / vómito">
            <Textarea
              value={h.reflujo}
              onChange={(e) => habito.set("reflujo", e.target.value)}
              placeholder="Episodios, relación con las tomas…"
              className="min-h-[72px]"
            />
          </Field>
        </div>
      </Sec>

      <Sec
        title="Síntomas digestivos actuales"
        icon={<Stethoscope size={16} strokeWidth={1.75} />}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ToggleField
            label="Dolor abdominal"
            value={h.dolorAbdominal}
            onChange={(v) => habito.set("dolorAbdominal", v)}
            detail={h.dolorAbdominalDetalle}
            onDetail={(v) => habito.set("dolorAbdominalDetalle", v)}
            placeholder="Localización, tipo, frecuencia…"
          />
          <ToggleField
            label="Estreñimiento"
            value={h.estrenimiento}
            onChange={(v) => habito.set("estrenimiento", v)}
            detail={h.estrenimientoDetalle}
            onDetail={(v) => habito.set("estrenimientoDetalle", v)}
            placeholder="Frecuencia, esfuerzo, consistencia…"
          />
          <ToggleField
            label="Diarrea"
            value={h.diarrea}
            onChange={(v) => habito.set("diarrea", v)}
            detail={h.diarreaDetalle}
            onDetail={(v) => habito.set("diarreaDetalle", v)}
            placeholder="Frecuencia, consistencia, moco o sangre…"
          />
          <ToggleField
            label="Náusea / vómito"
            value={h.nauseaVomito}
            onChange={(v) => habito.set("nauseaVomito", v)}
            detail={h.nauseaVomitoDetalle}
            onDetail={(v) => habito.set("nauseaVomitoDetalle", v)}
            placeholder="Frecuencia, relación con las comidas…"
          />
          <ToggleField
            label="Pirosis / regurgitación"
            value={h.pirosis}
            onChange={(v) => habito.set("pirosis", v)}
            detail={h.pirosisDetalle}
            onDetail={(v) => habito.set("pirosisDetalle", v)}
            placeholder="Frecuencia, relación con las comidas o la posición…"
          />
        </div>
        <div className="mt-5">
          <Field label="Notas de síntomas">
            <Textarea
              value={h.sintomasNotas}
              onChange={(e) => habito.set("sintomasNotas", e.target.value)}
              placeholder="Cronología, factores desencadenantes, impacto en la vida diaria…"
              className="min-h-[80px]"
            />
          </Field>
        </div>
      </Sec>

      <Sec
        title="Nutrición / Alimentación"
        icon={<Utensils size={16} strokeWidth={1.75} />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Comidas al día">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={num(a.comidasPorDia)}
              onChange={(e) =>
                alim.set(
                  "comidasPorDia",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              placeholder="Ej: 4"
            />
          </Field>
          <Field label="Apetito">
            <Select
              value={a.apetito}
              onChange={(e) =>
                alim.set("apetito", e.target.value as typeof a.apetito)
              }
            >
              <option value="">Sin especificar</option>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
              <option value="malo">Malo</option>
            </Select>
          </Field>
          <Field label="Dieta especial">
            <Input
              value={a.dietaEspecial}
              onChange={(e) => alim.set("dietaEspecial", e.target.value)}
              placeholder="Ej: sin gluten, sin lactosa…"
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Alimentos preferidos" hint="Sepáralos con comas">
            <Input
              value={prefText}
              onChange={(e) => {
                setPrefText(e.target.value);
                alim.set("alimentosPreferidos", toArray(e.target.value));
              }}
              placeholder="Pollo, arroz, manzana…"
            />
          </Field>
          <Field label="Alimentos rechazados" hint="Sepáralos con comas">
            <Input
              value={rechText}
              onChange={(e) => {
                setRechText(e.target.value);
                alim.set("alimentosRechazados", toArray(e.target.value));
              }}
              placeholder="Vegetales de hoja verde…"
            />
          </Field>
        </div>
      </Sec>

      <ExpedienteFooter
        dirty={dirty}
        saving={saving}
        onSave={saveBoth}
        label="nutrición y digestivo"
      />
    </div>
  );
}
