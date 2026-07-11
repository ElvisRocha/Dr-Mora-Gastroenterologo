import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Baby,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  Image as ImageIcon,
  Microscope,
  Paperclip,
  Pencil,
  Save,
  ScanLine,
  Stethoscope,
  Trash2,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { SidePanel } from "@/components/ui/SidePanel";
import { TriStateChips } from "@/components/ui/TriStateChips";
import { cn } from "@/lib/cn";
import {
  emptyEndoscopia,
  emptyHabitosConsulta,
  serviciosMock,
  MAX_IMAGENES_ENDOSCOPIA,
  type ArchivoMock,
  type ArchivoTipo,
  type ConsultaMock,
  type EndoscopiaMock,
  type HabitoEntry,
  type HabitosConsultaMock,
  type MedicamentoMock,
  type TipoConsulta,
  type TriState,
} from "@/lib/mock";
import {
  MAX_FILE_BYTES,
  MAX_FILES_PER_CONSULTA,
  useConsultas,
  useExpedienteStore,
  usePaciente,
} from "@/store/expedienteStore";
import { useLang } from "@/contexts/LanguageContext";
import { ChipsInput, MedicamentosEditor } from "./EditarPacienteModal";
import { UploadMenu } from "./expediente/UploadMenu";
import { DrawingCanvas } from "./expediente/DrawingCanvas";

// ─── Config ──────────────────────────────────────────────────────────────
const TIPOS: {
  key: TipoConsulta;
  label: string;
  desc: string;
  icon: typeof Stethoscope;
}[] = [
  {
    key: "general",
    label: "Consulta general",
    desc: "Motivo, enfermedad actual, examen físico, diagnóstico y plan.",
    icon: Stethoscope,
  },
  {
    key: "nino_sano",
    label: "Control de niño sano",
    desc: "Crecimiento, desarrollo, alimentación y tamizajes.",
    icon: Baby,
  },
  {
    key: "seguimiento",
    label: "Seguimiento",
    desc: "Evolución, adherencia y ajuste de tratamiento.",
    icon: Activity,
  },
  {
    key: "endoscopia",
    label: "Endoscopía / procedimiento",
    desc: "Indicación, hallazgos, biopsias e impresión.",
    icon: Microscope,
  },
];

const HABITOS_CFG: {
  key: keyof HabitosConsultaMock;
  label: string;
  placeholder: string;
}[] = [
  { key: "alimentacion", label: "Alimentación / dieta", placeholder: "Tipo de dieta, comidas al día, variedad…" },
  { key: "sueno", label: "Sueño", placeholder: "Horas, calidad, despertares nocturnos…" },
  { key: "actividadFisica", label: "Actividad física y juego", placeholder: "Tipo y frecuencia…" },
  { key: "pantallas", label: "Tiempo de pantalla", placeholder: "Horas por día, dispositivos…" },
  { key: "habitoIntestinal", label: "Hábito intestinal", placeholder: "Frecuencia, consistencia…" },
  { key: "hidratacion", label: "Hidratación", placeholder: "Vasos de agua al día…" },
  { key: "tabacoVapeo", label: "Tabaco / vapeo", placeholder: "Adolescentes: cantidad y frecuencia…" },
  { key: "alcohol", label: "Alcohol", placeholder: "Adolescentes: tipo y frecuencia…" },
  { key: "cafeina", label: "Cafeína / bebidas energéticas", placeholder: "Café, té, bebidas energéticas…" },
];

// ─── Form state ────────────────────────────────────────────────────────────
type ArchivoStaged = {
  id: string;
  nombre: string;
  mimeType: string;
  tamanoBytes: number;
  data: string;
  subidoEn: string;
  tipo: ArchivoTipo;
};

type FormState = {
  servicioSlug: string;
  tipoConsulta: TipoConsulta;
  acompananteBool: TriState;
  acompanante: string;
  motivo: string;
  enfermedadActual: string;
  // niño sano
  desarrolloNotas: string;
  alimentacionNotas: string;
  tamizajesNotas: string;
  // seguimiento
  evolucionNotas: string;
  adherenciaNotas: string;
  // endoscopía
  endoscopia: EndoscopiaMock;
  habitos: HabitosConsultaMock;
  resultadosLaboratorio: string;
  signosVitales: {
    pa: string;
    fc: string;
    fr: string;
    satO2: string;
    temperatura: string;
    pesoKg: string;
    tallaCm: string;
    perimetroCefalicoCm: string;
    percentilPeso: string;
  };
  exploracionFisica: {
    general: string;
    orofaringe: string;
    cardiopulmonar: string;
    abdomen: string;
    piel: string;
    neurologico: string;
  };
  diagnosticos: string[];
  procedimientosOrdenados: string[];
  medicamentosRecetados: MedicamentoMock[];
  planTratamiento: string;
  notasAdicionales: string;
  archivos: ArchivoStaged[];
};

