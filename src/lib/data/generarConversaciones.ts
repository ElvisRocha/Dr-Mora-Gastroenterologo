import { agoMin } from "./time";
import { pacientesMock, formatearEdad } from "@/lib/mock";
import type {
  CanalChat,
  CategoriaTablero,
  ConversacionMock,
  ConversacionModo,
  EventoMock,
  EventoTipo,
  MensajeAutor,
  MensajeMock,
} from "./conversaciones";

// ===========================================================================
// Generador determinista de conversaciones para "poblar" la bandeja del
// consultorio Gastro Kids. Produce contactos (tutores), sus mensajes y los
// eventos de agenda asociados. Sin backend: se combina con el seed en el store.
// El contacto es SIEMPRE el tutor; el paciente es el niño/a. Bot = "Gastrito".
// ===========================================================================

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rnd: () => number, arr: T[]): T =>
  arr[Math.floor(rnd() * arr.length)];

const NOMBRES_M = [
  "Santiago", "Mateo", "Sebastián", "Matías", "Diego", "Samuel", "Emiliano",
  "Daniel", "Gabriel", "Joaquín", "Isaac", "Thiago", "Dylan", "Ian", "Alonso",
  "Bruno", "Iker", "Josué", "Adrián", "Andrés", "Tomás", "Benjamín", "Facundo",
  "Julián", "Lucas", "Damián", "Rodrigo", "Esteban", "Emmanuel", "Fabián",
];
const NOMBRES_F = [
  "Sofía", "Valentina", "Isabella", "Camila", "Mariana", "Luciana", "Emma",
  "Victoria", "Renata", "Antonella", "Fernanda", "Daniela", "Gabriela", "Regina",
  "Ximena", "Alison", "Melany", "Ashley", "Keylin", "Nicole", "Andrea", "Sara",
  "María José", "Amanda", "Abril", "Elena", "Julieta", "Martina", "Catalina",
  "Emilia",
];
const TUTOR_M = ["José", "Carlos", "Luis", "Roberto", "Marco", "Randall", "Álvaro", "Gerardo", "Manuel", "Óscar", "Fabio", "William", "Jorge", "Mauricio", "Rónald"];
const TUTOR_F = ["María", "Ana", "Laura", "Carolina", "Marcela", "Patricia", "Karla", "Silvia", "Vanessa", "Yorleny", "Gabriela", "Adriana", "Natalia", "Jessica", "Priscilla"];
const APELLIDOS = [
  "Rodríguez", "Jiménez", "Vargas", "Solís", "Rojas", "Araya", "Ramírez", "Mora",
  "Chaves", "Hernández", "Castro", "Alvarado", "Fernández", "González", "Hidalgo",
  "Villalobos", "Salas", "Zúñiga", "Gómez", "Cordero", "Solano", "Quesada", "Vega",
  "Camacho", "Brenes", "Segura", "Arias", "Bolaños", "Campos", "Chacón", "Espinoza",
  "Guzmán", "Madrigal", "Montero", "Navarro", "Picado", "Sánchez", "Ureña", "Zamora",
];

const SERVICIOS = [
  "Consulta de gastroenterología pediátrica",
  "Seguimiento de patología crónica",
  "Endoscopía digestiva alta",
  "Colonoscopía pediátrica",
  "pH-metría de 24 horas",
  "Manometría anorrectal",
  "Prueba de aliento",
  "Consulta de nutrición infantil",
];

const SINTOMAS = [
  "estreñimiento desde hace semanas",
  "reflujo y mucho llanto al comer",
  "dolor de panza recurrente",
  "diarrea que no se le quita",
  "vómitos frecuentes",
  "sangre en las heces",
  "poca ganancia de peso",
  "distensión abdominal y gases",
  "náuseas después de comer",
  "rechazo a los alimentos",
];

const STAFF = ["Recepción", "Dr. Mora"];

function telefonoCR(rnd: () => number): string {
  const first = [6, 7, 8][Math.floor(rnd() * 3)];
  let rest = "";
  for (let i = 0; i < 7; i++) rest += Math.floor(rnd() * 10);
  return `+506 ${first}${rest.slice(0, 3)}-${rest.slice(3)}`;
}

function canalDe(rnd: () => number): CanalChat {
  // Por ahora solo dos canales: WhatsApp (mayoría) y el sitio web.
  return rnd() < 0.78 ? "whatsapp" : "web";
}

