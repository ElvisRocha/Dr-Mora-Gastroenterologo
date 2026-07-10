import { agoMin, agoHr, agoDay } from "./time";

// ===========================================================================
// Conversaciones — bandeja tipo WhatsApp del consultorio Gastro Kids.
// El contacto es SIEMPRE el tutor/padre/madre; el paciente es el niño/a.
// El asistente virtual del consultorio se llama "Gastrito".
// Sin backend: la data vive en memoria + localStorage (ver clinicStore).
// ===========================================================================

export const ASISTENTE_NOMBRE = "Gastrito";

export type CanalChat = "whatsapp" | "instagram" | "facebook";

/** Quién emite el mensaje: el tutor (entrante), el bot Gastrito o el staff. */
export type MensajeAutor = "tutor" | "bot" | "staff";
export type MensajeDireccion = "entrante" | "saliente";
export type MensajeMediaTipo = "imagen" | "audio" | "documento";

export type MensajeMock = {
  id: string;
  conversacionId: string;
  direccion: MensajeDireccion;
  autor: MensajeAutor;
  /** Nombre visible del staff cuando autor === "staff". */
  autorNombre?: string;
  texto: string;
  fecha: string; // ISO
  media?: { tipo: MensajeMediaTipo; nombre?: string; url?: string };
  /** El tutor pidió que se le envíe un documento (receta, orden, etc.). */
  solicitaDocumento?: boolean;
  /** El tutor envió un archivo/imagen que requiere revisión del doctor. */
  requiereRevision?: boolean;
  /** El staff ya atendió la solicitud/archivo destacado. */
  atendido?: boolean;
};

export type EventoTipo =
  | "cita_agendada"
  | "cita_reagendada"
  | "cita_confirmada"
  | "cita_cancelada"
  | "cita_completada"
  | "cita_no_asistio"
  | "formulario_primera_vez"
  | "recordatorio_24h";

export type EventoMock = {
  id: string;
  conversacionId: string;
  tipo: EventoTipo;
  descripcion?: string;
  fecha: string; // ISO
  actor: "tutor" | "bot" | "staff";
  actorNombre?: string;
};

/** Columnas del tablero (kanban por estado del embudo de agenda). */
export type CategoriaTablero =
  | "leads"
  | "agendadas"
  | "confirmadas"
  | "pendiente_confirmar"
  | "completadas"
  | "canceladas";

export type ConversacionModo = "bot" | "humano";

export type ConversacionMock = {
  id: string;
  canal: CanalChat;
  telefono: string;
  /** Nombre del tutor (contacto). */
  contactoNombre: string;
  /** Paciente (niño/a) vinculado, si existe expediente. */
  pacienteId?: string;
  /** Nombre del paciente cuando NO hay expediente (lead). */
  pacienteNombre?: string;
  categoria: CategoriaTablero;
  modo: ConversacionModo;
  anclado?: boolean;
  noLeidos: number;
  citaRef?: string;
  servicioNombre?: string;
  citaFecha?: string;
};

// ---------------------------------------------------------------------------
// Etiquetas y tono
// ---------------------------------------------------------------------------

export const EVENTO_LABEL: Record<EventoTipo, string> = {
  cita_agendada: "Cita agendada",
  cita_reagendada: "Cita reagendada",
  cita_confirmada: "Cita confirmada",
  cita_cancelada: "Cita cancelada",
  cita_completada: "Consulta completada",
  cita_no_asistio: "No asistió",
  formulario_primera_vez: "Formulario de primera vez",
  recordatorio_24h: "Recordatorio enviado",
};

export type EventoTono = "success" | "danger" | "info" | "neutral";

export function eventoTono(tipo: EventoTipo): EventoTono {
  switch (tipo) {
    case "cita_agendada":
    case "cita_confirmada":
    case "cita_completada":
    case "formulario_primera_vez":
      return "success";
    case "cita_cancelada":
    case "cita_no_asistio":
      return "danger";
    case "cita_reagendada":
      return "info";
    default:
      return "neutral";
  }
}

