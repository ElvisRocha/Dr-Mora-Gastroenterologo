import { agoMin, agoHr } from "./time";

// Notificaciones para la campana del panel admin.

export type NotificacionTipo =
  | "cita_cancelada"
  | "cita_agendada"
  | "mensaje_nuevo"
  | "lista_espera"
  | "documento_solicitado"
  | "recordatorio";

export type NotificacionMock = {
  id: string;
  tipo: NotificacionTipo;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: string; // ISO
  /** Deep-link a conversación (teléfono) o vista. */
  telefono?: string;
  vista?: "conversaciones" | "lista-espera" | "calendario";
  pacienteId?: string;
  /** Datos del cupo liberado (para reasignar desde lista de espera). */
  citaCanceladaFecha?: string;
  servicioNombre?: string;
};

export const notificacionesSeed: NotificacionMock[] = [
  {
    id: "n-001",
    tipo: "cita_cancelada",
    titulo: "Cita cancelada",
    mensaje:
      "Mariana Rincón canceló la prueba de aliento de Joaquín. El cupo quedó libre — puedes reasignarlo desde la lista de espera.",
    leida: false,
    fecha: agoMin(18),
    vista: "lista-espera",
    citaCanceladaFecha: "en 5 días · 10:00 a.m.",
    servicioNombre: "Prueba de aliento",
    telefono: "+52 55 9183 4729",
  },
  {
    id: "n-002",
    tipo: "documento_solicitado",
    titulo: "Documento solicitado",
    mensaje:
      "Iván Reyes solicitó la orden de laboratorio de Lucía por WhatsApp.",
    leida: false,
    fecha: agoMin(42),
    telefono: "+52 55 6118 2247",
    vista: "conversaciones",
    pacienteId: "p-002",
  },
  {
    id: "n-003",
    tipo: "mensaje_nuevo",
    titulo: "Mensaje nuevo",
    mensaje:
      "Patricia Krauss envió una imagen de Daniel que requiere revisión del doctor.",
    leida: false,
    fecha: agoHr(3),
    telefono: "+52 55 8472 9136",
    vista: "conversaciones",
    pacienteId: "p-003",
  },
  {
    id: "n-004",
    tipo: "lista_espera",
    titulo: "Nuevo en lista de espera",
    mensaje:
      "Gabriela Fuentes solicitó una primera consulta para Emma (2 años) por estreñimiento.",
    leida: false,
    fecha: agoHr(3),
    vista: "lista-espera",
  },
  {
    id: "n-005",
    tipo: "cita_agendada",
    titulo: "Cita agendada",
    mensaje:
      "Verónica Santos agendó una consulta de gastroenterología para Iker.",
    leida: true,
    fecha: agoHr(10),
    telefono: "+52 55 8472 1928",
    vista: "calendario",
    pacienteId: "p-009",
  },
  {
    id: "n-006",
    tipo: "recordatorio",
    titulo: "Recordatorios enviados",
    mensaje:
      "Se enviaron 6 recordatorios de cita para mañana por WhatsApp.",
    leida: true,
    fecha: agoHr(12),
    vista: "calendario",
  },
];

export const NOTIF_TITULO: Record<NotificacionTipo, string> = {
  cita_cancelada: "Cita cancelada",
  cita_agendada: "Cita agendada",
  mensaje_nuevo: "Mensaje nuevo",
  lista_espera: "Lista de espera",
  documento_solicitado: "Documento solicitado",
  recordatorio: "Recordatorio",
};