function categoriaDe(rnd: () => number): CategoriaTablero {
  const r = rnd();
  if (r < 0.22) return "leads";
  if (r < 0.42) return "agendadas";
  if (r < 0.6) return "confirmadas";
  if (r < 0.7) return "pendiente_confirmar";
  if (r < 0.9) return "completadas";
  return "canceladas";
}

const CITA_FECHA = ["mañana", "en 2 días", "en 3 días", "el jueves", "la próxima semana"];

type MsgSpec = { autor: MensajeAutor; texto: string; autorNombre?: string; extra?: Partial<MensajeMock> };

// Construye el guion de mensajes según la etapa del embudo.
function guion(
  rnd: () => number,
  cat: CategoriaTablero,
  child: string,
  tutorFirst: string,
  servicio: string,
): MsgSpec[] {
  const sintoma = pick(rnd, SINTOMAS);
  switch (cat) {
    case "leads":
      return [
        { autor: "tutor", texto: `Hola, buenas 😊 Mi hijo/a tiene ${sintoma}` },
        { autor: "tutor", texto: `¿El Dr. Mora podría valorar a ${child}?` },
        {
          autor: "bot",
          texto: `¡Hola ${tutorFirst}! Soy Gastrito, asistente del Dr. Alfredo Mora 🩺 Con gusto valoramos a ${child}. ¿Te gustaría agendar una primera consulta de gastroenterología pediátrica?`,
        },
      ];
    case "agendadas":
      return [
        { autor: "tutor", texto: `Quisiera agendar una cita para ${child}` },
        {
          autor: "bot",
          texto: `¡Perfecto ${tutorFirst}! Agendé la ${servicio.toLowerCase()} para ${child}. Te enviaré un recordatorio un día antes 🗓️`,
        },
        { autor: "tutor", texto: "¡Gracias! 🙏" },
      ];
    case "confirmadas":
      return [
        {
          autor: "bot",
          texto: `Hola ${tutorFirst}, recordatorio de la ${servicio.toLowerCase()} de ${child}. ¿Confirmas la asistencia?`,
        },
        { autor: "tutor", texto: "Sí, confirmo. Ahí estaremos 👍" },
        { autor: "bot", texto: "¡Gracias! Registré tu confirmación ✅ Nos vemos pronto 😊" },
      ];
    case "pendiente_confirmar":
      return [
        {
          autor: "bot",
          texto: `Hola ${tutorFirst} 👋 ${child} tiene ${servicio.toLowerCase()} mañana. Por favor confírmame si podrán asistir.`,
        },
        ...(rnd() < 0.5
          ? [{ autor: "tutor" as MensajeAutor, texto: "Déjame confirmar con mi esposo y le aviso" }]
          : []),
      ];
    case "completadas":
      return rnd() < 0.5
        ? [
            { autor: "tutor", texto: `¿Ya están los resultados de ${child}?`, extra: { solicitaDocumento: true } },
            {
              autor: "staff",
              autorNombre: "Recepción",
              texto: `Hola ${tutorFirst}, los resultados se entregaron en la consulta. Si necesitas una copia digital te la reenvío 📄`,
            },
            { autor: "tutor", texto: "Perfecto, muchas gracias 💚" },
          ]
        : [
            { autor: "tutor", texto: `Gracias por atender a ${child} hoy, todo muy claro` },
            { autor: "bot", texto: `¡Con gusto ${tutorFirst}! Cualquier duda con las indicaciones, aquí estoy 😊` },
          ];
    case "canceladas":
      return [
        { autor: "tutor", texto: `Necesito cancelar la cita de ${child}, nos surgió un imprevisto` },
        {
          autor: "bot",
          texto: `Entiendo, ${tutorFirst}. Cancelé la ${servicio.toLowerCase()}. Cuando gustes reagendar, aquí estoy para ayudarte 🗓️`,
        },
        ...(rnd() < 0.4
          ? [{ autor: "tutor" as MensajeAutor, texto: "Gracias, reagendo la próxima semana" }]
          : []),
      ];
  }
}

function eventoDe(cat: CategoriaTablero): EventoTipo | null {
  switch (cat) {
    case "agendadas":
      return "cita_agendada";
    case "confirmadas":
      return "cita_confirmada";
    case "pendiente_confirmar":
      return "recordatorio_24h";
    case "completadas":
      return "cita_completada";
    case "canceladas":
      return "cita_cancelada";
    default:
      return null;
  }
}

export type ConversacionesGeneradas = {
  conversaciones: ConversacionMock[];
  mensajes: MensajeMock[];
  eventos: EventoMock[];
};

