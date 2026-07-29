import type { ServicioCategoria } from "@/lib/data/servicios";

// Paleta Gastro Kids para los gráficos (hex explícito para recharts).
export const C = {
  navy: "#1F4068",
  leaf: "#7EB748",
  teal: "#3DA9A3",
  amber: "#E89C4D",
  coral: "#E88C7D",
  gray: "#CBD3DE", // neutro (proyectado / dentro de horario)
  muted: "#94A3B8",
};

// Semántica (paralela a la referencia, remapeada a la marca):
export const SERIE = {
  realizado: C.navy,
  proyectado: C.gray,
  canalIA: C.navy, // Gastrito
  canalWeb: C.leaf,
  dentro: C.navy, // en horario público (azul de marca)
  fuera: C.leaf, // fuera de horario — demanda captada (verde de marca)
  realOver: C.coral, // duración real se pasa (malo)
  realUnder: C.leaf, // real por debajo (bueno) — más rápida con el sistema
  estimada: C.navy, // tiempo estimado (baseline, color de marca)
  lead: C.teal,
};

export const CATEGORIA_COLOR: Record<ServicioCategoria, string> = {
  consultas: C.navy,
  endoscopia: C.teal,
  pruebas: C.amber,
  nutricion: C.leaf,
};

// Embudo de conversión (agendadas → confirmadas → completadas → fuga)
export const FUNNEL_COLOR = {
  agendadas: C.navy,
  confirmadas: C.teal,
  completadas: C.leaf,
  fuga: C.coral,
};

// Responsables (grouped bars): Gastrito, Paciente(web), Recepción, Dr. Mora
export const RESPONSABLE_PALETTE = [C.navy, C.leaf, C.teal, C.amber];
