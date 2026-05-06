export type ServicioMock = {
  slug: string;
  icon: "stethoscope" | "scope" | "intestine" | "wave" | "leaf" | "lung" | "carrot" | "calendar";
  duracion: number;
  precioDesde?: number;
  destacado?: boolean;
};

export const serviciosMock: ServicioMock[] = [
  { slug: "consulta-gastro", icon: "stethoscope", duracion: 60, destacado: true },
  { slug: "endoscopia-alta", icon: "scope", duracion: 45 },
  { slug: "colonoscopia", icon: "intestine", duracion: 60 },
  { slug: "phmetria", icon: "wave", duracion: 30 },
  { slug: "manometria", icon: "wave", duracion: 45 },
  { slug: "aliento", icon: "lung", duracion: 30 },
  { slug: "nutricion", icon: "carrot", duracion: 45, destacado: true },
  { slug: "seguimiento-cronico", icon: "calendar", duracion: 30 },
];

export type GaleriaCategory =
  | "consultorio"
  | "procedimientos"
  | "nutricion"
  | "pacientes";

export type GaleriaItem = {
  id: number;
  src: string;
  alt: string;
  category: GaleriaCategory;
};

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// Las 4 primeras se muestran en la sección destacada del landing,
// alineadas con `t.galeria.featuredCards` (recepción, consultorio,
// procedimientos, equipo).
// El resto se distribuye entre las categorías de /galeria.
export const galeriaMock: GaleriaItem[] = [
  // Featured (landing) — 4 primeras
  {
    id: 1,
    src: unsplash("1629909613654-28e377c37b09", 960, 720),
    alt: "Área de recepción del consultorio",
    category: "consultorio",
  },
  {
    id: 2,
    src: unsplash("1576091160399-112ba8d25d1d", 960, 720),
    alt: "Consulta pediátrica",
    category: "consultorio",
  },
  {
    id: 3,
    src: unsplash("1666214280391-8ff5bd3c0bf0", 960, 720),
    alt: "Sala de procedimientos endoscópicos",
    category: "procedimientos",
  },
  {
    id: 4,
    src: unsplash("1631217868264-e5b90bb7e133", 960, 720),
    alt: "Equipo médico del consultorio",
    category: "consultorio",
  },

  // Consultorio (resto)
  {
    id: 5,
    src: unsplash("1631815588090-d4bfec5b1ccb", 960, 720),
    alt: "Sala de evaluación pediátrica",
    category: "consultorio",
  },
  {
    id: 6,
    src: unsplash("1559839734-2b71ea197ec2", 960, 720),
    alt: "Atención clínica personalizada",
    category: "consultorio",
  },

  // Procedimientos
  {
    id: 7,
    src: unsplash("1582719471384-894fbb16e074", 960, 720),
    alt: "Laboratorio de análisis",
    category: "procedimientos",
  },
  {
    id: 8,
    src: unsplash("1551601651-2a8555f1a136", 960, 720),
    alt: "Equipo de diagnóstico",
    category: "procedimientos",
  },
  {
    id: 9,
    src: unsplash("1538108149393-fbbd81895907", 960, 720),
    alt: "Pasillo hospitalario",
    category: "procedimientos",
  },
  {
    id: 10,
    src: unsplash("1606811971618-4486d14f3f99", 960, 720),
    alt: "Sala de exploración",
    category: "procedimientos",
  },
  {
    id: 11,
    src: unsplash("1559757148-5c350d0d3c56", 960, 720),
    alt: "Instrumental médico",
    category: "procedimientos",
  },

  // Nutrición
  {
    id: 12,
    src: unsplash("1490645935967-10de6ba17061", 960, 720),
    alt: "Plato saludable para niños",
    category: "nutricion",
  },
  {
    id: 13,
    src: unsplash("1502691876148-a84978e59af8", 960, 720),
    alt: "Comida nutritiva infantil",
    category: "nutricion",
  },
  {
    id: 14,
    src: unsplash("1490818387583-1baba5e638af", 960, 720),
    alt: "Frutas y verduras frescas",
    category: "nutricion",
  },
  {
    id: 15,
    src: unsplash("1542884748-2b87b36c6b90", 960, 720),
    alt: "Selección de alimentos saludables",
    category: "nutricion",
  },
  {
    id: 16,
    src: unsplash("1607619056574-7b8d3ee536b2", 960, 720),
    alt: "Plan alimentario pediátrico",
    category: "nutricion",
  },

  // Pacientes felices
  {
    id: 17,
    src: unsplash("1587814213271-7a6625b76c33", 960, 720),
    alt: "Niño sonriente",
    category: "pacientes",
  },
  {
    id: 18,
    src: unsplash("1503454537195-1dcabb73ffb9", 960, 720),
    alt: "Infancia activa",
    category: "pacientes",
  },
  {
    id: 19,
    src: unsplash("1518152006812-edab29b069ac", 960, 720),
    alt: "Familia con paciente",
    category: "pacientes",
  },
  {
    id: 20,
    src: unsplash("1530497610245-94d3c16cda28", 960, 720),
    alt: "Niños saludables",
    category: "pacientes",
  },
];

