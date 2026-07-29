import { agoHr, agoDay } from "./time";

// Lista de espera del consultorio. El contacto puede ser un lead (sin
// expediente) o un paciente ya registrado.

export type PrioridadEspera = "sin_triar" | "alta" | "media" | "baja";
export type EstadoEspera = "pendiente" | "agendada" | "atendida" | "descartada";
export type SourceEspera = "manual" | "bot" | "cita_urgente";

export type ListaEsperaMock = {
  id: string;
  nombre: string; // nombre del paciente (niño/a)
  tutorNombre: string;
  telefono: string;
  email?: string;
  pacienteId?: string; // vinculado a expediente
  prioridad: PrioridadEspera;
  estado: EstadoEspera;
  source: SourceEspera;
  servicioNombre?: string;
  motivo?: string;
  tieneConversacion: boolean;
  noLeidos: number;
  agregadoPor?: string;
  fecha: string; // ISO created_at
};

export const PRIORIDAD_LABEL: Record<PrioridadEspera, string> = {
  sin_triar: "Sin triar",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORIDAD_BADGE: Record<
  PrioridadEspera,
  "coral" | "amber" | "leaf" | "neutral"
> = {
  sin_triar: "neutral",
  alta: "coral",
  media: "amber",
  baja: "leaf",
};

export const SOURCE_LABEL: Record<SourceEspera, string> = {
  manual: "Manual",
  bot: "Gastrito",
  cita_urgente: "Cita urgente",
};

// Las filas con `pacienteId` son pacientes ya registrados: su identificación,
// correo y "próxima cita" se resuelven contra el expediente y la agenda (por eso
// muestran "Reagendar"). Las filas sin `pacienteId` son leads (muestran "—" en
// identificación/correo y el botón "Agendar").
export const listaEsperaSeed: ListaEsperaMock[] = [
  {
    id: "le-001",
    pacienteId: "p-001",
    nombre: "Tomás Aguirre",
    tutorNombre: "Marisol Aguirre",
    telefono: "+506 8729-1834",
    prioridad: "media",
    estado: "pendiente",
    source: "bot",
    servicioNombre: "Seguimiento de patología crónica",
    motivo: "Pidió un espacio más temprano para el seguimiento de ERGE/APLV.",
    tieneConversacion: true,
    noLeidos: 3,
    agregadoPor: "Gastrito",
    fecha: agoHr(3),
  },
  {
    id: "le-002",
    pacienteId: "p-003",
    nombre: "Daniel Krauss",
    tutorNombre: "Patricia Krauss",
    telefono: "+506 6472-9136",
    prioridad: "alta",
    estado: "pendiente",
    source: "manual",
    servicioNombre: "Endoscopía digestiva alta",
    motivo: "Necesita adelantar la endoscopía; dolor abdominal y sangrado.",
    tieneConversacion: true,
    noLeidos: 1,
    agregadoPor: "Recepción",
    fecha: agoHr(5),
  },
  {
    id: "le-003",
    nombre: "Sebastián Nieto",
    tutorNombre: "Paola Nieto",
    telefono: "+506 6540-1177",
    prioridad: "alta",
    estado: "pendiente",
    source: "bot",
    servicioNombre: "Consulta de gastroenterología pediátrica",
    motivo: "Lactante 5 meses, regurgitación abundante y llanto al comer. Posible ERGE/APLV.",
    tieneConversacion: true,
    noLeidos: 2,
    agregadoPor: "Gastrito",
    fecha: agoHr(14),
  },
  {
    id: "le-004",
    pacienteId: "p-008",
    nombre: "Camila Bautista",
    tutorNombre: "Esteban Bautista",
    telefono: "+506 7612-8472",
    prioridad: "baja",
    estado: "pendiente",
    source: "manual",
    servicioNombre: "Colonoscopía pediátrica",
    motivo: "Pidió mover la colonoscopía a un viernes por disponibilidad familiar.",
    tieneConversacion: false,
    noLeidos: 0,
    agregadoPor: "Recepción",
    fecha: agoDay(1),
  },
  {
    id: "le-005",
    pacienteId: "p-002",
    nombre: "Lucía Reyes",
    tutorNombre: "Iván Reyes",
    telefono: "+506 7118-2247",
    prioridad: "sin_triar",
    estado: "pendiente",
    source: "bot",
    servicioNombre: "Consulta de nutrición infantil",
    motivo: "Consulta de seguimiento nutricional; busca un cupo antes.",
    tieneConversacion: true,
    noLeidos: 0,
    agregadoPor: "Gastrito",
    fecha: agoDay(2),
  },
];
