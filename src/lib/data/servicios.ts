// Catálogo de servicios editable desde el panel (Configuración → Servicios).
// Modelo rico: precio, duración, categoría, descripción pública, activo, orden.
// Reemplaza/extiende el `serviciosMock` mínimo de lib/mock.ts.

export type ServicioCategoria =
  | "consultas"
  | "endoscopia"
  | "pruebas"
  | "nutricion";

export const CATEGORIA_LABEL: Record<ServicioCategoria, string> = {
  consultas: "Consultas",
  endoscopia: "Endoscopía",
  pruebas: "Pruebas funcionales",
  nutricion: "Nutrición",
};

export const CATEGORIA_BADGE: Record<
  ServicioCategoria,
  "navy" | "leaf" | "teal" | "amber" | "coral" | "neutral"
> = {
  consultas: "navy",
  endoscopia: "teal",
  pruebas: "amber",
  nutricion: "leaf",
};

export type ServicioFull = {
  id: string; // slug
  nombre: string;
  nombreEn: string;
  categoria: ServicioCategoria;
  duracion: string; // texto legible "60 min"
  duracionMin: number;
  precio: number; // colones (CRC)
  precioNota?: string;
  descripcion: string; // orientado a familias (panel + sitio público)
  icon: string; // clave de icono (lib/mock ServicioMock.icon)
  activo: boolean;
  orden: number;
  /** Requiere coordinación con recepción (ayuno, sedación, hospital). */
  requiereSecretaria: boolean;
  destacado?: boolean;
};

export const serviciosSeed: ServicioFull[] = [
  {
    id: "consulta-gastro",
    nombre: "Consulta de gastroenterología pediátrica",
    nombreEn: "Pediatric gastroenterology consultation",
    categoria: "consultas",
    duracion: "45 min",
    duracionMin: 45,
    precio: 60000,
    descripcion:
      "Evaluación completa del sistema digestivo con historia clínica, exploración física, antropometría y plan diagnóstico y terapéutico personalizado para tu hijo.",
    icon: "stethoscope",
    activo: true,
    orden: 1,
    requiereSecretaria: false,
    destacado: true,
  },
  {
    id: "seguimiento-cronico",
    nombre: "Seguimiento de patología crónica",
    nombreEn: "Chronic condition follow-up",
    categoria: "consultas",
    duracion: "30 min",
    duracionMin: 30,
    precio: 45000,
    descripcion:
      "Manejo continuo de enfermedad inflamatoria intestinal, celiaquía y alergia a la proteína de leche de vaca con controles programados.",
    icon: "calendar",
    activo: true,
    orden: 2,
    requiereSecretaria: false,
  },
  {
    id: "endoscopia-alta",
    nombre: "Endoscopía digestiva alta",
    nombreEn: "Upper GI endoscopy",
    categoria: "endoscopia",
    duracion: "45 min",
    duracionMin: 45,
    precio: 320000,
    precioNota: "No incluye honorarios de anestesiología",
    descripcion:
      "Procedimiento ambulatorio bajo sedación pediátrica para estudiar esófago, estómago y duodeno. Se realiza en hospital certificado con anestesiología pediátrica.",
    icon: "scope",
    activo: true,
    orden: 3,
    requiereSecretaria: true,
  },
  {
    id: "colonoscopia",
    nombre: "Colonoscopía pediátrica",
    nombreEn: "Pediatric colonoscopy",
    categoria: "endoscopia",
    duracion: "60 min",
    duracionMin: 60,
    precio: 380000,
    precioNota: "No incluye honorarios de anestesiología",
    descripcion:
      "Estudio endoscópico del colon con preparación adaptada al peso y edad. Requiere preparación intestinal previa e indicaciones de recepción.",
    icon: "intestine",
    activo: true,
    orden: 4,
    requiereSecretaria: true,
  },
  {
    id: "phmetria",
    nombre: "pH-metría de 24 horas",
    nombreEn: "24-hour pH monitoring",
    categoria: "pruebas",
    duracion: "30 min",
    duracionMin: 30,
    precio: 190000,
    descripcion:
      "Medición ambulatoria del reflujo ácido durante 24 horas para confirmar o descartar ERGE. Se suspende el omeprazol 5 días antes del estudio.",
    icon: "wave",
    activo: true,
    orden: 5,
    requiereSecretaria: true,
  },
  {
    id: "manometria",
    nombre: "Manometría anorrectal",
    nombreEn: "Anorectal manometry",
    categoria: "pruebas",
    duracion: "45 min",
    duracionMin: 45,
    precio: 170000,
    descripcion:
      "Estudio funcional del piso pélvico en estreñimiento crónico y trastornos defecatorios. Procedimiento no invasivo y bien tolerado.",
    icon: "wave",
    activo: true,
    orden: 6,
    requiereSecretaria: false,
  },
  {
    id: "aliento",
    nombre: "Prueba de aliento",
    nombreEn: "Breath test",
    categoria: "pruebas",
    duracion: "30 min",
    duracionMin: 30,
    precio: 75000,
    descripcion:
      "Diagnóstico no invasivo para intolerancia a la lactosa, fructosa, sobrecrecimiento bacteriano y H. pylori.",
    icon: "lung",
    activo: true,
    orden: 7,
    requiereSecretaria: false,
  },
  {
    id: "nutricion",
    nombre: "Consulta de nutrición infantil",
    nombreEn: "Pediatric nutrition consultation",
    categoria: "nutricion",
    duracion: "45 min",
    duracionMin: 45,
    precio: 42000,
    descripcion:
      "Plan alimentario personalizado, manejo de alergias alimentarias, selectividad y acompañamiento en la introducción de alimentos.",
    icon: "carrot",
    activo: true,
    orden: 8,
    requiereSecretaria: false,
    destacado: true,
  },
];

export function formatPrecio(colones: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(colones);
}

/** Formato compacto para tableros: ₡6,6M, ₡80K, ₡550. */
export function formatPrecioCompacto(colones: number): string {
  const abs = Math.abs(colones);
  if (abs >= 1_000_000)
    return `₡${(colones / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (abs >= 1_000) return `₡${Math.round(colones / 1_000)}K`;
  return `₡${Math.round(colones)}`;
}
