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

export const listaEsperaSeed: ListaEsperaMock[] = [
  {
    id: "le-001",
    nombre: "Emma Fuentes",
    tutorNombre: "Gabriela Fuentes",
    telefono: "+52 55 2984 5510",
    email: "gaby.fuentes@correo.mx",
    prioridad: "media",
    estado: "pendiente",
    source: "bot",
    servicioNombre: "Consulta de gastroenterología pediátrica",
    motivo: "Estreñimiento funcional desde hace 3 meses, 2 años de edad.",
    tieneConversacion: true,
    noLeidos: 3,
    agregadoPor: "Gastrito",
    fecha: agoHr(3),
  },
  {
    id: "le-002",
    nombre: "Diego Cepeda",
    tutorNombre: "Lorena Cepeda",
    telefono: "+52 55 7712 3390",
    prioridad: "alta",
    estado: "pendiente",
    source: "manual",
    servicioNombre: "Consulta de gastroenterología pediátrica",
    motivo: "Dolor abdominal recurrente hace meses, sin diagnóstico. 7 años.",
    tieneConversacion: true,
    noLeidos: 1,
    agregadoPor: "Recepción",
    fecha: agoHr(5),
  },
  {
    id: "le-003",
    nombre: "Sebastián Nieto",
    tutorNombre: "Paola Nieto",
    telefono: "+52 55 5540 1177",
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
    nombre: "Regina Ávalos",
    tutorNombre: "Claudia Ávalos",
    telefono: "+52 55 3388 2091",
    email: "claudia.avalos@correo.mx",
    prioridad: "baja",
    estado: "pendiente",
    source: "manual",
    servicioNombre: "Consulta de nutrición infantil",
    motivo: "Selectividad alimentaria, bajo peso. 4 años.",
    tieneConversacion: false,
    noLeidos: 0,
    agregadoPor: "Recepción",
    fecha: agoDay(1),
  },
  {
    id: "le-005",
    nombre: "Matías Fonseca",
    tutorNombre: "Ricardo Fonseca",
    telefono: "+52 55 8890 4412",
    prioridad: "sin_triar",
    estado: "pendiente",
    source: "bot",
    servicioNombre: "Prueba de aliento",
    motivo: "Sospecha de intolerancia a la lactosa. 9 años.",
    tieneConversacion: true,
    noLeidos: 0,
    agregadoPor: "Gastrito",
    fecha: agoDay(2),
  },
];
