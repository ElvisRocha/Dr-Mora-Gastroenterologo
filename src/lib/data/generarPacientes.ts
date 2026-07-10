import type {
  PacienteMock,
  IdentificacionMock,
  TipoIdentificacion,
} from "@/lib/mock";

// ===========================================================================
// Generador determinista de pacientes pediátricos (Costa Rica).
// Data mock fresca (nombres/cédulas ficticios) para poblar el módulo de
// Pacientes con gran volumen. Anclado a 2026-07-10 como "presente".
// ===========================================================================

const NOW = new Date(2026, 6, 10);

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOMBRES_M = [
  "Santiago", "Mateo", "Sebastián", "Matías", "Diego", "Samuel", "Emiliano",
  "Daniel", "Gabriel", "Joaquín", "Isaac", "Thiago", "Dylan", "Ian", "Alonso",
  "Bruno", "Iker", "Emmanuel", "Ariel", "Fabián", "Josué", "Adrián", "Andrés",
  "David", "Óscar", "Luis", "Carlos", "Kevin", "Ángel", "Tomás", "Maximiliano",
  "Benjamín", "Facundo", "Julián", "Lucas", "Damián", "Rodrigo", "Esteban",
];
const NOMBRES_F = [
  "Sofía", "Valentina", "Isabella", "Camila", "Mariana", "Luciana", "Emma",
  "Victoria", "Renata", "Antonella", "Fernanda", "Daniela", "Gabriela", "Regina",
  "Ximena", "Alison", "Melany", "Génesis", "Ashley", "Dayana", "Keylin", "Nicole",
  "Andrea", "Paula", "Sara", "Fiorella", "María José", "Amanda", "Alison", "Abril",
  "Elena", "Julieta", "Martina", "Catalina", "Rafaela", "Emilia", "Constanza",
];
const APELLIDOS = [
  "Rodríguez", "Jiménez", "Vargas", "Solís", "Rojas", "Araya", "Ramírez", "Mora",
  "Chaves", "Hernández", "Castro", "Alvarado", "Fernández", "González", "Hidalgo",
  "Villalobos", "Salas", "Zúñiga", "Fallas", "Gómez", "Cordero", "Solano",
  "Quesada", "Vega", "Camacho", "Brenes", "Segura", "Arias", "Bolaños", "Campos",
  "Chacón", "Elizondo", "Espinoza", "Fonseca", "Guzmán", "Leiva", "Madrigal",
  "Montero", "Muñoz", "Navarro", "Obando", "Picado", "Sánchez", "Sandí", "Ureña",
  "Zamora", "Barrantes", "Céspedes", "Delgado", "Flores", "Gamboa", "Herrera",
  "Loaiza", "Méndez", "Porras", "Ramos", "Retana", "Torres", "Umaña", "Vindas",
];
const TUTOR_M = ["José", "Carlos", "Luis", "Roberto", "Marco", "Randall", "Álvaro", "Gerardo", "Manuel", "Óscar", "Fabio", "William", "Jorge", "Mauricio", "Rónald"];
const TUTOR_F = ["María", "Ana", "Laura", "Carolina", "Marcela", "Patricia", "Karla", "Silvia", "Vanessa", "Yorleny", "Gabriela", "Adriana", "Natalia", "Jessica", "Priscilla"];

const DIAGNOSTICOS = [
  ["ERGE del lactante"], ["APLV"], ["Celiaquía"], ["Estreñimiento funcional"],
  ["Estreñimiento crónico funcional"], ["Enfermedad de Crohn"], ["Colitis ulcerosa"],
  ["Intolerancia a la lactosa"], ["Dispepsia funcional"], ["Reflujo gastroesofágico"],
  ["Cólico del lactante"], ["EII en remisión"], ["Selectividad alimentaria"],
  ["Dolor abdominal funcional"], ["Gastritis"], ["Infección por H. pylori"],
  ["Esofagitis eosinofílica"], ["Giardiasis"], ["Diarrea crónica"],
  ["ERGE del lactante", "APLV"], ["APLV", "Estreñimiento funcional"],
  ["Reflujo gastroesofágico", "Cólico del lactante"], ["Celiaquía", "Anemia ferropénica"],
  ["Intolerancia a la lactosa", "Dispepsia funcional"], [],
];

const DOMINIOS = ["gmail.com", "hotmail.com", "outlook.com", "correo.com", "icloud.com"];
const PARENTESCOS = ["madre", "padre", "madre", "padre", "abuela", "tutora legal"];

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");