export const CATEGORIAS_TABLERO: {
  key: CategoriaTablero;
  label: string;
  descripcion: string;
  tono: "navy" | "leaf" | "teal" | "amber" | "coral" | "neutral";
}[] = [
  { key: "leads", label: "Leads", descripcion: "Consultaron info · sin cita", tono: "navy" },
  { key: "agendadas", label: "Agendadas", descripcion: "Cita reservada", tono: "teal" },
  { key: "confirmadas", label: "Confirmadas", descripcion: "Confirmaron asistencia", tono: "leaf" },
  { key: "pendiente_confirmar", label: "Por confirmar", descripcion: "Cita mañana · sin confirmar", tono: "amber" },
  { key: "completadas", label: "Completadas", descripcion: "Consulta atendida", tono: "neutral" },
  { key: "canceladas", label: "Canceladas", descripcion: "Cancelaron la cita", tono: "coral" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatTelefono(tel: string): string {
  const d = tel.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("52")) {
    return `+52 ${d.slice(2, 4)} ${d.slice(4, 8)} ${d.slice(8)}`;
  }
  return tel;
}

export type TimelineItem =
  | { kind: "mensaje"; key: string; at: number; data: MensajeMock }
  | { kind: "evento"; key: string; at: number; data: EventoMock };

export function buildTimeline(
  mensajes: MensajeMock[],
  eventos: EventoMock[],
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...mensajes.map((m) => ({
      kind: "mensaje" as const,
      key: `m-${m.id}`,
      at: +new Date(m.fecha),
      data: m,
    })),
    ...eventos.map((e) => ({
      kind: "evento" as const,
      key: `e-${e.id}`,
      at: +new Date(e.fecha),
      data: e,
    })),
  ];
  return items.sort((a, b) => a.at - b.at || a.key.localeCompare(b.key));
}

// ===========================================================================
// SEED
// ===========================================================================

export const conversacionesSeed: ConversacionMock[] = [
  {
    id: "cv-001",
    canal: "whatsapp",
    telefono: "+506 8729-1834",
    contactoNombre: "Marisol Aguirre",
    pacienteId: "p-001",
    categoria: "confirmadas",
    modo: "bot",
    anclado: true,
    noLeidos: 2,
    citaRef: "GK-10428",
    servicioNombre: "Seguimiento de patología crónica",
    citaFecha: "mañana",
  },
  {
    id: "cv-002",
    canal: "whatsapp",
    telefono: "+506 7118-2247",
    contactoNombre: "Iván Reyes",
    pacienteId: "p-002",
    categoria: "agendadas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10431",
    servicioNombre: "Consulta de nutrición infantil",
  },
  {
    id: "cv-003",
    canal: "whatsapp",
    telefono: "+506 6472-9136",
    contactoNombre: "Patricia Krauss",
    pacienteId: "p-003",
    categoria: "pendiente_confirmar",
    modo: "humano",
    noLeidos: 1,
    citaRef: "GK-10402",
    servicioNombre: "Endoscopía digestiva alta",
    citaFecha: "mañana",
  },
  {
    id: "cv-004",
    canal: "instagram",
    telefono: "+506 8984-5510",
    contactoNombre: "Gabriela Fuentes",
    pacienteNombre: "Emma (2 años)",
    categoria: "leads",
    modo: "bot",
    noLeidos: 3,
  },
  {
    id: "cv-005",
    canal: "whatsapp",
    telefono: "+506 7194-8472",
    contactoNombre: "Roberto Solórzano",
    pacienteId: "p-004",
    categoria: "confirmadas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10440",
    servicioNombre: "Consulta de nutrición infantil",
    citaFecha: "en 3 días",
  },
  {
    id: "cv-006",
    canal: "whatsapp",
    telefono: "+506 7612-8472",
    contactoNombre: "Esteban Bautista",
    pacienteId: "p-008",
    categoria: "agendadas",
    modo: "bot",
    noLeidos: 1,
    citaRef: "GK-10419",
    servicioNombre: "Colonoscopía pediátrica",
  },
  {
    id: "cv-007",
    canal: "whatsapp",
    telefono: "+506 8712-3390",
    contactoNombre: "Lorena Cepeda",
    pacienteNombre: "Diego (7 años)",
    categoria: "leads",
    modo: "humano",
    noLeidos: 1,
  },
  {
    id: "cv-008",
    canal: "whatsapp",
    telefono: "+506 7183-4729",
    contactoNombre: "Mariana Rincón",
    pacienteId: "p-007",
    categoria: "canceladas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10388",
    servicioNombre: "Prueba de aliento",
  },
  {
    id: "cv-009",
    canal: "whatsapp",
    telefono: "+506 8384-1928",
    contactoNombre: "Andrea Villalpando",
    pacienteId: "p-005",
    categoria: "completadas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10360",
    servicioNombre: "Manometría anorrectal",
  },
  {
    id: "cv-010",
    canal: "facebook",
    telefono: "+506 6540-1177",
    contactoNombre: "Paola Nieto",
    pacienteNombre: "Sebastián (5 meses)",
    categoria: "leads",
    modo: "bot",
    noLeidos: 2,
  },
  {
    id: "cv-011",
    canal: "whatsapp",
    telefono: "+506 7118-9472",
    contactoNombre: "Lucía Olvera",
    pacienteId: "p-012",
    categoria: "agendadas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10444",
    servicioNombre: "pH-metría de 24 horas",
  },
  {
    id: "cv-012",
    canal: "whatsapp",
    telefono: "+506 6472-1928",
    contactoNombre: "Verónica Santos",
    pacienteId: "p-009",
    categoria: "confirmadas",
    modo: "bot",
    noLeidos: 0,
    citaRef: "GK-10447",
    servicioNombre: "Consulta de gastroenterología pediátrica",
    citaFecha: "en 2 días",
  },
];