export const galeriaDestacada = galeriaMock.slice(0, 4);

export const heroIlustracion =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=1100&fit=crop&auto=format&q=80";

export const doctorPortrait =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=640&h=800&fit=crop&auto=format&q=80";

export const whatsappLink =
  "https://wa.me/525555555555?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20mi%20hijo%2Fa.";

export type PacienteMock = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string;
  sexo: "masculino" | "femenino";
  diagnosticosActivos: string[];
  ultimaConsulta: string;
  proximaCita?: string;
  tutorPrincipal: string;
  telefonoTutor: string;
  email?: string;
};

export const pacientesMock: PacienteMock[] = [
  {
    id: "p-001",
    nombre: "Tomás",
    apellidoPaterno: "Aguirre",
    apellidoMaterno: "Vela",
    fechaNacimiento: "2022-04-12",
    sexo: "masculino",
    diagnosticosActivos: ["ERGE del lactante", "APLV"],
    ultimaConsulta: "2026-04-22",
    proximaCita: "2026-05-08",
    tutorPrincipal: "Marisol Aguirre",
    telefonoTutor: "+52 55 4729 1834",
    email: "marisol.aguirre@correo.mx",
  },
  {
    id: "p-002",
    nombre: "Lucía",
    apellidoPaterno: "Reyes",
    apellidoMaterno: "Cabral",
    fechaNacimiento: "2014-11-03",
    sexo: "femenino",
    diagnosticosActivos: ["Celiaquía"],
    ultimaConsulta: "2026-03-18",
    proximaCita: "2026-05-12",
    tutorPrincipal: "Iván Reyes",
    telefonoTutor: "+52 55 6118 2247",
    email: "ivan.reyes@correo.mx",
  },
  {
    id: "p-003",
    nombre: "Daniel",
    apellidoPaterno: "Krauss",
    apellidoMaterno: "Patiño",
    fechaNacimiento: "2008-09-21",
    sexo: "masculino",
    diagnosticosActivos: ["Enfermedad de Crohn"],
    ultimaConsulta: "2026-04-29",
    proximaCita: "2026-05-15",
    tutorPrincipal: "Patricia Krauss",
    telefonoTutor: "+52 55 8472 9136",
    email: "patricia.k@correo.mx",
  },
  {
    id: "p-004",
    nombre: "Sofía",
    apellidoPaterno: "Solórzano",
    fechaNacimiento: "2024-02-04",
    sexo: "femenino",
    diagnosticosActivos: ["APLV", "Estreñimiento funcional"],
    ultimaConsulta: "2026-04-15",
    proximaCita: "2026-05-19",
    tutorPrincipal: "Roberto Solórzano",
    telefonoTutor: "+52 55 3194 8472",
    email: "roberto.s@correo.mx",
  },
  {
    id: "p-005",
    nombre: "Mateo",
    apellidoPaterno: "Villalpando",
    apellidoMaterno: "Espino",
    fechaNacimiento: "2017-06-10",
    sexo: "masculino",
    diagnosticosActivos: ["Estreñimiento crónico funcional"],
    ultimaConsulta: "2026-04-08",
    proximaCita: "2026-06-02",
    tutorPrincipal: "Andrea Villalpando",
    telefonoTutor: "+52 55 7384 1928",
  },
  {
    id: "p-006",
    nombre: "Renata",
    apellidoPaterno: "Méndez",
    apellidoMaterno: "Lara",
    fechaNacimiento: "2019-08-29",
    sexo: "femenino",
    diagnosticosActivos: ["Dispepsia funcional"],
    ultimaConsulta: "2026-04-30",
    tutorPrincipal: "Cecilia Lara",
    telefonoTutor: "+52 55 4729 6612",
  },
  {
    id: "p-007",
    nombre: "Joaquín",
    apellidoPaterno: "Ortiz",
    apellidoMaterno: "Rincón",
    fechaNacimiento: "2011-01-14",
    sexo: "masculino",
    diagnosticosActivos: ["Intolerancia a la lactosa"],
    ultimaConsulta: "2026-03-04",
    proximaCita: "2026-05-20",
    tutorPrincipal: "Mariana Rincón",
    telefonoTutor: "+52 55 9183 4729",
  },
  {
    id: "p-008",
    nombre: "Camila",
    apellidoPaterno: "Bautista",
    fechaNacimiento: "2009-12-07",
    sexo: "femenino",
    diagnosticosActivos: ["Colitis ulcerosa"],
    ultimaConsulta: "2026-04-26",
    proximaCita: "2026-05-09",
    tutorPrincipal: "Esteban Bautista",
    telefonoTutor: "+52 55 6612 8472",
    email: "e.bautista@correo.mx",
  },
  {
    id: "p-009",
    nombre: "Iker",
    apellidoPaterno: "Domínguez",
    apellidoMaterno: "Santos",
    fechaNacimiento: "2023-07-25",
    sexo: "masculino",
    diagnosticosActivos: ["Cólico del lactante", "ERGE"],
    ultimaConsulta: "2026-04-17",
    proximaCita: "2026-05-06",
    tutorPrincipal: "Verónica Santos",
    telefonoTutor: "+52 55 8472 1928",
  },
  {
    id: "p-010",
    nombre: "Valeria",
    apellidoPaterno: "Higuera",
    apellidoMaterno: "Lozano",
    fechaNacimiento: "2006-05-18",
    sexo: "femenino",
    diagnosticosActivos: ["EII en remisión"],
    ultimaConsulta: "2026-03-22",
    proximaCita: "2026-05-22",
    tutorPrincipal: "Fernando Higuera",
    telefonoTutor: "+52 55 1928 4729",
  },
  {
    id: "p-011",
    nombre: "Alonso",
    apellidoPaterno: "Castaño",
    apellidoMaterno: "Vergara",
    fechaNacimiento: "2015-10-11",
    sexo: "masculino",
    diagnosticosActivos: ["Selectividad alimentaria"],
    ultimaConsulta: "2026-04-12",
    tutorPrincipal: "Jimena Vergara",
    telefonoTutor: "+52 55 2734 6612",
  },
  {
    id: "p-012",
    nombre: "Bruno",
    apellidoPaterno: "Saldaña",
    apellidoMaterno: "Olvera",
    fechaNacimiento: "2020-03-30",
    sexo: "masculino",
    diagnosticosActivos: ["Reflujo gastroesofágico"],
    ultimaConsulta: "2026-04-05",
    proximaCita: "2026-05-13",
    tutorPrincipal: "Lucía Olvera",
    telefonoTutor: "+52 55 6118 9472",
  },
];