function cedulaCR(rnd: () => number): IdentificacionMock {
  const r = rnd();
  const tipo: TipoIdentificacion =
    r < 0.86 ? "cedula" : r < 0.95 ? "dimex" : "indocumentada";
  if (tipo === "cedula") {
    const prov = 1 + Math.floor(rnd() * 7);
    const a = String(100 + Math.floor(rnd() * 900));
    const b = String(1000 + Math.floor(rnd() * 9000));
    return { tipo, numero: `${prov}-${a}0-${b}` };
  }
  if (tipo === "dimex") {
    let n = "1558";
    for (let i = 0; i < 8; i++) n += Math.floor(rnd() * 10);
    return { tipo, numero: n };
  }
  return { tipo, numero: `IND-${String(1000 + Math.floor(rnd() * 9000))}` };
}

function fechaNacimiento(rnd: () => number): { iso: string } {
  // Distribución pediátrica ponderada (más lactantes y preescolares).
  const bucket = rnd();
  let anos: number;
  if (bucket < 0.28) anos = Math.floor(rnd() * 3); // 0-2
  else if (bucket < 0.55) anos = 3 + Math.floor(rnd() * 4); // 3-6
  else if (bucket < 0.8) anos = 7 + Math.floor(rnd() * 6); // 7-12
  else anos = 13 + Math.floor(rnd() * 9); // 13-21
  const d = new Date(NOW);
  d.setFullYear(d.getFullYear() - anos);
  d.setMonth(Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 27));
  // No futuro
  if (d > NOW) d.setFullYear(d.getFullYear() - 1);
  return { iso: d.toISOString().slice(0, 10) };
}

/** Fecha de registro repartida en los últimos ~24 meses (sesgada a reciente). */
export function registroParaSeed(seed: number): string {
  const rnd = mulberry32(seed * 7919 + 13);
  const diasAtras = Math.floor(Math.pow(rnd(), 1.7) * 730); // 0..~2 años, sesgo reciente
  const d = new Date(NOW);
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString().slice(0, 10);
}

/** Identificación determinista para enriquecer pacientes existentes. */
export function identificacionParaSeed(seed: number): IdentificacionMock {
  return cedulaCR(mulberry32(seed * 104729 + 7));
}

function telefonoCR(rnd: () => number): string {
  const first = [6, 7, 8][Math.floor(rnd() * 3)];
  let rest = "";
  for (let i = 0; i < 7; i++) rest += Math.floor(rnd() * 10);
  return `+506 ${first}${rest.slice(0, 3)}-${rest.slice(3)}`;
}

export function generarPacientes(count: number): PacienteMock[] {
  const out: PacienteMock[] = [];
  for (let i = 0; i < count; i++) {
    const rnd = mulberry32(1000 + i * 2654435761);
    const sexo: PacienteMock["sexo"] = rnd() < 0.5 ? "masculino" : "femenino";
    const nombre = sexo === "masculino"
      ? NOMBRES_M[Math.floor(rnd() * NOMBRES_M.length)]
      : NOMBRES_F[Math.floor(rnd() * NOMBRES_F.length)];
    const apP = APELLIDOS[Math.floor(rnd() * APELLIDOS.length)];
    const apM = APELLIDOS[Math.floor(rnd() * APELLIDOS.length)];
    const nac = fechaNacimiento(rnd);
    const diag = DIAGNOSTICOS[Math.floor(rnd() * DIAGNOSTICOS.length)];
    const parentesco = PARENTESCOS[Math.floor(rnd() * PARENTESCOS.length)];
    const tutorNombreBase = parentesco === "padre"
      ? TUTOR_M[Math.floor(rnd() * TUTOR_M.length)]
      : TUTOR_F[Math.floor(rnd() * TUTOR_F.length)];
    const tutorPrincipal = `${tutorNombreBase} ${apP}`;
    const tel = telefonoCR(rnd);
    const tieneEmail = rnd() < 0.8;
    const email = tieneEmail
      ? `${norm(tutorNombreBase)}.${norm(apP)}${Math.floor(rnd() * 90 + 10)}@${DOMINIOS[Math.floor(rnd() * DOMINIOS.length)]}`
      : undefined;

    out.push({
      id: `pg-${String(i + 1).padStart(3, "0")}`,
      nombre,
      apellidoPaterno: apP,
      apellidoMaterno: apM,
      fechaNacimiento: nac.iso,
      sexo,
      identificacion: cedulaCR(rnd),
      diagnosticosActivos: diag,
      ultimaConsulta: registroParaSeed(i + 500),
      tutorPrincipal,
      tutorParentesco: parentesco,
      telefonoTutor: tel,
      email,
      fechaRegistro: registroParaSeed(i + 1),
    });
  }
  return out;
}
