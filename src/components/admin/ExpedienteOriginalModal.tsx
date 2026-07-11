import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TIPO_ID_LABEL, formatearEdad } from "@/lib/mock";
import {
  useConsultas,
  useExpediente,
  usePaciente,
} from "@/store/expedienteStore";

const triLabel = (v: boolean | null | undefined, detalle?: string) =>
  v === true ? `Sí${detalle ? ` — ${detalle}` : ""}` : v === false ? "No" : "—";

/**
 * "Ver expediente original": muestra el expediente del paciente con estética de
 * documento escaneado/migrado desde otro sistema (Word/PDF), para la narrativa
 * de migración de la demo. Permite descargarlo como texto.
 */
export function ExpedienteOriginalModal({
  pacienteId,
  open,
  onClose,
}: {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { paciente } = usePaciente(pacienteId);
  const exp = useExpediente(pacienteId);
  const { consultas } = useConsultas(pacienteId);

  if (!paciente) return null;

  const nombre = `${paciente.nombre} ${paciente.apellidoPaterno}${
    paciente.apellidoMaterno ? ` ${paciente.apellidoMaterno}` : ""
  }`;
  const idLabel = paciente.identificacion
    ? `${TIPO_ID_LABEL[paciente.identificacion.tipo]}: ${paciente.identificacion.numero}`
    : "—";
  const a = exp.antecedentes;
  const per = exp.perinatal;

  const fechaFmt = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(+d) ? iso : format(d, "dd/MM/yyyy", { locale: es });
  };

  const descargar = () => {
    const lines: string[] = [
      "GASTRO KIDS · DR. ALFREDO MORA",
      "EXPEDIENTE CLÍNICO (documento original migrado)",
      "".padEnd(52, "="),
      `Paciente: ${nombre}`,
      `Nacimiento: ${fechaFmt(paciente.fechaNacimiento)} (${formatearEdad(paciente.fechaNacimiento)})`,
      `Identificación: ${idLabel}`,
      `Responsable: ${paciente.tutorPrincipal} · ${paciente.telefonoTutor}`,
      "",
      "ANTECEDENTES",
      `- Enfermedad crónica: ${triLabel(a.padeceEnfermedad, a.cualEnfermedad)}`,
      `- Medicamentos: ${triLabel(a.tomaMedicamentos, a.cualMedicamento)}`,
      `- Cirugías: ${triLabel(a.haSidoOperado, a.cirugias)}`,
      `- Hospitalizaciones: ${triLabel(a.haSidoHospitalizado, a.hospitalizaciones)}`,
      `- Alergias: ${triLabel(a.tieneAlergias, a.alergias)}`,
      `- Familiares: ${a.familiares || "—"}`,
      "",
      "PERINATAL Y DESARROLLO",
      `- Tipo de parto: ${per.tipoParto}`,
      `- Peso al nacer: ${per.pesoNacerKg || "—"} kg · Talla: ${per.tallaNacerCm || "—"} cm`,
      `- Lactancia: ${triLabel(per.lactanciaMaterna, per.lactancia)}`,
      `- Desarrollo: ${triLabel(per.desarrolloAcorde, per.hitos)}`,
      "",
      "CONSULTAS",
      ...(consultas.length
        ? consultas.map(
            (c) =>
              `- ${fechaFmt(c.fecha)} · ${c.motivo}${
                c.diagnosticos.length ? ` [Dx: ${c.diagnosticos.join(", ")}]` : ""
              }`,
          )
        : ["- Sin consultas registradas."]),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expediente-${paciente.nombre}-${paciente.apellidoPaterno}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Expediente original"
      description="Documento migrado desde el archivo previo del consultorio"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={descargar}>
            <Download size={14} strokeWidth={1.75} />
            Descargar
          </Button>
        </>
      }
    >
      {/* Estética de documento escaneado */}
      <div className="rounded-xl border border-border bg-[#fbfaf6] p-6 font-serif text-[13px] leading-relaxed text-[#2a2a28] shadow-inner sm:p-8">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-[#cfc9b8] pb-3">
          <FileText size={18} className="text-navy" />
          <div>
            <p className="font-semibold uppercase tracking-wide text-navy">
              Gastro Kids · Dr. Alfredo Mora
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8676]">
              Expediente clínico — documento original
            </p>
          </div>
          <span className="ml-auto rounded border border-[#cfc9b8] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#8a8676]">
            Migrado
          </span>
        </div>

        <DocRow label="Paciente" value={nombre} />
        <DocRow
          label="Nacimiento"
          value={`${fechaFmt(paciente.fechaNacimiento)} · ${formatearEdad(paciente.fechaNacimiento)}`}
        />
        <DocRow label="Identificación" value={idLabel} />
        <DocRow
          label="Responsable"
          value={`${paciente.tutorPrincipal} · ${paciente.telefonoTutor}`}
        />

        <DocSection title="Antecedentes" />
        <DocRow label="Enfermedad crónica" value={triLabel(a.padeceEnfermedad, a.cualEnfermedad)} />
        <DocRow label="Medicamentos" value={triLabel(a.tomaMedicamentos, a.cualMedicamento)} />
        <DocRow label="Cirugías" value={triLabel(a.haSidoOperado, a.cirugias)} />
        <DocRow label="Hospitalizaciones" value={triLabel(a.haSidoHospitalizado, a.hospitalizaciones)} />
        <DocRow label="Alergias" value={triLabel(a.tieneAlergias, a.alergias)} />
        <DocRow label="Familiares" value={a.familiares || "—"} />

        <DocSection title="Perinatal y desarrollo" />
        <DocRow label="Tipo de parto" value={per.tipoParto} />
        <DocRow
          label="Al nacer"
          value={`${per.pesoNacerKg || "—"} kg · ${per.tallaNacerCm || "—"} cm`}
        />
        <DocRow label="Lactancia" value={triLabel(per.lactanciaMaterna, per.lactancia)} />
        <DocRow label="Desarrollo" value={triLabel(per.desarrolloAcorde, per.hitos)} />

        <DocSection title="Consultas" />
        {consultas.length ? (
          <ul className="space-y-1.5">
            {consultas.map((c) => (
              <li key={c.id} className="border-b border-dotted border-[#e0dccb] pb-1.5">
                <span className="font-semibold">{fechaFmt(c.fecha)}</span> · {c.motivo}
                {c.diagnosticos.length ? (
                  <span className="text-[#8a8676]"> — Dx: {c.diagnosticos.join(", ")}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#8a8676]">Sin consultas registradas.</p>
        )}
      </div>
    </Modal>
  );
}

function DocSection({ title }: { title: string }) {
  return (
    <p className="mb-1.5 mt-4 border-b border-[#cfc9b8] pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy">
      {title}
    </p>
  );
}

function DocRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-40 shrink-0 text-[#8a8676]">{label}:</span>
      <span className="min-w-0 flex-1">{value}</span>
    </div>
  );
}
