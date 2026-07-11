import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { citasMock, type CitaMock } from "@/lib/mock";
import {
  conversacionesSeed,
  mensajesSeed,
  eventosSeed,
  type ConversacionMock,
  type MensajeMock,
  type EventoMock,
} from "@/lib/data/conversaciones";
import { listaEsperaSeed, type ListaEsperaMock } from "@/lib/data/listaEspera";
import {
  notificacionesSeed,
  type NotificacionMock,
} from "@/lib/data/notificaciones";
import { serviciosSeed, type ServicioFull } from "@/lib/data/servicios";
import { horariosSeed, type HorarioRango } from "@/lib/data/horarios";
import { configSeed, type ClinicConfig } from "@/lib/data/config";
import { bloqueosSeed, type BloqueoMock } from "@/lib/data/bloqueos";
import { nowISO } from "@/lib/data/time";

// ===========================================================================
// Store único de la demo. Sin backend: seeds + persistencia en localStorage.
// Provisto en la raíz de la app (main.tsx) para que sitio público y panel
// compartan estado (una cita agendada desde el sitio aparece en el panel).
// ===========================================================================

export type CitaSource = "web" | "whatsapp" | "telefono" | "manual";

export type CitaFull = CitaMock & {
  source: CitaSource;
  referenceCode: string;
  monto?: number;
  tutorNombre?: string;
  pacienteNombre?: string; // para citas de leads sin expediente
};

const STORAGE_KEY = "gastrokids:clinic:v3";

type ClinicState = {
  citas: CitaFull[];
  bloqueos: BloqueoMock[];
  conversaciones: ConversacionMock[];
  mensajes: MensajeMock[];
  eventos: EventoMock[];
  listaEspera: ListaEsperaMock[];
  notificaciones: NotificacionMock[];
  servicios: ServicioFull[];
  horarios: HorarioRango[];
  config: ClinicConfig;
};

const SOURCE_BY_INDEX: CitaSource[] = ["web", "whatsapp", "telefono", "manual"];

function seedState(): ClinicState {
  const citas: CitaFull[] = citasMock.map((c, i) => ({
    ...c,
    source: SOURCE_BY_INDEX[i % 4],
    referenceCode: `GK-${10500 + i}`,
  }));
  return {
    citas,
    bloqueos: bloqueosSeed.map((b) => ({ ...b })),
    conversaciones: conversacionesSeed.map((c) => ({ ...c })),
    mensajes: mensajesSeed.map((m) => ({ ...m })),
    eventos: eventosSeed.map((e) => ({ ...e })),
    listaEspera: listaEsperaSeed.map((l) => ({ ...l })),
    notificaciones: notificacionesSeed.map((n) => ({ ...n })),
    servicios: serviciosSeed.map((s) => ({ ...s })),
    horarios: horariosSeed.map((h) => ({ ...h })),
    config: JSON.parse(JSON.stringify(configSeed)) as ClinicConfig,
  };
}

function readState(): ClinicState {
  const base = seedState();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<ClinicState>;
    // Merge poco estricto: usa lo persistido si existe, si no el seed.
    return {
      citas: parsed.citas ?? base.citas,
      bloqueos: parsed.bloqueos ?? base.bloqueos,
      conversaciones: parsed.conversaciones ?? base.conversaciones,
      mensajes: parsed.mensajes ?? base.mensajes,
      eventos: parsed.eventos ?? base.eventos,
      listaEspera: parsed.listaEspera ?? base.listaEspera,
      notificaciones: parsed.notificaciones ?? base.notificaciones,
      servicios: parsed.servicios ?? base.servicios,
      horarios: parsed.horarios ?? base.horarios,
      config: parsed.config ?? base.config,
    };
  } catch {
    return base;
  }
}