const M = (
  id: string,
  conversacionId: string,
  autor: MensajeAutor,
  texto: string,
  fecha: string,
  extra: Partial<MensajeMock> = {},
): MensajeMock => ({
  id,
  conversacionId,
  direccion: autor === "tutor" ? "entrante" : "saliente",
  autor,
  texto,
  fecha,
  ...extra,
});

export const mensajesSeed: MensajeMock[] = [
  // cv-001 — Marisol / Tomás (ERGE + APLV, confirmada)
  M("m-001", "cv-001", "tutor", "Hola, buenas tardes 😊", agoHr(5)),
  M("m-002", "cv-001", "bot", "¡Hola Marisol! Soy Gastrito, el asistente virtual del Dr. Alfredo Mora 🩺 ¿En qué puedo ayudarte con Tomás?", agoHr(5)),
  M("m-003", "cv-001", "tutor", "Quería confirmar la cita de seguimiento de mañana", agoHr(5)),
  M("m-004", "cv-001", "bot", "¡Perfecto! Tienes agendada una consulta de seguimiento mañana a las 10:00 a.m. ¿Confirmo tu asistencia?", agoHr(5)),
  M("m-005", "cv-001", "tutor", "Sí, ahí estaremos. Una pregunta, ¿le sigo dando el omeprazol antes de la cita?", agoHr(2)),
  M("m-006", "cv-001", "tutor", "Es que ayer regurgitó más de lo normal 😟", agoMin(118), { requiereRevision: false }),
  M("m-007", "cv-001", "bot", "Registré tu confirmación ✅ Sobre el medicamento, mantén la dosis habitual hasta la consulta. El Dr. Mora revisará el ajuste mañana.", agoMin(115)),

  // cv-002 — Iván / Lucía (celiaquía, nutrición)
  M("m-010", "cv-002", "tutor", "Buenos días, necesito la orden para los laboratorios de Lucía", agoHr(26), { solicitaDocumento: true }),
  M("m-011", "cv-002", "bot", "¡Claro! Le aviso a recepción para que te comparta la orden de laboratorio de Lucía. En un momento te la envían por aquí 📄", agoHr(26)),
  M("m-012", "cv-002", "staff", "Hola Iván, aquí está la orden para el panel celíaco y biometría. Puedes acudir en ayuno de 8 horas.", agoHr(25), { autorNombre: "Recepción", media: { tipo: "documento", nombre: "orden-laboratorio-lucia.pdf" } }),
  M("m-013", "cv-002", "tutor", "¡Muchas gracias! 🙏", agoHr(24)),

  // cv-003 — Patricia / Daniel (Crohn, endoscopía, humano/por confirmar)
  M("m-020", "cv-003", "tutor", "Doctor, Daniel amaneció con más dolor abdominal y una evacuación con sangre", agoHr(4), { requiereRevision: true }),
  M("m-021", "cv-003", "tutor", "Le tomé una foto, ¿se la puedo enviar?", agoHr(4)),
  M("m-022", "cv-003", "bot", "Lamento escuchar eso. Sí, puedes enviar la imagen por este medio y el Dr. Mora la revisará. También tienes la endoscopía programada para mañana.", agoHr(4)),
  M("m-023", "cv-003", "tutor", "", agoMin(200), { media: { tipo: "imagen", nombre: "foto-daniel.jpg" }, requiereRevision: true }),
  M("m-024", "cv-003", "staff", "Patricia, soy el Dr. Mora. Recibí la imagen. Mantén a Daniel en ayuno para la endoscopía de mañana y suspende la mesalazina de la noche. Nos vemos temprano.", agoMin(60), { autorNombre: "Dr. Mora" }),

  // cv-004 — Gabriela / Emma (lead Instagram)
  M("m-030", "cv-004", "tutor", "Hola! Vi su página. Mi hija de 2 años tiene mucho estreñimiento", agoHr(3)),
  M("m-031", "cv-004", "tutor", "¿El Dr. Mora atiende niños tan pequeños?", agoHr(3)),
  M("m-032", "cv-004", "bot", "¡Hola Gabriela! Sí, el Dr. Mora atiende pacientes de 0 a 21 años 👶 El estreñimiento en niños pequeños es muy tratable. ¿Te gustaría agendar una primera consulta de gastroenterología pediátrica?", agoHr(3)),
  M("m-033", "cv-004", "tutor", "Sí me interesa. ¿Qué costo tiene y qué días hay?", agoMin(140)),

  // cv-005 — Roberto / Sofía (APLV, nutrición confirmada)
  M("m-040", "cv-005", "tutor", "Confirmo la consulta de nutrición de Sofía 👍", agoDay(1)),
  M("m-041", "cv-005", "bot", "¡Gracias Roberto! Confirmada la consulta de nutrición infantil. Recuerda traer el registro alimentario de los últimos 7 días 🥕", agoDay(1)),
  M("m-042", "cv-005", "tutor", "Perfecto, ya lo tengo listo", agoHr(20)),

  // cv-006 — Esteban / Camila (colitis, colonoscopía)
  M("m-050", "cv-006", "tutor", "Buenas, ¿qué preparación necesita Camila para la colonoscopía?", agoHr(8), { solicitaDocumento: true }),
  M("m-051", "cv-006", "bot", "Te comparto las indicaciones de preparación intestinal y el ayuno requerido. Recepción te enviará el instructivo detallado en PDF 📋", agoHr(8)),
  M("m-052", "cv-006", "tutor", "Gracias, quedo pendiente", agoHr(7)),

  // cv-007 — Lorena / Diego (lead, humano)
  M("m-060", "cv-007", "tutor", "Hola, mi hijo de 7 años tiene dolor de panza recurrente desde hace meses", agoHr(6)),
  M("m-061", "cv-007", "tutor", "Ya lo vio el pediatra pero no encuentran la causa. ¿Podrían valorarlo?", agoHr(6)),
  M("m-062", "cv-007", "staff", "Hola Lorena, con gusto. El dolor abdominal recurrente es de lo que más valoramos. ¿Te parece si agendamos una primera consulta? Te comento horarios disponibles.", agoHr(5), { autorNombre: "Recepción" }),
  M("m-063", "cv-007", "tutor", "Sí por favor 🙏", agoMin(90)),

  // cv-008 — Mariana / Joaquín (cancelada)
  M("m-070", "cv-008", "tutor", "Necesito cancelar la prueba de aliento de Joaquín, nos surgió un imprevisto", agoDay(2)),
  M("m-071", "cv-008", "bot", "Entiendo, Mariana. Cancelé la prueba de aliento. Cuando gustes reagendar, aquí estoy para ayudarte 🗓️", agoDay(2)),
  M("m-072", "cv-008", "tutor", "Gracias, la próxima semana reagendo", agoDay(2)),

  // cv-009 — Andrea / Mateo (manometría completada)
  M("m-080", "cv-009", "tutor", "¿Ya están los resultados de la manometría de Mateo?", agoDay(3), { solicitaDocumento: true }),
  M("m-081", "cv-009", "bot", "Los resultados fueron entregados en tu última consulta. Si necesitas una copia digital, con gusto recepción te la reenvía 📄", agoDay(3)),
  M("m-082", "cv-009", "tutor", "Perfecto, muchas gracias por todo el seguimiento 💚", agoDay(3)),

  // cv-010 — Paola / Sebastián (lead Facebook, lactante)
  M("m-090", "cv-010", "tutor", "Buenas noches, mi bebé de 5 meses regresa mucha leche y llora al comer", agoHr(14)),
  M("m-091", "cv-010", "tutor", "¿Eso es reflujo? Estoy muy preocupada", agoHr(14)),
  M("m-092", "cv-010", "bot", "Hola Paola, entiendo tu preocupación 💙 Esos síntomas pueden corresponder a reflujo del lactante o a una alergia. El Dr. Mora puede valorarlo. ¿Agendamos una consulta de gastroenterología pediátrica?", agoHr(13)),

  // cv-011 — Lucía / Bruno (pH-metría agendada)
  M("m-100", "cv-011", "tutor", "Hola, agendé la pH-metría de Bruno. ¿Necesito hacer algo antes?", agoHr(30)),
  M("m-101", "cv-011", "bot", "¡Hola Lucía! Para la pH-metría de 24 horas se suspende el omeprazol 5 días antes. Recepción te dará las indicaciones completas. ¿Confirmo tu cita?", agoHr(30)),
  M("m-102", "cv-011", "tutor", "Sí, confirmo. Gracias", agoHr(29)),

  // cv-012 — Verónica / Iker (consulta confirmada)
  M("m-110", "cv-012", "tutor", "Confirmo la consulta de Iker 👶", agoHr(10)),
  M("m-111", "cv-012", "bot", "¡Gracias Verónica! Confirmada la consulta de gastroenterología pediátrica para Iker. Nos vemos pronto 😊", agoHr(10)),
];