export function generarConversaciones(count = 140): ConversacionesGeneradas {
  const conversaciones: ConversacionMock[] = [];
  const mensajes: MensajeMock[] = [];
  const eventos: EventoMock[] = [];

  // Pacientes generados (con expediente) para vincular a los contactos que ya
  // son pacientes del consultorio.
  const conExpediente = pacientesMock.filter((p) => p.id.startsWith("pg-"));

  for (let i = 0; i < count; i++) {
    const rnd = mulberry32(0x9e3779b1 + i * 2654435761);
    const cat = categoriaDe(rnd);
    const canal = canalDe(rnd);
    const servicio = pick(rnd, SERVICIOS);
    const modo: ConversacionModo = rnd() < 0.78 ? "bot" : "humano";

    // Los leads no tienen expediente; el resto suele ser paciente registrado.
    const vincular = cat !== "leads" && rnd() < 0.72 && conExpediente.length > 0;
    let contactoNombre: string;
    let telefono: string;
    let pacienteId: string | undefined;
    let pacienteNombre: string | undefined;
    let child: string;
    let tutorFirst: string;

    if (vincular) {
      const p = conExpediente[Math.floor(rnd() * conExpediente.length)];
      contactoNombre = p.tutorPrincipal;
      tutorFirst = p.tutorPrincipal.split(/\s+/)[0];
      telefono = p.telefonoTutor;
      pacienteId = p.id;
      pacienteNombre = `${p.nombre} (${formatearEdad(p.fechaNacimiento)})`;
      child = p.nombre;
    } else {
      const femTutor = rnd() < 0.62;
      tutorFirst = pick(rnd, femTutor ? TUTOR_F : TUTOR_M);
      const apellido = pick(rnd, APELLIDOS);
      contactoNombre = `${tutorFirst} ${apellido}`;
      telefono = telefonoCR(rnd);
      const nino = pick(rnd, rnd() < 0.5 ? NOMBRES_M : NOMBRES_F);
      const edad = 1 + Math.floor(rnd() * 15);
      const meses = Math.floor(rnd() * 11) + 1;
      pacienteNombre =
        edad <= 1 ? `${nino} (${meses} meses)` : `${nino} (${edad} años)`;
      child = nino;
    }

    const id = `cvg-${String(i + 1).padStart(3, "0")}`;

    // Antigüedad del último mensaje: repartida en ~30 días, sesgada a reciente.
    const baseMin = Math.floor(Math.pow(rnd(), 1.8) * 60 * 24 * 30) + 3;

    const spec = guion(rnd, cat, child, tutorFirst, servicio);
    // Reparte los mensajes hacia atrás desde baseMin (últimos primero).
    let acc = baseMin;
    const gaps: number[] = [];
    for (let k = spec.length - 1; k >= 0; k--) {
      gaps[k] = acc;
      acc += 3 + Math.floor(rnd() * 90); // 3–93 min entre mensajes
    }

    spec.forEach((s, k) => {
      mensajes.push({
        id: `${id}-m${k}`,
        conversacionId: id,
        direccion: s.autor === "tutor" ? "entrante" : "saliente",
        autor: s.autor,
        autorNombre: s.autorNombre,
        texto: s.texto,
        fecha: agoMin(gaps[k]),
        ...s.extra,
      });
    });

    const last = spec[spec.length - 1];
    const esperandoRespuesta = last.autor === "tutor";
    const noLeidos = esperandoRespuesta ? 1 + Math.floor(rnd() * 3) : 0;

    conversaciones.push({
      id,
      canal,
      telefono,
      contactoNombre,
      pacienteId,
      pacienteNombre,
      categoria: cat,
      modo,
      noLeidos,
      citaRef: cat === "leads" ? undefined : `GK-${10000 + i}`,
      servicioNombre: cat === "leads" ? undefined : servicio,
      citaFecha:
        cat === "confirmadas" || cat === "pendiente_confirmar"
          ? cat === "pendiente_confirmar"
            ? "mañana"
            : pick(rnd, CITA_FECHA)
          : undefined,
    });

    // Evento de agenda asociado (para la línea de tiempo del hilo).
    const evTipo = eventoDe(cat);
    if (evTipo) {
      eventos.push({
        id: `${id}-e0`,
        conversacionId: id,
        tipo: evTipo,
        fecha: agoMin(baseMin + 60 + Math.floor(rnd() * 60 * 24)),
        actor: evTipo === "cita_confirmada" ? "tutor" : "bot",
        descripcion: servicio,
        actorNombre: evTipo === "cita_completada" ? pick(rnd, STAFF) : undefined,
      });
    }
  }

  return { conversaciones, mensajes, eventos };
}