const emptyForm = (): FormState => ({
  servicioSlug: "consulta-gastro",
  tipoConsulta: "general",
  acompananteBool: null,
  acompanante: "",
  motivo: "",
  enfermedadActual: "",
  desarrolloNotas: "",
  alimentacionNotas: "",
  tamizajesNotas: "",
  evolucionNotas: "",
  adherenciaNotas: "",
  endoscopia: emptyEndoscopia(),
  habitos: emptyHabitosConsulta(),
  resultadosLaboratorio: "",
  signosVitales: {
    pa: "",
    fc: "",
    fr: "",
    satO2: "",
    temperatura: "",
    pesoKg: "",
    tallaCm: "",
    perimetroCefalicoCm: "",
    percentilPeso: "",
  },
  exploracionFisica: {
    general: "",
    orofaringe: "",
    cardiopulmonar: "",
    abdomen: "",
    piel: "",
    neurologico: "",
  },
  diagnosticos: [],
  procedimientosOrdenados: [],
  medicamentosRecetados: [],
  planTratamiento: "",
  notasAdicionales: "",
  archivos: [],
});

function fromConsulta(c: ConsultaMock, archivos: ArchivoStaged[]): FormState {
  const sv = c.signosVitales;
  const ef = c.exploracionFisica;
  const numStr = (n?: number) => (n != null ? String(n) : "");
  return {
    servicioSlug: c.servicioSlug,
    tipoConsulta: c.tipoConsulta ?? "general",
    acompananteBool: c.acompanante ? true : null,
    acompanante: c.acompanante ?? "",
    motivo: c.motivo,
    enfermedadActual: c.enfermedadActual ?? "",
    desarrolloNotas: c.desarrolloNotas ?? "",
    alimentacionNotas: c.alimentacionNotas ?? "",
    tamizajesNotas: c.tamizajesNotas ?? "",
    evolucionNotas: c.evolucionNotas ?? "",
    adherenciaNotas: c.adherenciaNotas ?? "",
    endoscopia: { ...emptyEndoscopia(), ...c.endoscopia },
    habitos: { ...emptyHabitosConsulta(), ...c.habitos },
    resultadosLaboratorio: c.resultadosLaboratorio ?? "",
    signosVitales: {
      pa: sv?.pa ?? "",
      fc: sv?.fc ?? "",
      fr: sv?.fr ?? "",
      satO2: sv?.satO2 ?? "",
      temperatura: numStr(sv?.temperatura),
      pesoKg: numStr(sv?.pesoKg),
      tallaCm: numStr(sv?.tallaCm),
      perimetroCefalicoCm: numStr(sv?.perimetroCefalicoCm),
      percentilPeso: sv?.percentilPeso ?? "",
    },
    exploracionFisica: {
      general: ef?.general ?? "",
      orofaringe: ef?.orofaringe ?? "",
      cardiopulmonar: ef?.cardiopulmonar ?? "",
      abdomen: ef?.abdomen ?? "",
      piel: ef?.piel ?? "",
      neurologico: ef?.neurologico ?? "",
    },
    diagnosticos: [...c.diagnosticos],
    procedimientosOrdenados: [...c.procedimientosOrdenados],
    medicamentosRecetados: c.medicamentosRecetados.map((m) => ({ ...m })),
    planTratamiento: c.planTratamiento ?? "",
    notasAdicionales: c.notasAdicionales ?? "",
    archivos,
  };
}

