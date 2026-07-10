import { Stethoscope, Users } from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import { useExpediente } from "@/store/expedienteStore";
import {
  ExpedienteFooter,
  Sec,
  ToggleCell,
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
          <ToggleCell
            label="¿Padece alguna enfermedad crónica?"
            value={form.padeceEnfermedad}
            onChange={(v) => set("padeceEnfermedad", v)}
          >
            <Textarea
              value={form.cualEnfermedad}
              onChange={(e) => set("cualEnfermedad", e.target.value)}
              placeholder="¿Cuál?"
              className="min-h-[72px]"
            />
          </ToggleCell>

          <ToggleCell
            label="¿Toma algún medicamento, suplemento o vitamina?"
            value={form.tomaMedicamentos}
            onChange={(v) => set("tomaMedicamentos", v)}
          >
            <Textarea
              value={form.cualMedicamento}
              onChange={(e) => set("cualMedicamento", e.target.value)}
              placeholder="¿Cuál?"
              className="min-h-[72px]"
            />
          </ToggleCell>

          <ToggleCell
            label="¿Lo / la han operado?"
            value={form.haSidoOperado}
            onChange={(v) => set("haSidoOperado", v)}
          >
            <Textarea
              value={form.cirugias}
              onChange={(e) => set("cirugias", e.target.value)}
              placeholder="¿De qué?"
              className="min-h-[72px]"
            />
          </ToggleCell>

          <ToggleCell
            label="¿Ha estado hospitalizado(a)?"
            value={form.haSidoHospitalizado}
            onChange={(v) => set("haSidoHospitalizado", v)}
          >
            <Textarea
              value={form.hospitalizaciones}
              onChange={(e) => set("hospitalizaciones", e.target.value)}
              placeholder="¿Motivo?"
              className="min-h-[72px]"
            />
          </ToggleCell>

          <ToggleCell
            label="Alergias a medicamentos o alimentos"
            value={form.tieneAlergias}
            onChange={(v) => {
              set("tieneAlergias", v);
              if (!v) set("alergias", "");
            }}
          >
            <Textarea
              value={form.alergias}
              onChange={(e) => set("alergias", e.target.value)}
              placeholder="¿Cuáles?"
              className="min-h-[72px]"
            />
          </ToggleCell>
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
