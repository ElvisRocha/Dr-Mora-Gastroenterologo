import { Stethoscope, Users } from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import { useExpediente } from "@/store/expedienteStore";
import {
  ExpedienteFooter,
  Sec,
  ToggleField,
  useExpedienteSection,
} from "./formKit";

export function ExpedienteAntecedentes({ pacienteId }: { pacienteId: string }) {
  const initial = useExpediente(pacienteId).antecedentes;
  const { form, set, dirty, saving, save } = useExpedienteSection(
    pacienteId,
    "antecedentes",
    initial,
  );

  return (
    <div className="space-y-4">
      <Sec title="Antecedentes patológicos" icon={<Stethoscope size={16} strokeWidth={1.75} />}>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <ToggleField
            label="¿Padece alguna enfermedad crónica?"
            value={form.padeceEnfermedad}
            onChange={(v) => set("padeceEnfermedad", v)}
            detail={form.cualEnfermedad}
            onDetail={(v) => set("cualEnfermedad", v)}
            placeholder="¿Cuál?"
          />

          <ToggleField
            label="¿Toma algún medicamento, suplemento o vitamina?"
            value={form.tomaMedicamentos}
            onChange={(v) => set("tomaMedicamentos", v)}
            detail={form.cualMedicamento}
            onDetail={(v) => set("cualMedicamento", v)}
            placeholder="¿Cuál?"
          />

          <ToggleField
            label="¿Lo / la han operado?"
            value={form.haSidoOperado}
            onChange={(v) => set("haSidoOperado", v)}
            detail={form.cirugias}
            onDetail={(v) => set("cirugias", v)}
            placeholder="¿De qué?"
          />

          <ToggleField
            label="¿Ha estado hospitalizado(a)?"
            value={form.haSidoHospitalizado}
            onChange={(v) => set("haSidoHospitalizado", v)}
            detail={form.hospitalizaciones}
            onDetail={(v) => set("hospitalizaciones", v)}
            placeholder="¿Motivo?"
          />

          <ToggleField
            label="Alergias a medicamentos o alimentos"
            value={form.tieneAlergias}
            onChange={(v) => set("tieneAlergias", v)}
            detail={form.alergias}
            onDetail={(v) => set("alergias", v)}
            placeholder="¿Cuáles?"
          />
        </div>
      </Sec>

      <Sec title="Antecedentes familiares" icon={<Users size={16} strokeWidth={1.75} />}>
        <label className="block">
          <span className="mb-1.5 block text-xs text-muted-foreground">
            Enfermedades importantes en la familia
          </span>
          <Textarea
            value={form.familiares}
            onChange={(e) => set("familiares", e.target.value)}
            placeholder="Ej: enfermedad celíaca, enfermedad inflamatoria intestinal, alergias alimentarias, intolerancias…"
            className="min-h-[90px]"
          />
        </label>
      </Sec>

      <ExpedienteFooter
        dirty={dirty}
        saving={saving}
        onSave={save}
        label="antecedentes"
      />
    </div>
  );
}