function calcImc(pesoStr: string, tallaCmStr: string): number | null {
  const peso = parseFloat(pesoStr);
  const tallaCm = parseFloat(tallaCmStr);
  if (!peso || !tallaCm || tallaCm <= 0) return null;
  const tallaM = tallaCm / 100;
  return Math.round((peso / (tallaM * tallaM)) * 10) / 10;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Aceptamos hasta 10 MB de origen y recomprimimos para que el demo persista en
// localStorage sin llenar la cuota.
const SOURCE_MAX_BYTES = 10 * 1024 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downscaleImage(
  file: File,
  maxDim = 1400,
  quality = 0.82,
): Promise<{ data: string; bytes: number }> {
  const src = await fileToBase64(file);
  const img = await loadImage(src);
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (Math.max(w, h) > maxDim) {
    const s = maxDim / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { data: src, bytes: Math.round((src.length * 3) / 4) };
  ctx.drawImage(img, 0, 0, w, h);
  const data = canvas.toDataURL("image/jpeg", quality);
  return { data, bytes: Math.round((data.length * 3) / 4) };
}

const habitoHasData = (h: HabitosConsultaMock) =>
  Object.values(h).some((e) => e.tiene !== null || e.notas.trim() !== "");

// ─── Component ───────────────────────────────────────────────────────────
export function ConsultaFormModal({
  pacienteId,
  open,
  onClose,
  consulta,
}: {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
  consulta?: ConsultaMock | null;
}) {
  const { t } = useLang();
  const { paciente, update } = usePaciente(pacienteId);
  const { addConsulta, updateConsulta } = useConsultas(pacienteId);
  const store = useExpedienteStore();
  const [form, setForm] = useState<FormState>(emptyForm);
  const endoInputRef = useRef<HTMLInputElement>(null);
  const dibujoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  // Imagen abierta en el lienzo de dibujo; null = cerrado.
  const [drawing, setDrawing] = useState<{
    image: string;
    editId: string | null;
  } | null>(null);

  const isEdit = !!consulta;

  useEffect(() => {
    if (!open) return;
    if (consulta) {
      const archivos: ArchivoStaged[] = store
        .listArchivos(consulta.id)
        .map((a) => ({
          id: a.id,
          nombre: a.nombre,
          mimeType: a.mimeType,
          tamanoBytes: a.tamanoBytes,
          data: a.data,
          subidoEn: a.subidoEn,
          tipo: a.tipo ?? "documento",
        }));
      setForm(fromConsulta(consulta, archivos));
    } else {
      setForm(emptyForm());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, consulta]);

  const imc = useMemo(
    () => calcImc(form.signosVitales.pesoKg, form.signosVitales.tallaCm),
    [form.signosVitales.pesoKg, form.signosVitales.tallaCm],
  );

  if (!paciente) return null;

  const tipo = form.tipoConsulta;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSV = (key: keyof FormState["signosVitales"], value: string) =>
    setForm((prev) => ({
      ...prev,
      signosVitales: { ...prev.signosVitales, [key]: value },
    }));

  const setEF = (key: keyof FormState["exploracionFisica"], value: string) =>
    setForm((prev) => ({
      ...prev,
      exploracionFisica: { ...prev.exploracionFisica, [key]: value },
    }));

  const setHabito = (key: keyof HabitosConsultaMock, entry: HabitoEntry) =>
    setForm((prev) => ({
      ...prev,
      habitos: { ...prev.habitos, [key]: entry },
    }));

  const setEndo = (key: keyof EndoscopiaMock, value: string) =>
    setForm((prev) => ({
      ...prev,
      endoscopia: { ...prev.endoscopia, [key]: value },
    }));

  const addStaged = (items: ArchivoStaged[]) => {
    if (items.length)
      setForm((prev) => ({ ...prev, archivos: [...prev.archivos, ...items] }));
  };

  const stageId = () =>
    `arc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Documentos (PDF/imágenes): se guardan tal cual, sujetos al límite del store.
  const stageDocumentos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const count = form.archivos.filter((a) => a.tipo === "documento").length;
    const remaining = MAX_FILES_PER_CONSULTA - count;
    if (remaining <= 0) {
      toast.error(`Solo se permiten ${MAX_FILES_PER_CONSULTA} documentos por consulta.`);
      return;
    }
    const list = Array.from(files).slice(0, remaining);
    if (files.length > remaining)
      toast.warning(`Solo se aceptaron ${remaining} de ${files.length} documentos.`);
    const nuevos: ArchivoStaged[] = [];
    for (const file of list) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} excede ${formatBytes(MAX_FILE_BYTES)}.`);
        continue;
      }
      try {
        nuevos.push({
          id: stageId(),
          nombre: file.name,
          mimeType: file.type || "application/octet-stream",
          tamanoBytes: file.size,
          data: await fileToBase64(file),
          subidoEn: new Date().toISOString(),
          tipo: "documento",
        });
      } catch {
        toast.error(`No se pudo leer ${file.name}.`);
      }
    }
    addStaged(nuevos);
    if (docInputRef.current) docInputRef.current.value = "";
  };

  // Imágenes de endoscopía: galería de hasta 5, recomprimidas para el demo.
  const stageEndoscopia = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const count = form.archivos.filter((a) => a.tipo === "endoscopia").length;
    const remaining = MAX_IMAGENES_ENDOSCOPIA - count;
    if (remaining <= 0) {
      toast.error(`Máximo ${MAX_IMAGENES_ENDOSCOPIA} imágenes de endoscopía.`);
      return;
    }
    const imgs = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    if (!imgs.length) {
      toast.error("Selecciona imágenes (JPG, PNG o WEBP).");
      return;
    }
    const nuevos: ArchivoStaged[] = [];
    for (const file of imgs) {
      if (file.size > SOURCE_MAX_BYTES) {
        toast.error(`${file.name} excede ${formatBytes(SOURCE_MAX_BYTES)}.`);
        continue;
      }
      try {
        const comp = await downscaleImage(file);
        nuevos.push({
          id: stageId(),
          nombre: file.name,
          mimeType: "image/jpeg",
          tamanoBytes: comp.bytes,
          data: comp.data,
          subidoEn: new Date().toISOString(),
          tipo: "endoscopia",
        });
      } catch {
        toast.error(`No se pudo procesar ${file.name}.`);
      }
    }
    addStaged(nuevos);
    if (endoInputRef.current) endoInputRef.current.value = "";
  };

  // Imagen para dibujar: se recomprime y se abre el lienzo de anotación.
  const pickDibujo = async (files: FileList | null) => {
    const file = files?.[0];
    if (dibujoInputRef.current) dibujoInputRef.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen (JPG, PNG o WEBP).");
      return;
    }
    if (file.size > SOURCE_MAX_BYTES) {
      toast.error(`La imagen excede ${formatBytes(SOURCE_MAX_BYTES)}.`);
      return;
    }
    try {
      const comp = await downscaleImage(file, 1600, 0.9);
      setDrawing({ image: comp.data, editId: null });
    } catch {
      toast.error("No se pudo procesar la imagen.");
    }
  };

  const saveDrawing = (dataUrl: string) => {
    const bytes = Math.round((dataUrl.length * 3) / 4);
    setForm((prev) => {
      if (drawing?.editId) {
        return {
          ...prev,
          archivos: prev.archivos.map((a) =>
            a.id === drawing.editId
              ? { ...a, data: dataUrl, tamanoBytes: bytes, subidoEn: new Date().toISOString() }
              : a,
          ),
        };
      }
      const n = prev.archivos.filter((a) => a.tipo === "dibujo").length + 1;
      const nuevo: ArchivoStaged = {
        id: stageId(),
        nombre: `anotacion-${n}.jpg`,
        mimeType: "image/jpeg",
        tamanoBytes: bytes,
        data: dataUrl,
        subidoEn: new Date().toISOString(),
        tipo: "dibujo",
      };
      return { ...prev, archivos: [...prev.archivos, nuevo] };
    });
    setDrawing(null);
  };

  const removeArchivoStaged = (id: string) =>
    setForm((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((a) => a.id !== id),
    }));

  const endoImgs = form.archivos.filter((a) => a.tipo === "endoscopia");
  const dibujos = form.archivos.filter((a) => a.tipo === "dibujo");
  const documentos = form.archivos.filter((a) => a.tipo === "documento");

  const handleSave = () => {
    if (!form.motivo.trim()) return;

    const sv = form.signosVitales;
    const hasVitals =
      sv.pa || sv.fc || sv.fr || sv.satO2 || sv.temperatura || sv.pesoKg ||
      sv.tallaCm || sv.perimetroCefalicoCm || sv.percentilPeso;
    const signosVitales = hasVitals
      ? {
          pa: sv.pa.trim() || undefined,
          fc: sv.fc.trim() || undefined,
          fr: sv.fr.trim() || undefined,
          satO2: sv.satO2.trim() || undefined,
          temperatura: sv.temperatura ? Number(sv.temperatura) : undefined,
          pesoKg: sv.pesoKg ? Number(sv.pesoKg) : undefined,
          tallaCm: sv.tallaCm ? Number(sv.tallaCm) : undefined,
          perimetroCefalicoCm: sv.perimetroCefalicoCm
            ? Number(sv.perimetroCefalicoCm)
            : undefined,
          imc: imc ?? undefined,
          percentilPeso: sv.percentilPeso.trim() || undefined,
        }
      : undefined;

    const ef = form.exploracionFisica;
    const hasEf = Object.values(ef).some((v) => v.trim());
    const exploracionFisica = hasEf
      ? {
          general: ef.general.trim() || undefined,
          orofaringe: ef.orofaringe.trim() || undefined,
          cardiopulmonar: ef.cardiopulmonar.trim() || undefined,
          abdomen: ef.abdomen.trim() || undefined,
          piel: ef.piel.trim() || undefined,
          neurologico: ef.neurologico.trim() || undefined,
        }
      : undefined;

    const endoHasData = Object.values(form.endoscopia).some((v) => v.trim());
    const meta = serviciosMock.find((s) => s.slug === form.servicioSlug);
    const cid = isEdit && consulta ? consulta.id : `co-${Date.now()}`;

    const baseFields: Omit<ConsultaMock, "id" | "fecha" | "duracionMin"> = {
      pacienteId,
      servicioSlug: form.servicioSlug,
      tipoConsulta: form.tipoConsulta,
      motivo: form.motivo.trim(),
      notas: form.notasAdicionales.trim(),
      diagnosticos: form.diagnosticos,
      procedimientosOrdenados: form.procedimientosOrdenados,
      medicamentosRecetados: form.medicamentosRecetados,
      acompanante:
        form.acompananteBool && form.acompanante.trim()
          ? form.acompanante.trim()
          : form.acompananteBool
            ? "Acompañado"
            : undefined,
      enfermedadActual:
        tipo !== "endoscopia" ? form.enfermedadActual.trim() || undefined : undefined,
      desarrolloNotas:
        tipo === "nino_sano" ? form.desarrolloNotas.trim() || undefined : undefined,
      alimentacionNotas:
        tipo === "nino_sano" ? form.alimentacionNotas.trim() || undefined : undefined,
      tamizajesNotas:
        tipo === "nino_sano" ? form.tamizajesNotas.trim() || undefined : undefined,
      evolucionNotas:
        tipo === "seguimiento" ? form.evolucionNotas.trim() || undefined : undefined,
      adherenciaNotas:
        tipo === "seguimiento" ? form.adherenciaNotas.trim() || undefined : undefined,
      endoscopia:
        tipo === "endoscopia" && endoHasData ? form.endoscopia : undefined,
      habitos: habitoHasData(form.habitos) ? form.habitos : undefined,
      resultadosLaboratorio: form.resultadosLaboratorio.trim() || undefined,
      signosVitales,
      exploracionFisica,
      planTratamiento: form.planTratamiento.trim() || undefined,
      notasAdicionales: form.notasAdicionales.trim() || undefined,
    };

    if (isEdit && consulta) {
      updateConsulta(consulta.id, baseFields);
    } else {
      const nueva: ConsultaMock = {
        ...baseFields,
        id: cid,
        fecha: new Date().toISOString(),
        duracionMin: meta?.duracion ?? 0,
      };
      addConsulta(nueva);
    }

    // Reconciliar archivos adjuntos con el store.
    const existentes = store.listArchivos(cid);
    const keep = new Set(form.archivos.map((a) => a.id));
    existentes.filter((a) => !keep.has(a.id)).forEach((a) => store.removeArchivo(a.id));
    const existIds = new Set(existentes.map((a) => a.id));
    form.archivos
      .filter((a) => !existIds.has(a.id))
      .forEach((a) => {
        const archivo: ArchivoMock = { ...a, consultaId: cid };
        store.addArchivo(archivo);
      });

    // Sincronizar paciente con dx, meds y procedimientos nuevos.
    const mergedDx = Array.from(
      new Set([...paciente.diagnosticosActivos, ...form.diagnosticos]),
    );
    const existingMedNames = new Set(
      (paciente.medicamentosActivos ?? []).map((m) => m.nombre.toLowerCase()),
    );
    const newMeds = form.medicamentosRecetados.filter(
      (m) => !existingMedNames.has(m.nombre.toLowerCase()),
    );
    const existingProc = new Set(
      (paciente.procedimientosAsignados ?? []).map((p) => p.nombre.toLowerCase()),
    );
    const newProc = form.procedimientosOrdenados
      .filter((p) => !existingProc.has(p.toLowerCase()))
      .map((nombre) => ({ nombre, estado: "pendiente" as const }));

    const patientPatch: Partial<typeof paciente> = {
      diagnosticosActivos: mergedDx,
      medicamentosActivos: [...(paciente.medicamentosActivos ?? []), ...newMeds],
      procedimientosAsignados: [
        ...(paciente.procedimientosAsignados ?? []),
        ...newProc,
      ],
    };
    if (!isEdit) patientPatch.ultimaConsulta = new Date().toISOString();
    update(patientPatch);

    toast.success(isEdit ? "Consulta actualizada" : "Consulta guardada");
    onClose();
  };

  const canSave = !!form.motivo.trim();
  const subtitle = `${paciente.nombre} ${paciente.apellidoPaterno}${
    paciente.apellidoMaterno ? ` ${paciente.apellidoMaterno}` : ""
  }`;

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar consulta" : "Nueva consulta"}
      subtitle={subtitle}
      headerActions={
        <UploadMenu
          onEndoscopia={() => endoInputRef.current?.click()}
          onDibujo={() => dibujoInputRef.current?.click()}
          onDocumento={() => docInputRef.current?.click()}
          endoscopiaDisabled={endoImgs.length >= MAX_IMAGENES_ENDOSCOPIA}
        />
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            <Save size={14} strokeWidth={1.75} />
            {isEdit ? "Guardar cambios" : "Guardar consulta"}
          </Button>
        </>
      }
    >
      <input
        ref={endoInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*"
        onChange={(e) => stageEndoscopia(e.target.files)}
      />
      <input
        ref={dibujoInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => pickDibujo(e.target.files)}
      />
      <input
        ref={docInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => stageDocumentos(e.target.files)}
      />

      {drawing ? (
        <DrawingCanvas
          image={drawing.image}
          onSave={saveDrawing}
          onClose={() => setDrawing(null)}
        />
      ) : null}

      <div className="space-y-6">
        {/* Nombre del servicio */}
        <Field label="Nombre del servicio" required>
          <Select
            value={form.servicioSlug}
            onChange={(e) => set("servicioSlug", e.target.value)}
          >
            {t.servicios.items.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nombre}
              </option>
            ))}
          </Select>
        </Field>

        {/* Tipo de consulta */}
        <div>
          <SectionHeading>Tipo de consulta</SectionHeading>
          <p className="mb-3 mt-0.5 text-xs text-muted-foreground">
            Selecciona el tipo de consulta.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TIPOS.map((tp) => {
              const active = tipo === tp.key;
              const Icon = tp.icon;
              return (
                <button
                  key={tp.key}
                  type="button"
                  onClick={() => set("tipoConsulta", tp.key)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    active
                      ? "border-navy bg-navy/5 ring-1 ring-navy/30"
                      : "border-border bg-card hover:border-navy/30 hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-navy" : "border-muted-foreground/40",
                    )}
                  >
                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-navy" />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <Icon size={14} strokeWidth={1.75} className="text-navy" />
                      {tp.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {tp.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Acompañante */}
        <div>
          <SectionHeading>¿El paciente viene acompañado?</SectionHeading>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <TriStateChips
              value={form.acompananteBool}
              onChange={(v) => set("acompananteBool", v)}
            />
            {form.acompananteBool === true ? (
              <Input
                value={form.acompanante}
                onChange={(e) => set("acompanante", e.target.value)}
                placeholder="¿Quién acompaña? (madre, padre, tutor…)"
                className="max-w-xs flex-1"
              />
            ) : null}
          </div>
        </div>

        {/* Motivo de consulta */}
        <div className="space-y-4">
          <SectionHeading>Motivo de consulta</SectionHeading>
          <Field label="Motivo de consulta" required>
            <Textarea
              rows={2}
              value={form.motivo}
              onChange={(e) => set("motivo", e.target.value)}
              placeholder="¿Por qué acude el paciente?"
              className="min-h-[64px]"
            />
          </Field>
          {tipo !== "endoscopia" ? (
            <Field label="Enfermedad actual / padecimiento">
              <Textarea
                value={form.enfermedadActual}
                onChange={(e) => set("enfermedadActual", e.target.value)}
                placeholder="Cronología, síntomas, evolución, tratamientos previos…"
              />
            </Field>
          ) : null}
        </div>

        {/* Sección específica por tipo */}
        {tipo === "nino_sano" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
            <SectionHeading>Crecimiento y desarrollo</SectionHeading>
            <Field label="Desarrollo psicomotor">
              <Textarea
                value={form.desarrolloNotas}
                onChange={(e) => set("desarrolloNotas", e.target.value)}
                placeholder="Hitos alcanzados, lenguaje, motricidad, socialización…"
                className="min-h-[72px]"
              />
            </Field>
            <Field label="Alimentación actual">
              <Textarea
                value={form.alimentacionNotas}
                onChange={(e) => set("alimentacionNotas", e.target.value)}
                placeholder="Tipo de alimentación, apetito, introducción de alimentos…"
                className="min-h-[72px]"
              />
            </Field>
            <Field label="Tamizajes y vacunas">
              <Textarea
                value={form.tamizajesNotas}
                onChange={(e) => set("tamizajesNotas", e.target.value)}
                placeholder="Esquema al día, tamizajes (visión, audición, laboratorio), pendientes…"
                className="min-h-[72px]"
              />
            </Field>
          </div>
        ) : null}

        {tipo === "seguimiento" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
            <SectionHeading>Seguimiento</SectionHeading>
            <Field label="Evolución desde la última consulta">
              <Textarea
                value={form.evolucionNotas}
                onChange={(e) => set("evolucionNotas", e.target.value)}
                placeholder="Cambios en síntomas, crecimiento, respuesta al tratamiento…"
                className="min-h-[72px]"
              />
            </Field>
            <Field label="Adherencia al tratamiento">
              <Textarea
                value={form.adherenciaNotas}
                onChange={(e) => set("adherenciaNotas", e.target.value)}
                placeholder="Cumplimiento de medicación y dieta, dificultades reportadas…"
                className="min-h-[72px]"
              />
            </Field>
          </div>
        ) : null}

        {tipo === "endoscopia" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
            <SectionHeading>Hallazgos endoscópicos</SectionHeading>
            <Field label="Indicación del procedimiento">
              <Textarea
                value={form.endoscopia.indicacion}
                onChange={(e) => setEndo("indicacion", e.target.value)}
                placeholder="Motivo del estudio…"
                className="min-h-[60px]"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Esófago">
                <Textarea
                  value={form.endoscopia.esofago}
                  onChange={(e) => setEndo("esofago", e.target.value)}
                  placeholder="Hallazgos…"
                  className="min-h-[60px]"
                />
              </Field>
              <Field label="Estómago">
                <Textarea
                  value={form.endoscopia.estomago}
                  onChange={(e) => setEndo("estomago", e.target.value)}
                  placeholder="Hallazgos…"
                  className="min-h-[60px]"
                />
              </Field>
              <Field label="Duodeno">
                <Textarea
                  value={form.endoscopia.duodeno}
                  onChange={(e) => setEndo("duodeno", e.target.value)}
                  placeholder="Hallazgos…"
                  className="min-h-[60px]"
                />
              </Field>
              <Field label="Colon / Íleon">
                <Textarea
                  value={form.endoscopia.colonIleon}
                  onChange={(e) => setEndo("colonIleon", e.target.value)}
                  placeholder="Hallazgos…"
                  className="min-h-[60px]"
                />
              </Field>
            </div>
            <Field label="Biopsias tomadas">
              <Textarea
                value={form.endoscopia.biopsias}
                onChange={(e) => setEndo("biopsias", e.target.value)}
                placeholder="Sitios y número de muestras…"
                className="min-h-[56px]"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Impresión endoscópica">
                <Textarea
                  value={form.endoscopia.impresion}
                  onChange={(e) => setEndo("impresion", e.target.value)}
                  placeholder="Conclusión del estudio…"
                  className="min-h-[60px]"
                />
              </Field>
              <Field label="Sedación y tolerancia">
                <Textarea
                  value={form.endoscopia.sedacionTolerancia}
                  onChange={(e) => setEndo("sedacionTolerancia", e.target.value)}
                  placeholder="Tipo de sedación, tolerancia, complicaciones…"
                  className="min-h-[60px]"
                />
              </Field>
            </div>
          </div>
        ) : null}

        {/* Hábitos */}
        <CollapsibleSection
          title="Hábitos"
          icon={<HeartPulse size={16} strokeWidth={1.75} />}
          hasData={habitoHasData(form.habitos)}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HABITOS_CFG.map((cfg) => (
              <HabitoField
                key={cfg.key}
                label={cfg.label}
                placeholder={cfg.placeholder}
                entry={form.habitos[cfg.key]}
                onChange={(entry) => setHabito(cfg.key, entry)}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Exámenes de laboratorio */}
        <div>
          <SectionHeading>
            <span className="inline-flex items-center gap-2">
              <FlaskConical size={15} strokeWidth={1.75} className="text-navy" />
              Exámenes de laboratorio
            </span>
          </SectionHeading>
          <Textarea
            value={form.resultadosLaboratorio}
            onChange={(e) => set("resultadosLaboratorio", e.target.value)}
            placeholder="Resultados de exámenes de laboratorio…"
            className="mt-2"
          />
        </div>

        {/* Examen físico */}
        <CollapsibleSection
          title="Examen físico"
          icon={<Stethoscope size={16} strokeWidth={1.75} />}
          hasData={
            Object.values(form.signosVitales).some((v) => v) ||
            Object.values(form.exploracionFisica).some((v) => v)
          }
        >
          <div className="space-y-4">
            <div>
              <FieldMini>Signos vitales y antropometría</FieldMini>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <Field label="PA">
                  <Input value={form.signosVitales.pa} onChange={(e) => setSV("pa", e.target.value)} placeholder="100/60" />
                </Field>
                <Field label="FC">
                  <Input value={form.signosVitales.fc} onChange={(e) => setSV("fc", e.target.value)} placeholder="90 lpm" />
                </Field>
                <Field label="FR">
                  <Input value={form.signosVitales.fr} onChange={(e) => setSV("fr", e.target.value)} placeholder="24 rpm" />
                </Field>
                <Field label="SatO₂">
                  <Input value={form.signosVitales.satO2} onChange={(e) => setSV("satO2", e.target.value)} placeholder="98 %" />
                </Field>
                <Field label="Temp (°C)">
                  <Input type="number" inputMode="decimal" step="0.1" value={form.signosVitales.temperatura} onChange={(e) => setSV("temperatura", e.target.value)} placeholder="36.5" />
                </Field>
                <Field label="Peso (kg)">
                  <Input type="number" inputMode="decimal" step="0.1" value={form.signosVitales.pesoKg} onChange={(e) => setSV("pesoKg", e.target.value)} placeholder="—" />
                </Field>
                <Field label="Talla (cm)">
                  <Input type="number" inputMode="decimal" step="0.1" value={form.signosVitales.tallaCm} onChange={(e) => setSV("tallaCm", e.target.value)} placeholder="—" />
                </Field>
                <Field label="P. cefálico (cm)">
                  <Input type="number" inputMode="decimal" step="0.1" value={form.signosVitales.perimetroCefalicoCm} onChange={(e) => setSV("perimetroCefalicoCm", e.target.value)} placeholder="—" />
                </Field>
                <Field label="IMC (auto)">
                  <Input value={imc != null ? String(imc) : ""} readOnly placeholder="—" />
                </Field>
                <Field label="Percentil peso">
                  <Input value={form.signosVitales.percentilPeso} onChange={(e) => setSV("percentilPeso", e.target.value)} placeholder="p50" />
                </Field>
              </div>
            </div>
            <div>
              <FieldMini>Exploración por sistemas</FieldMini>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="General">
                  <Textarea value={form.exploracionFisica.general} onChange={(e) => setEF("general", e.target.value)} placeholder="Estado general, hidratación, coloración…" className="min-h-[60px]" />
                </Field>
                <Field label="Orofaringe / cuello">
                  <Textarea value={form.exploracionFisica.orofaringe} onChange={(e) => setEF("orofaringe", e.target.value)} placeholder="Fauces, adenopatías…" className="min-h-[60px]" />
                </Field>
                <Field label="Cardiopulmonar">
                  <Textarea value={form.exploracionFisica.cardiopulmonar} onChange={(e) => setEF("cardiopulmonar", e.target.value)} placeholder="Ruidos, murmullo, esfuerzo…" className="min-h-[60px]" />
                </Field>
                <Field label="Abdomen">
                  <Textarea value={form.exploracionFisica.abdomen} onChange={(e) => setEF("abdomen", e.target.value)} placeholder="Dolor, masas, visceromegalias, ruidos…" className="min-h-[60px]" />
                </Field>
                <Field label="Piel">
                  <Textarea value={form.exploracionFisica.piel} onChange={(e) => setEF("piel", e.target.value)} placeholder="Lesiones, ictericia, palidez…" className="min-h-[60px]" />
                </Field>
                <Field label="Neurológico">
                  <Textarea value={form.exploracionFisica.neurologico} onChange={(e) => setEF("neurologico", e.target.value)} placeholder="Tono, reflejos, actitud…" className="min-h-[60px]" />
                </Field>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Diagnóstico y plan */}
        <CollapsibleSection
          title="Diagnóstico y plan de tratamiento"
          icon={<ClipboardList size={16} strokeWidth={1.75} />}
          hasData={
            form.diagnosticos.length > 0 ||
            form.procedimientosOrdenados.length > 0 ||
            form.medicamentosRecetados.length > 0 ||
            !!form.planTratamiento.trim() ||
            !!form.notasAdicionales.trim()
          }
          defaultOpen
        >
          <div className="space-y-4">
            <div>
              <FieldMini>Diagnósticos</FieldMini>
              <ChipsInput
                items={form.diagnosticos}
                onChange={(next) => set("diagnosticos", next)}
                placeholder="Agregar diagnóstico…"
              />
            </div>
            <div>
              <FieldMini>Procedimientos ordenados</FieldMini>
              <ChipsInput
                items={form.procedimientosOrdenados}
                onChange={(next) => set("procedimientosOrdenados", next)}
                placeholder="Agregar procedimiento…"
              />
            </div>
            <div>
              <FieldMini>Medicamentos recetados</FieldMini>
              <MedicamentosEditor
                items={form.medicamentosRecetados}
                onChange={(next) => set("medicamentosRecetados", next)}
              />
            </div>
            <Field label="Plan / tratamiento">
              <Textarea
                value={form.planTratamiento}
                onChange={(e) => set("planTratamiento", e.target.value)}
                placeholder="Indicaciones, próximos pasos, ajustes terapéuticos…"
              />
            </Field>
            <Field label="Notas / recomendaciones adicionales">
              <Textarea
                value={form.notasAdicionales}
                onChange={(e) => set("notasAdicionales", e.target.value)}
                placeholder="Próxima cita, observaciones, recordatorios…"
              />
            </Field>
          </div>
        </CollapsibleSection>

        {/* Imágenes de endoscopía */}
        {endoImgs.length > 0 ? (
          <div>
            <div className="flex items-center justify-between">
              <SectionHeading>
                <span className="inline-flex items-center gap-2">
                  <ScanLine size={15} strokeWidth={1.75} className="text-navy" />
                  Imágenes de endoscopía
                </span>
              </SectionHeading>
              <span className="text-xs text-muted-foreground">
                {endoImgs.length} de {MAX_IMAGENES_ENDOSCOPIA}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {endoImgs.map((a) => (
                <ImageTile
                  key={a.id}
                  src={a.data}
                  nombre={a.nombre}
                  onRemove={() => removeArchivoStaged(a.id)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Imágenes anotadas (dibujo) */}
        {dibujos.length > 0 ? (
          <div>
            <SectionHeading>
              <span className="inline-flex items-center gap-2">
                <Pencil size={15} strokeWidth={1.75} className="text-navy" />
                Imágenes anotadas
              </span>
            </SectionHeading>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {dibujos.map((a) => (
                <ImageTile
                  key={a.id}
                  src={a.data}
                  nombre={a.nombre}
                  onRemove={() => removeArchivoStaged(a.id)}
                  onEdit={() => setDrawing({ image: a.data, editId: a.id })}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Documentos adjuntos */}
        <div>
          <div className="flex items-center justify-between">
            <SectionHeading>
              <span className="inline-flex items-center gap-2">
                <Paperclip size={15} strokeWidth={1.75} className="text-navy" />
                Documentos adjuntos
              </span>
            </SectionHeading>
            <span className="text-xs text-muted-foreground">
              {documentos.length} de {MAX_FILES_PER_CONSULTA} · máx{" "}
              {formatBytes(MAX_FILE_BYTES)}
            </span>
          </div>
          {documentos.length === 0 ? (
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="mt-3 flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center transition-colors hover:border-navy/30 hover:bg-muted/40"
            >
              <Upload size={20} strokeWidth={1.5} className="text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground">
                Sube reportes o documentos (PDF o imagen)
              </span>
            </button>
          ) : (
            <ul className="mt-3 space-y-2">
              {documentos.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {a.mimeType.startsWith("image/") ? (
                      <img src={a.data} alt={a.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={18} strokeWidth={1.5} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{a.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(a.tamanoBytes)} ·{" "}
                      {format(new Date(a.subidoEn), "dd MMM yyyy · HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <a
                      href={a.data}
                      download={a.nombre}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Descargar ${a.nombre}`}
                      title="Descargar"
                    >
                      {a.mimeType.startsWith("image/") ? (
                        <ImageIcon size={14} strokeWidth={1.75} />
                      ) : (
                        <Download size={14} strokeWidth={1.75} />
                      )}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeArchivoStaged(a.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                      aria-label={`Eliminar ${a.nombre}`}
                      title="Eliminar"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidePanel>
  );
}

function ImageTile({
  src,
  nombre,
  onRemove,
  onEdit,
}: {
  src: string;
  nombre: string;
  onRemove: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <img src={src} alt={nombre} className="aspect-square w-full object-cover" />
      <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-navy shadow-soft hover:bg-card"
            aria-label={`Editar ${nombre}`}
            title="Editar anotación"
          >
            <Pencil size={13} strokeWidth={1.75} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-coral shadow-soft hover:bg-card"
          aria-label={`Eliminar ${nombre}`}
          title="Eliminar"
        >
          <Trash2 size={13} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-foreground">{children}</h3>;
}

function FieldMini({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  );
}

function CollapsibleSection({
  title,
  icon,
  hasData,
  defaultOpen,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  hasData?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-5 py-3.5"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-navy">{icon}</span>
          {title}
          {hasData && !open ? (
            <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden />
          ) : null}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-border px-5 py-4">{children}</div>
      ) : null}
    </div>
  );
}

function HabitoField({
  label,
  entry,
  onChange,
  placeholder,
}: {
  label: string;
  entry: HabitoEntry;
  onChange: (entry: HabitoEntry) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <TriStateChips
          value={entry.tiene}
          onChange={(v) => onChange({ ...entry, tiene: v })}
        />
      </div>
      <Textarea
        value={entry.notas}
        onChange={(e) => onChange({ ...entry, notas: e.target.value })}
        placeholder={placeholder}
        className="mt-1.5 min-h-[54px]"
      />
    </div>
  );
}
