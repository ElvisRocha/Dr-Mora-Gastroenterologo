import {
  generarPacientes,
  identificacionParaSeed,
  registroParaSeed,
} from "@/lib/data/generarPacientes";

export type ServicioMock = {
  slug: string;
  icon: "stethoscope" | "scope" | "intestine" | "wave" | "leaf" | "lung" | "carrot" | "calendar";
  duracion: number;
  precioDesde?: number;
  destacado?: boolean;
};

export const serviciosMock: ServicioMock[] = [
  { slug: "consulta-gastro", icon: "stethoscope", duracion: 45, destacado: true },
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
  "https://wa.me/50688443322?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20mi%20hijo%2Fa.";

export type MedicamentoMock = {
  nombre: string;
  dosis: string;
  frecuencia: string;
  inicio?: string;
};

export type ProcedimientoAsignadoMock = {
  nombre: string;
  estado: "pendiente" | "realizado";
  fecha?: string;
};

export type TipoIdentificacion =
  | "cedula"
  | "dimex"
  | "pasaporte"
  | "indocumentada";

export type IdentificacionMock = { tipo: TipoIdentificacion; numero: string };

export const TIPO_ID_LABEL: Record<TipoIdentificacion, string> = {
  cedula: "Cédula",
  dimex: "DIMEX",
  pasaporte: "Pasaporte",
  indocumentada: "Sin cédula",
};

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
  medicamentosActivos?: MedicamentoMock[];
  procedimientosAsignados?: ProcedimientoAsignadoMock[];
  /** Identificación del paciente (o del tutor si el menor no tiene). */
  identificacion?: IdentificacionMock;
  /** Fecha en que el expediente entró al sistema (ISO date). */
  fechaRegistro?: string;
  tutorParentesco?: string;
  direccion?: string;
};

