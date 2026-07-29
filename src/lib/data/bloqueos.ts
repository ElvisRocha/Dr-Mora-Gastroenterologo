import { atDay } from "./time";

// Bloqueos de agenda (horarios no disponibles: vacaciones, comida,
// capacitación, feriados, etc.).

export type BloqueoCategoria =
  | "vacaciones"
  | "comida"
  | "capacitacion"
  | "personal"
  | "feriado"
  | "otro";

export type BloqueoMock = {
  id: string;
  inicio: string; // ISO
  fin: string; // ISO
  todoElDia: boolean;
  categoria: BloqueoCategoria;
  motivo?: string;
};

export const BLOQUEO_LABEL: Record<BloqueoCategoria, string> = {
  vacaciones: "Vacaciones",
  comida: "Comida",
  capacitacion: "Capacitación",
  personal: "Personal",
  feriado: "Feriado",
  otro: "Otro",
};

// Comida diaria de 14:00 a 15:00 (los primeros 7 días) + un par de bloqueos.
function comidasSemana(): BloqueoMock[] {
  const out: BloqueoMock[] = [];
  for (let d = 0; d <= 12; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dow = date.getDay();
    if (dow === 0) continue; // domingo cerrado
    out.push({
      id: `bl-comida-${d}`,
      inicio: atDay(d, 14, 0),
      fin: atDay(d, 15, 0),
      todoElDia: false,
      categoria: "comida",
      motivo: "Horario de comida",
    });
  }
  return out;
}

export const bloqueosSeed: BloqueoMock[] = [
  ...comidasSemana(),
  {
    id: "bl-cap-1",
    inicio: atDay(3, 16, 0),
    fin: atDay(3, 19, 0),
    todoElDia: false,
    categoria: "capacitacion",
    motivo: "Sesión académica de gastroenterología pediátrica",
  },
  {
    id: "bl-personal-1",
    inicio: atDay(5, 9, 0),
    fin: atDay(5, 11, 0),
    todoElDia: false,
    categoria: "personal",
    motivo: "Procedimientos en hospital",
  },
];