const E = (
  id: string,
  conversacionId: string,
  tipo: EventoTipo,
  fecha: string,
  actor: EventoMock["actor"],
  descripcion?: string,
  actorNombre?: string,
): EventoMock => ({ id, conversacionId, tipo, fecha, actor, descripcion, actorNombre });

export const eventosSeed: EventoMock[] = [
  E("ev-001", "cv-001", "cita_agendada", agoDay(6), "bot", "Seguimiento de patología crónica"),
  E("ev-002", "cv-001", "cita_confirmada", agoMin(115), "tutor", "Confirmó asistencia"),
  E("ev-010", "cv-002", "cita_agendada", agoDay(4), "bot", "Consulta de nutrición infantil"),
  E("ev-020", "cv-003", "cita_agendada", agoDay(9), "tutor", "Endoscopía digestiva alta"),
  E("ev-021", "cv-003", "recordatorio_24h", agoHr(20), "bot", "Recordatorio de cita mañana"),
  E("ev-030", "cv-004", "formulario_primera_vez", agoMin(139), "tutor", "Completó datos de contacto"),
  E("ev-040", "cv-005", "cita_agendada", agoDay(5), "bot", "Consulta de nutrición infantil"),
  E("ev-041", "cv-005", "cita_confirmada", agoDay(1), "tutor", "Confirmó asistencia"),
  E("ev-050", "cv-006", "cita_agendada", agoDay(3), "bot", "Colonoscopía pediátrica"),
  E("ev-070", "cv-008", "cita_agendada", agoDay(8), "bot", "Prueba de aliento"),
  E("ev-071", "cv-008", "cita_cancelada", agoDay(2), "tutor", "Canceló por imprevisto"),
  E("ev-080", "cv-009", "cita_agendada", agoDay(12), "bot", "Manometría anorrectal"),
  E("ev-081", "cv-009", "cita_completada", agoDay(3), "staff", "Consulta atendida", "Dr. Mora"),
  E("ev-100", "cv-011", "cita_agendada", agoHr(30), "tutor", "pH-metría de 24 horas"),
  E("ev-110", "cv-012", "cita_agendada", agoDay(2), "bot", "Consulta de gastroenterología pediátrica"),
  E("ev-111", "cv-012", "cita_confirmada", agoHr(10), "tutor", "Confirmó asistencia"),
];