type ClinicStoreValue = ClinicState & {
  // Citas
  addCita: (cita: CitaFull) => void;
  updateCita: (id: string, patch: Partial<CitaFull>) => void;
  getCita: (id: string) => CitaFull | undefined;
  // Bloqueos
  addBloqueo: (b: BloqueoMock) => void;
  removeBloqueo: (id: string) => void;
  // Conversaciones
  enviarMensaje: (
    conversacionId: string,
    texto: string,
    autorNombre?: string,
  ) => void;
  marcarConversacionLeida: (conversacionId: string) => void;
  toggleModoConversacion: (conversacionId: string) => void;
  togglePinConversacion: (conversacionId: string) => void;
  marcarMensajeAtendido: (mensajeId: string) => void;
  // Lista de espera
  addEspera: (e: ListaEsperaMock) => void;
  updateEspera: (id: string, patch: Partial<ListaEsperaMock>) => void;
  // Notificaciones
  addNotificacion: (n: NotificacionMock) => void;
  marcarNotifLeida: (id: string) => void;
  marcarTodasNotifLeidas: () => void;
  // Servicios
  addServicio: (s: ServicioFull) => void;
  updateServicio: (id: string, patch: Partial<ServicioFull>) => void;
  toggleServicio: (id: string) => void;
  // Horarios
  addHorario: (h: HorarioRango) => void;
  updateHorario: (id: string, patch: Partial<HorarioRango>) => void;
  removeHorario: (id: string) => void;
  // Config
  updateConfig: (patch: Partial<ClinicConfig>) => void;
  // Demo
  resetDemo: () => void;
};

const Ctx = createContext<ClinicStoreValue | null>(null);