export type CitaMock = {
  id: string;
  pacienteId: string;
  servicioSlug: string;
  fechaHora: string;
  duracionMin: number;
  estado: "agendada" | "confirmada" | "realizada" | "cancelada" | "no_asistio";
  notas?: string;
};

const today = () => new Date();
const at = (offsetDays: number, hour: number, minute = 0) => {
  const d = today();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const citasMock: CitaMock[] = [
  { id: "c-001", pacienteId: "p-001", servicioSlug: "consulta-gastro", fechaHora: at(-7, 10), duracionMin: 60, estado: "realizada" },
  { id: "c-002", pacienteId: "p-002", servicioSlug: "seguimiento-cronico", fechaHora: at(-5, 11, 30), duracionMin: 30, estado: "realizada" },
  { id: "c-003", pacienteId: "p-003", servicioSlug: "consulta-gastro", fechaHora: at(-3, 16), duracionMin: 60, estado: "realizada" },
  { id: "c-004", pacienteId: "p-005", servicioSlug: "manometria", fechaHora: at(-2, 9), duracionMin: 45, estado: "realizada" },
  { id: "c-005", pacienteId: "p-009", servicioSlug: "consulta-gastro", fechaHora: at(0, 9, 30), duracionMin: 60, estado: "confirmada" },
  { id: "c-006", pacienteId: "p-001", servicioSlug: "seguimiento-cronico", fechaHora: at(1, 10), duracionMin: 30, estado: "agendada" },
  { id: "c-007", pacienteId: "p-008", servicioSlug: "colonoscopia", fechaHora: at(2, 8), duracionMin: 60, estado: "agendada" },
  { id: "c-008", pacienteId: "p-006", servicioSlug: "consulta-gastro", fechaHora: at(0, 13), duracionMin: 60, estado: "confirmada" },
  { id: "c-009", pacienteId: "p-002", servicioSlug: "nutricion", fechaHora: at(3, 11), duracionMin: 45, estado: "agendada" },
  { id: "c-010", pacienteId: "p-010", servicioSlug: "seguimiento-cronico", fechaHora: at(4, 16), duracionMin: 30, estado: "agendada" },
  { id: "c-011", pacienteId: "p-007", servicioSlug: "aliento", fechaHora: at(5, 10), duracionMin: 30, estado: "agendada" },
  { id: "c-012", pacienteId: "p-012", servicioSlug: "consulta-gastro", fechaHora: at(6, 9, 30), duracionMin: 60, estado: "agendada" },
  { id: "c-013", pacienteId: "p-003", servicioSlug: "endoscopia-alta", fechaHora: at(7, 8), duracionMin: 45, estado: "agendada" },
  { id: "c-014", pacienteId: "p-004", servicioSlug: "nutricion", fechaHora: at(8, 11), duracionMin: 45, estado: "agendada" },
  { id: "c-015", pacienteId: "p-006", servicioSlug: "seguimiento-cronico", fechaHora: at(9, 16), duracionMin: 30, estado: "agendada" },
  { id: "c-016", pacienteId: "p-005", servicioSlug: "consulta-gastro", fechaHora: at(10, 10), duracionMin: 60, estado: "agendada" },
  { id: "c-017", pacienteId: "p-008", servicioSlug: "seguimiento-cronico", fechaHora: at(11, 13), duracionMin: 30, estado: "agendada" },
  { id: "c-018", pacienteId: "p-001", servicioSlug: "consulta-gastro", fechaHora: at(14, 9, 30), duracionMin: 60, estado: "agendada" },
  { id: "c-019", pacienteId: "p-011", servicioSlug: "nutricion", fechaHora: at(15, 11), duracionMin: 45, estado: "agendada" },
  { id: "c-020", pacienteId: "p-012", servicioSlug: "phmetria", fechaHora: at(16, 8, 30), duracionMin: 30, estado: "agendada" },
  { id: "c-021", pacienteId: "p-004", servicioSlug: "consulta-gastro", fechaHora: at(17, 10), duracionMin: 60, estado: "agendada" },
  { id: "c-022", pacienteId: "p-002", servicioSlug: "seguimiento-cronico", fechaHora: at(20, 16), duracionMin: 30, estado: "agendada" },
  { id: "c-023", pacienteId: "p-003", servicioSlug: "seguimiento-cronico", fechaHora: at(22, 11, 30), duracionMin: 30, estado: "agendada" },
  { id: "c-024", pacienteId: "p-010", servicioSlug: "consulta-gastro", fechaHora: at(25, 9), duracionMin: 60, estado: "agendada" },
];

export function pacientePorId(id: string) {
  return pacientesMock.find((p) => p.id === id);
}

export function calcularEdad(fechaNacimiento: string): { anos: number; meses: number } {
  const nac = new Date(fechaNacimiento);
  const hoy = new Date();
  let anos = hoy.getFullYear() - nac.getFullYear();
  let meses = hoy.getMonth() - nac.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nac.getDate())) {
    anos--;
    meses += 12;
  }
  return { anos, meses };
}

export function formatearEdad(fechaNacimiento: string, lang: "es" | "en" = "es") {
  const { anos, meses } = calcularEdad(fechaNacimiento);
  if (lang === "en") {
    if (anos < 2) return `${anos * 12 + meses} mo`;
    return `${anos} y${meses ? ` ${meses} mo` : ""}`;
  }
  if (anos < 2) return `${anos * 12 + meses} meses`;
  return `${anos} a${meses ? ` ${meses} m` : ""}`;
}