const pacientesBase: PacienteMock[] = [
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
    telefonoTutor: "+506 8729-1834",
    email: "marisol.aguirre@correo.cr",
    medicamentosActivos: [
      { nombre: "Omeprazol", dosis: "5 mg", frecuencia: "1 vez/día", inicio: "2026-01-15" },
      { nombre: "Fórmula extensamente hidrolizada", dosis: "120 ml", frecuencia: "Cada 4 h" },
    ],
    procedimientosAsignados: [
      { nombre: "pH-metría 24h", estado: "pendiente" },
    ],
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
    telefonoTutor: "+506 7118-2247",
    email: "ivan.reyes@correo.cr",
    medicamentosActivos: [
      { nombre: "Multivitamínico pediátrico", dosis: "1 tableta", frecuencia: "1 vez/día" },
    ],
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
    telefonoTutor: "+506 6472-9136",
    email: "patricia.k@correo.cr",
    medicamentosActivos: [
      { nombre: "Mesalazina", dosis: "800 mg", frecuencia: "3 veces/día" },
      { nombre: "Hierro polimaltosado", dosis: "100 mg", frecuencia: "1 vez/día" },
    ],
    procedimientosAsignados: [
      { nombre: "Colonoscopía de control", estado: "pendiente" },
      { nombre: "Endoscopía digestiva alta", estado: "realizado", fecha: "2026-02-10" },
    ],
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
    telefonoTutor: "+506 7194-8472",
    email: "roberto.s@correo.cr",
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
    telefonoTutor: "+506 8384-1928",
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
    telefonoTutor: "+506 8729-6612",
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
    telefonoTutor: "+506 7183-4729",
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
    telefonoTutor: "+506 7612-8472",
    email: "e.bautista@correo.cr",
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
    telefonoTutor: "+506 6472-1928",
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
    telefonoTutor: "+506 7928-4729",
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
    telefonoTutor: "+506 8734-6612",
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
    telefonoTutor: "+506 7118-9472",
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

// Enriquecemos los 12 pacientes base con identificación y fecha de registro
// deterministas, y añadimos ~200 pacientes generados para la demo a gran escala.
const pacientesEnriquecidos: PacienteMock[] = pacientesBase.map((p, i) => ({
  ...p,
  identificacion: p.identificacion ?? identificacionParaSeed(i + 1),
  fechaRegistro: p.fechaRegistro ?? registroParaSeed(i + 300),
  tutorParentesco: p.tutorParentesco ?? "madre",
}));

export const pacientesMock: PacienteMock[] = [
  ...pacientesEnriquecidos,
  ...generarPacientes(200),
];

export function pacientePorId(id: string) {
  return pacientesMock.find((p) => p.id === id);
}

/** Edad legible para tablas: "8 meses", "3 años", "15 años". */
export function formatearEdadTabla(fechaNacimiento: string): string {
  const { anos, meses } = calcularEdad(fechaNacimiento);
  if (anos < 1) return `${anos * 12 + meses} meses`;
  if (anos < 2) return `1 año ${meses} m`;
  return `${anos} años`;
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

// ===========================================================================
// Expediente clínico extendido
// ===========================================================================

export type TutorMock = {
  nombre: string;
  relacion: "madre" | "padre" | "abuelo" | "tio" | "tutor_legal" | "otro";
  telefono: string;
  email?: string;
  principal: boolean;
};

export type AntropometriaMock = {
  fecha: string;
  pesoKg: number;
  tallaCm: number;
  imc: number;
  percentilPeso?: string;
};

export type AntecedentesMock = {
  familiares: string;
  alergias: string;
  cirugias: string;
  hospitalizaciones: string;
  perinatales: {
    tipoParto: "vaginal" | "cesarea" | "no_especificado";
    pesoNacerKg: number;
    tallaNacerCm: number;
    semanasGestacion: number;
    lactancia: string;
  };
};

export type HabitoDigestivoMock = {
  bristolEscala: number;
  frecuenciaSemanal: number;
  dolorDefecar: boolean;
  sangrado: boolean;
  distension: string;
  reflujo: string;
};

export type AlimentacionMock = {
  comidasPorDia: number;
  dietaEspecial: string;
  alimentosPreferidos: string[];
  alimentosRechazados: string[];
};

export type VacunaMock = {
  nombre: string;
  fecha: string;
  refuerzo?: string;
};

export type ExpedienteMock = {
  antecedentes: AntecedentesMock;
  antropometria: AntropometriaMock[];
  habitoDigestivo: HabitoDigestivoMock;
  alimentacion: AlimentacionMock;
  vacunas: VacunaMock[];
  tutores: TutorMock[];
};

export const expedientesMock: Record<string, ExpedienteMock> = {
  "p-001": {
    antecedentes: {
      familiares: "Madre con atopia. Tío materno con EII (Crohn).",
      alergias: "Proteína de leche de vaca.",
      cirugias: "Ninguna.",
      hospitalizaciones: "Una a los 8 meses por bronquiolitis (3 días).",
      perinatales: {
        tipoParto: "cesarea",
        pesoNacerKg: 3.2,
        tallaNacerCm: 49,
        semanasGestacion: 38,
        lactancia: "Materna exclusiva 4 meses, luego fórmula extensamente hidrolizada.",
      },
    },
    antropometria: [
      { fecha: "2026-04-22", pesoKg: 12.4, tallaCm: 92, imc: 14.6, percentilPeso: "p25" },
      { fecha: "2026-01-10", pesoKg: 11.8, tallaCm: 89, imc: 14.9, percentilPeso: "p25" },
      { fecha: "2025-10-04", pesoKg: 11.1, tallaCm: 86, imc: 15.0, percentilPeso: "p20" },
      { fecha: "2025-07-12", pesoKg: 10.4, tallaCm: 82, imc: 15.5, percentilPeso: "p18" },
    ],
    habitoDigestivo: {
      bristolEscala: 4,
      frecuenciaSemanal: 7,
      dolorDefecar: false,
      sangrado: false,
      distension: "Ocasional, postprandial",
      reflujo: "Reflujo silencioso ocasional",
    },
    alimentacion: {
      comidasPorDia: 5,
      dietaEspecial: "Sin proteína de leche de vaca",
      alimentosPreferidos: ["Pollo", "Arroz", "Manzana"],
      alimentosRechazados: ["Vegetales de hoja verde"],
    },
    vacunas: [
      { nombre: "BCG", fecha: "2022-04-13" },
      { nombre: "Hepatitis B (3 dosis)", fecha: "2022-10-12" },
      { nombre: "Pentavalente", fecha: "2023-04-12", refuerzo: "2024-04-12" },
      { nombre: "Triple viral (SRP)", fecha: "2023-04-12" },
      { nombre: "Influenza", fecha: "2025-10-15" },
    ],
    tutores: [
      {
        nombre: "Marisol Aguirre",
        relacion: "madre",
        telefono: "+506 8729-1834",
        email: "marisol.aguirre@correo.cr",
        principal: true,
      },
      {
        nombre: "Daniel Pérez",
        relacion: "padre",
        telefono: "+506 7118-8472",
        principal: false,
      },
    ],
  },
  "p-002": {
    antecedentes: {
      familiares: "Padre con celiaquía. Abuela materna con tiroiditis autoinmune.",
      alergias: "Ninguna conocida.",
      cirugias: "Ninguna.",
      hospitalizaciones: "Ninguna.",
      perinatales: {
        tipoParto: "vaginal",
        pesoNacerKg: 3.5,
        tallaNacerCm: 51,
        semanasGestacion: 40,
        lactancia: "Materna exclusiva 6 meses.",
      },
    },
    antropometria: [
      { fecha: "2026-03-18", pesoKg: 33.5, tallaCm: 142, imc: 16.6, percentilPeso: "p40" },
      { fecha: "2025-09-14", pesoKg: 31.2, tallaCm: 138, imc: 16.4, percentilPeso: "p35" },
      { fecha: "2025-03-22", pesoKg: 29.8, tallaCm: 135, imc: 16.3, percentilPeso: "p32" },
    ],
    habitoDigestivo: {
      bristolEscala: 4,
      frecuenciaSemanal: 7,
      dolorDefecar: false,
      sangrado: false,
      distension: "Ausente con dieta libre de gluten",
      reflujo: "Sin episodios",
    },
    alimentacion: {
      comidasPorDia: 4,
      dietaEspecial: "Estricta libre de gluten",
      alimentosPreferidos: ["Pasta de arroz", "Frutas", "Yogurt"],
      alimentosRechazados: [],
    },
    vacunas: [
      { nombre: "Esquema nacional de vacunación completo", fecha: "2014-2024" },
      { nombre: "VPH (1ª dosis)", fecha: "2025-08-12", refuerzo: "2026-02-12" },
    ],
    tutores: [
      {
        nombre: "Iván Reyes",
        relacion: "padre",
        telefono: "+506 7118-2247",
        email: "ivan.reyes@correo.cr",
        principal: true,
      },
    ],
  },
  "p-003": {
    antecedentes: {
      familiares: "Hermano mayor con colitis ulcerosa.",
      alergias: "Ninguna conocida.",
      cirugias: "Apendicectomía 2024.",
      hospitalizaciones:
        "Dos por brote de Crohn (2024 y 2025), control con biológico en evaluación.",
      perinatales: {
        tipoParto: "vaginal",
        pesoNacerKg: 3.4,
        tallaNacerCm: 50,
        semanasGestacion: 39,
        lactancia: "Materna 4 meses + fórmula.",
      },
    },
    antropometria: [
      { fecha: "2026-04-29", pesoKg: 52.8, tallaCm: 168, imc: 18.7, percentilPeso: "p35" },
      { fecha: "2025-10-12", pesoKg: 50.2, tallaCm: 165, imc: 18.4, percentilPeso: "p30" },
      { fecha: "2025-04-15", pesoKg: 47.5, tallaCm: 162, imc: 18.1, percentilPeso: "p28" },
    ],
    habitoDigestivo: {
      bristolEscala: 5,
      frecuenciaSemanal: 14,
      dolorDefecar: true,
      sangrado: true,
      distension: "Frecuente, asociada a brotes",
      reflujo: "Ausente",
    },
    alimentacion: {
      comidasPorDia: 4,
      dietaEspecial: "Baja en lactosa y residuos durante brotes",
      alimentosPreferidos: ["Arroz", "Pollo a la plancha", "Plátano"],
      alimentosRechazados: ["Lácteos enteros", "Granos integrales"],
    },
    vacunas: [
      { nombre: "Esquema nacional de vacunación completo", fecha: "2008-2018" },
      { nombre: "Influenza anual", fecha: "2025-11-04" },
      { nombre: "Hepatitis A refuerzo", fecha: "2024-09-15" },
    ],
    tutores: [
      {
        nombre: "Patricia Krauss",
        relacion: "madre",
        telefono: "+506 6472-9136",
        email: "patricia.k@correo.cr",
        principal: true,
      },
      {
        nombre: "Esteban Patiño",
        relacion: "padre",
        telefono: "+506 7845-9072",
        principal: false,
      },
    ],
  },
};

export const expedienteDefault: ExpedienteMock = {
  antecedentes: {
    familiares: "",
    alergias: "",
    cirugias: "",
    hospitalizaciones: "",
    perinatales: {
      tipoParto: "no_especificado",
      pesoNacerKg: 0,
      tallaNacerCm: 0,
      semanasGestacion: 0,
      lactancia: "",
    },
  },
  antropometria: [],
  habitoDigestivo: {
    bristolEscala: 4,
    frecuenciaSemanal: 0,
    dolorDefecar: false,
    sangrado: false,
    distension: "",
    reflujo: "",
  },
  alimentacion: {
    comidasPorDia: 0,
    dietaEspecial: "",
    alimentosPreferidos: [],
    alimentosRechazados: [],
  },
  vacunas: [],
  tutores: [],
};

export type SignosVitalesMock = {
  pa?: string;
  fc?: string;
  pesoKg?: number;
  tallaCm?: number;
  temperatura?: number;
  imc?: number;
};

export type ExploracionFisicaMock = {
  abdomen?: string;
  general?: string;
};

export type ConsultaMock = {
  id: string;
  pacienteId: string;
  fecha: string;
  servicioSlug: string;
  motivo: string;
  notas: string;
  diagnosticos: string[];
  procedimientosOrdenados: string[];
  medicamentosRecetados: MedicamentoMock[];
  duracionMin: number;
  acompanante?: string;
  enfermedadActual?: string;
  resultadosLaboratorio?: string;
  signosVitales?: SignosVitalesMock;
  exploracionFisica?: ExploracionFisicaMock;
  planTratamiento?: string;
  notasAdicionales?: string;
};

export type ArchivoMock = {
  id: string;
  consultaId: string;
  nombre: string;
  mimeType: string;
  tamanoBytes: number;
  /** Data URL (base64). En migración a Supabase reemplazar por `path` + signed URL. */
  data: string;
  subidoEn: string;
};

export type NotaBitacoraMock = {
  id: string;
  consultaId: string;
  fecha: string;
  texto: string;
  imagen?: string;
  imagenNombre?: string;
};

export const consultasMock: ConsultaMock[] = [
  {
    id: "co-001",
    pacienteId: "p-001",
    fecha: at(-7, 10),
    servicioSlug: "consulta-gastro",
    motivo: "Vómito post-toma persistente, irritabilidad nocturna.",
    notas:
      "Lactante con cuadro compatible con ERGE + APLV. Continúa con fórmula extensamente hidrolizada y omeprazol. Adecuada ganancia ponderal en últimas 6 semanas. Se programa pH-metría 24h para confirmar reflujo ácido nocturno.",
    diagnosticos: ["ERGE del lactante", "APLV"],
    procedimientosOrdenados: ["pH-metría 24h"],
    medicamentosRecetados: [
      { nombre: "Omeprazol", dosis: "5 mg", frecuencia: "1 vez/día" },
    ],
    duracionMin: 60,
  },
  {
    id: "co-002",
    pacienteId: "p-002",
    fecha: at(-30, 11, 30),
    servicioSlug: "seguimiento-cronico",
    motivo: "Control rutinario celiaquía, sin sintomatología.",
    notas:
      "Adherencia estricta a dieta libre de gluten. Crecimiento adecuado. Anticuerpos anti-tTG en descenso. Mantener controles cada 6 meses.",
    diagnosticos: ["Celiaquía"],
    procedimientosOrdenados: [],
    medicamentosRecetados: [
      { nombre: "Multivitamínico pediátrico", dosis: "1 tableta", frecuencia: "1 vez/día" },
    ],
    duracionMin: 30,
  },
  {
    id: "co-003",
    pacienteId: "p-003",
    fecha: at(-3, 16),
    servicioSlug: "consulta-gastro",
    motivo: "Aumento de evacuaciones con sangre, dolor abdominal.",
    notas:
      "Posible brote moderado de enfermedad de Crohn. Calprotectina fecal solicitada. Considerar ajuste de mesalazina y discutir biológico en próxima consulta. Indicada dieta baja en residuos temporal.",
    diagnosticos: ["Enfermedad de Crohn"],
    procedimientosOrdenados: ["Colonoscopía de control", "Calprotectina fecal"],
    medicamentosRecetados: [
      { nombre: "Mesalazina", dosis: "800 mg", frecuencia: "3 veces/día" },
    ],
    duracionMin: 60,
  },
];