export function ClinicStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClinicState>(() => readState());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota / modo privado: estado sólo en memoria
    }
  }, [state]);

  const patch = useCallback(
    (fn: (s: ClinicState) => Partial<ClinicState>) =>
      setState((prev) => ({ ...prev, ...fn(prev) })),
    [],
  );

  // ---- Citas -------------------------------------------------------------
  const addCita = useCallback(
    (cita: CitaFull) => patch((s) => ({ citas: [...s.citas, cita] })),
    [patch],
  );
  const updateCita = useCallback(
    (id: string, p: Partial<CitaFull>) =>
      patch((s) => ({
        citas: s.citas.map((c) => (c.id === id ? { ...c, ...p } : c)),
      })),
    [patch],
  );
  const getCita = useCallback(
    (id: string) => state.citas.find((c) => c.id === id),
    [state.citas],
  );

  // ---- Bloqueos ----------------------------------------------------------
  const addBloqueo = useCallback(
    (b: BloqueoMock) => patch((s) => ({ bloqueos: [...s.bloqueos, b] })),
    [patch],
  );
  const removeBloqueo = useCallback(
    (id: string) =>
      patch((s) => ({ bloqueos: s.bloqueos.filter((b) => b.id !== id) })),
    [patch],
  );

  // ---- Conversaciones ----------------------------------------------------
  const enviarMensaje = useCallback(
    (conversacionId: string, texto: string, autorNombre = "Recepción") => {
      const nuevo: MensajeMock = {
        id: `m-${Date.now()}`,
        conversacionId,
        direccion: "saliente",
        autor: "staff",
        autorNombre,
        texto,
        fecha: nowISO(),
      };
      patch((s) => ({
        mensajes: [...s.mensajes, nuevo],
        conversaciones: s.conversaciones.map((c) =>
          c.id === conversacionId ? { ...c, noLeidos: 0 } : c,
        ),
      }));
    },
    [patch],
  );
  const marcarConversacionLeida = useCallback(
    (conversacionId: string) =>
      patch((s) => ({
        conversaciones: s.conversaciones.map((c) =>
          c.id === conversacionId ? { ...c, noLeidos: 0 } : c,
        ),
      })),
    [patch],
  );
  const toggleModoConversacion = useCallback(
    (conversacionId: string) =>
      patch((s) => ({
        conversaciones: s.conversaciones.map((c) =>
          c.id === conversacionId
            ? { ...c, modo: c.modo === "bot" ? "humano" : "bot" }
            : c,
        ),
      })),
    [patch],
  );
  const togglePinConversacion = useCallback(
    (conversacionId: string) =>
      patch((s) => ({
        conversaciones: s.conversaciones.map((c) =>
          c.id === conversacionId ? { ...c, anclado: !c.anclado } : c,
        ),
      })),
    [patch],
  );
  const marcarMensajeAtendido = useCallback(
    (mensajeId: string) =>
      patch((s) => ({
        mensajes: s.mensajes.map((m) =>
          m.id === mensajeId ? { ...m, atendido: true } : m,
        ),
      })),
    [patch],
  );

  // ---- Lista de espera ---------------------------------------------------
  const addEspera = useCallback(
    (e: ListaEsperaMock) => patch((s) => ({ listaEspera: [e, ...s.listaEspera] })),
    [patch],
  );
  const updateEspera = useCallback(
    (id: string, p: Partial<ListaEsperaMock>) =>
      patch((s) => ({
        listaEspera: s.listaEspera.map((e) =>
          e.id === id ? { ...e, ...p } : e,
        ),
      })),
    [patch],
  );

  // ---- Notificaciones ----------------------------------------------------
  const addNotificacion = useCallback(
    (n: NotificacionMock) =>
      patch((s) => ({ notificaciones: [n, ...s.notificaciones] })),
    [patch],
  );
  const marcarNotifLeida = useCallback(
    (id: string) =>
      patch((s) => ({
        notificaciones: s.notificaciones.map((n) =>
          n.id === id ? { ...n, leida: true } : n,
        ),
      })),
    [patch],
  );
  const marcarTodasNotifLeidas = useCallback(
    () =>
      patch((s) => ({
        notificaciones: s.notificaciones.map((n) => ({ ...n, leida: true })),
      })),
    [patch],
  );

  // ---- Servicios ---------------------------------------------------------
  const addServicio = useCallback(
    (svc: ServicioFull) => patch((s) => ({ servicios: [...s.servicios, svc] })),
    [patch],
  );
  const updateServicio = useCallback(
    (id: string, p: Partial<ServicioFull>) =>
      patch((s) => ({
        servicios: s.servicios.map((svc) =>
          svc.id === id ? { ...svc, ...p } : svc,
        ),
      })),
    [patch],
  );
  const toggleServicio = useCallback(
    (id: string) =>
      patch((s) => ({
        servicios: s.servicios.map((svc) =>
          svc.id === id ? { ...svc, activo: !svc.activo } : svc,
        ),
      })),
    [patch],
  );

  // ---- Horarios ----------------------------------------------------------
  const addHorario = useCallback(
    (h: HorarioRango) => patch((s) => ({ horarios: [...s.horarios, h] })),
    [patch],
  );
  const updateHorario = useCallback(
    (id: string, p: Partial<HorarioRango>) =>
      patch((s) => ({
        horarios: s.horarios.map((h) => (h.id === id ? { ...h, ...p } : h)),
      })),
    [patch],
  );
  const removeHorario = useCallback(
    (id: string) =>
      patch((s) => ({ horarios: s.horarios.filter((h) => h.id !== id) })),
    [patch],
  );

  // ---- Config ------------------------------------------------------------
  const updateConfig = useCallback(
    (p: Partial<ClinicConfig>) =>
      patch((s) => ({ config: { ...s.config, ...p } })),
    [patch],
  );

  const resetDemo = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState(seedState());
  }, []);

  const value = useMemo<ClinicStoreValue>(
    () => ({
      ...state,
      addCita,
      updateCita,
      getCita,
      addBloqueo,
      removeBloqueo,
      enviarMensaje,
      marcarConversacionLeida,
      toggleModoConversacion,
      togglePinConversacion,
      marcarMensajeAtendido,
      addEspera,
      updateEspera,
      addNotificacion,
      marcarNotifLeida,
      marcarTodasNotifLeidas,
      addServicio,
      updateServicio,
      toggleServicio,
      addHorario,
      updateHorario,
      removeHorario,
      updateConfig,
      resetDemo,
    }),
    [
      state,
      addCita,
      updateCita,
      getCita,
      addBloqueo,
      removeBloqueo,
      enviarMensaje,
      marcarConversacionLeida,
      toggleModoConversacion,
      togglePinConversacion,
      marcarMensajeAtendido,
      addEspera,
      updateEspera,
      addNotificacion,
      marcarNotifLeida,
      marcarTodasNotifLeidas,
      addServicio,
      updateServicio,
      toggleServicio,
      addHorario,
      updateHorario,
      removeHorario,
      updateConfig,
      resetDemo,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClinic(): ClinicStoreValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useClinic must be used within ClinicStoreProvider");
  }
  return ctx;
}
