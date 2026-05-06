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

export type GaleriaItem = {
  src: string;
  alt: string;
  span?: "wide" | "tall" | "square";
};

// Las 4 primeras se muestran en la sección destacada del landing.
// El resto se ven en /galeria.
export const galeriaMock: GaleriaItem[] = [
  {
    src: "https://picsum.photos/seed/gastrokids-recepcion/960/720",
    alt: "Área de recepción del consultorio",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-consulta/960/720",
    alt: "Consultorio de evaluación pediátrica",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-procedimiento/960/720",
    alt: "Sala de procedimientos endoscópicos",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-equipo/960/720",
    alt: "Equipo del consultorio",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-juegos/720/720",
    alt: "Área de espera lúdica",
    span: "square",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-nutricion/720/900",
    alt: "Consulta de nutrición infantil",
    span: "tall",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-laboratorio/960/720",
    alt: "Laboratorio aliado",
    span: "wide",
  },
  {
    src: "https://picsum.photos/seed/gastrokids-detalle/720/900",
    alt: "Detalle del consultorio",
    span: "tall",
  },
];

export const galeriaDestacada = galeriaMock.slice(0, 4);

export const heroIlustracion =
  "https://picsum.photos/seed/gastrokids-hero-portrait/900/1100";

export const doctorPortrait =
  "https://picsum.photos/seed/dr-alfredo-mora/640/800";

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
