import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  consultasMock,
  expedienteDefault,
  expedientesMock,
  pacientesMock,
  type ArchivoMock,
  type ConsultaMock,
  type ExpedienteMock,
  type NotaBitacoraMock,
  type PacienteMock,
} from "@/lib/mock";

const STORAGE_KEY = "gastrokids:store:v1";

export const MAX_FILE_BYTES = 500 * 1024;
export const MAX_FILES_PER_CONSULTA = 5;

type Snapshot = {
  pacienteOverrides: Record<string, Partial<PacienteMock>>;
  pacientesExtra: PacienteMock[];
  consultasExtra: ConsultaMock[];
  consultaOverrides: Record<string, Partial<ConsultaMock>>;
  expedienteOverrides: Record<string, Partial<ExpedienteMock>>;
  archivos: ArchivoMock[];
  notas: NotaBitacoraMock[];
};

const emptySnapshot: Snapshot = {
  pacienteOverrides: {},
  pacientesExtra: [],
  consultasExtra: [],
  consultaOverrides: {},
  expedienteOverrides: {},
  archivos: [],
  notas: [],
};

type StoreContextValue = {
  getPaciente: (id: string) => PacienteMock | undefined;
  listPacientes: () => PacienteMock[];
  addPaciente: (paciente: PacienteMock) => void;
  updatePaciente: (id: string, patch: Partial<PacienteMock>) => void;
  listConsultas: (pacienteId: string) => ConsultaMock[];
  getConsulta: (consultaId: string) => ConsultaMock | undefined;
  addConsulta: (consulta: ConsultaMock) => void;
  updateConsulta: (consultaId: string, patch: Partial<ConsultaMock>) => void;
  getExpediente: (pacienteId: string) => ExpedienteMock;
  updateExpediente: (pacienteId: string, patch: Partial<ExpedienteMock>) => void;

  listArchivos: (consultaId: string) => ArchivoMock[];
  addArchivo: (archivo: ArchivoMock) => void;
  removeArchivo: (id: string) => void;

  listNotas: (consultaId: string) => NotaBitacoraMock[];
  addNota: (nota: NotaBitacoraMock) => void;
  removeNota: (id: string) => void;
};

const Ctx = createContext<StoreContextValue | null>(null);

function readSnapshot(): Snapshot {
  if (typeof window === "undefined") return emptySnapshot;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot;
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    return {
      pacienteOverrides: parsed.pacienteOverrides ?? {},
      pacientesExtra: parsed.pacientesExtra ?? [],
      consultasExtra: parsed.consultasExtra ?? [],
      consultaOverrides: parsed.consultaOverrides ?? {},
      expedienteOverrides: parsed.expedienteOverrides ?? {},
      archivos: parsed.archivos ?? [],
      notas: parsed.notas ?? [],
    };
  } catch {
    return emptySnapshot;
  }
}

function writeSnapshot(snap: Snapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  } catch {
    // localStorage unavailable (private mode, quota); estado vive solo en memoria.
  }
}

function applyConsultaOverride(
  base: ConsultaMock,
  overrides: Record<string, Partial<ConsultaMock>>,
): ConsultaMock {
  const ov = overrides[base.id];
  return ov ? { ...base, ...ov } : base;
}

export function ExpedienteStoreProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(() => readSnapshot());

  useEffect(() => {
    writeSnapshot(snap);
  }, [snap]);

  const getPaciente = useCallback(
    (id: string): PacienteMock | undefined => {
      const base =
        pacientesMock.find((p) => p.id === id) ??
        snap.pacientesExtra.find((p) => p.id === id);
      if (!base) return undefined;
      const override = snap.pacienteOverrides[id];
      return override ? { ...base, ...override } : base;
    },
    [snap.pacienteOverrides, snap.pacientesExtra],
  );

  const listPacientes = useCallback((): PacienteMock[] => {
    const applyOv = (p: PacienteMock) => {
      const ov = snap.pacienteOverrides[p.id];
      return ov ? { ...p, ...ov } : p;
    };
    // Los agregados desde el formulario van primero (más recientes).
    return [...snap.pacientesExtra.map(applyOv), ...pacientesMock.map(applyOv)];
  }, [snap.pacienteOverrides, snap.pacientesExtra]);

  const addPaciente = useCallback((paciente: PacienteMock) => {
    setSnap((prev) => ({
      ...prev,
      pacientesExtra: [paciente, ...prev.pacientesExtra],
    }));
  }, []);

  const updatePaciente = useCallback(
    (id: string, patch: Partial<PacienteMock>) => {
      setSnap((prev) => ({
        ...prev,
        pacienteOverrides: {
          ...prev.pacienteOverrides,
          [id]: { ...prev.pacienteOverrides[id], ...patch },
        },
      }));
    },
    [],
  );

  const listConsultas = useCallback(
    (pacienteId: string): ConsultaMock[] => {
      return [...consultasMock, ...snap.consultasExtra]
        .filter((c) => c.pacienteId === pacienteId)
        .map((c) => applyConsultaOverride(c, snap.consultaOverrides))
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
    },
    [snap.consultasExtra, snap.consultaOverrides],
  );

  const getConsulta = useCallback(
    (consultaId: string): ConsultaMock | undefined => {
      const base =
        consultasMock.find((c) => c.id === consultaId) ??
        snap.consultasExtra.find((c) => c.id === consultaId);
      if (!base) return undefined;
      return applyConsultaOverride(base, snap.consultaOverrides);
    },
    [snap.consultasExtra, snap.consultaOverrides],
  );

  const addConsulta = useCallback((consulta: ConsultaMock) => {
    setSnap((prev) => ({
      ...prev,
      consultasExtra: [...prev.consultasExtra, consulta],
    }));
  }, []);

  const updateConsulta = useCallback(
    (consultaId: string, patch: Partial<ConsultaMock>) => {
      setSnap((prev) => {
        const inExtra = prev.consultasExtra.some((c) => c.id === consultaId);
        if (inExtra) {
          return {
            ...prev,
            consultasExtra: prev.consultasExtra.map((c) =>
              c.id === consultaId ? { ...c, ...patch } : c,
            ),
          };
        }
        return {
          ...prev,
          consultaOverrides: {
            ...prev.consultaOverrides,
            [consultaId]: {
              ...prev.consultaOverrides[consultaId],
              ...patch,
            },
          },
        };
      });
    },
    [],
  );

  const getExpediente = useCallback(
    (pacienteId: string): ExpedienteMock => {
      const base = expedientesMock[pacienteId] ?? expedienteDefault;
      const override = snap.expedienteOverrides[pacienteId];
      // Merge superficial por sección: cada pestaña editable guarda su sección
      // completa (antecedentes, perinatal, habitoDigestivo…), así que basta con
      // reemplazar las claves de primer nivel presentes en el override.
      return override ? { ...base, ...override } : base;
    },
    [snap.expedienteOverrides],
  );

  const updateExpediente = useCallback(
    (pacienteId: string, patch: Partial<ExpedienteMock>) => {
      setSnap((prev) => ({
        ...prev,
        expedienteOverrides: {
          ...prev.expedienteOverrides,
          [pacienteId]: { ...prev.expedienteOverrides[pacienteId], ...patch },
        },
      }));
    },
    [],
  );

  const listArchivos = useCallback(
    (consultaId: string): ArchivoMock[] =>
      snap.archivos
        .filter((a) => a.consultaId === consultaId)
        .sort((a, b) => +new Date(b.subidoEn) - +new Date(a.subidoEn)),
    [snap.archivos],
  );

  const addArchivo = useCallback((archivo: ArchivoMock) => {
    setSnap((prev) => ({ ...prev, archivos: [...prev.archivos, archivo] }));
  }, []);

  const removeArchivo = useCallback((id: string) => {
    setSnap((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((a) => a.id !== id),
    }));
  }, []);

  const listNotas = useCallback(
    (consultaId: string): NotaBitacoraMock[] =>
      snap.notas
        .filter((n) => n.consultaId === consultaId)
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)),
    [snap.notas],
  );

  const addNota = useCallback((nota: NotaBitacoraMock) => {
    setSnap((prev) => ({ ...prev, notas: [...prev.notas, nota] }));
  }, []);

  const removeNota = useCallback((id: string) => {
    setSnap((prev) => ({
      ...prev,
      notas: prev.notas.filter((n) => n.id !== id),
    }));
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      getPaciente,
      listPacientes,
      addPaciente,
      updatePaciente,
      listConsultas,
      getConsulta,
      addConsulta,
      updateConsulta,
      getExpediente,
      updateExpediente,
      listArchivos,
      addArchivo,
      removeArchivo,
      listNotas,
      addNota,
      removeNota,
    }),
    [
      getPaciente,
      listPacientes,
      addPaciente,
      updatePaciente,
      listConsultas,
      getConsulta,
      addConsulta,
      updateConsulta,
      getExpediente,
      updateExpediente,
      listArchivos,
      addArchivo,
      removeArchivo,
      listNotas,
      addNota,
      removeNota,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useExpedienteStore(): StoreContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useExpedienteStore must be used within ExpedienteStoreProvider",
    );
  }
  return ctx;
}

export function usePaciente(id: string) {
  const store = useExpedienteStore();
  return {
    paciente: store.getPaciente(id),
    update: (patch: Partial<PacienteMock>) => store.updatePaciente(id, patch),
  };
}

export function useConsultas(pacienteId: string) {
  const store = useExpedienteStore();
  return {
    consultas: store.listConsultas(pacienteId),
    addConsulta: (consulta: ConsultaMock) => store.addConsulta(consulta),
    updateConsulta: (consultaId: string, patch: Partial<ConsultaMock>) =>
      store.updateConsulta(consultaId, patch),
  };
}

export function useConsulta(consultaId: string | null | undefined) {
  const store = useExpedienteStore();
  return consultaId ? store.getConsulta(consultaId) : undefined;
}

export function useExpediente(pacienteId: string) {
  const store = useExpedienteStore();
  return store.getExpediente(pacienteId);
}

/** Expediente + persistencia por sección (localStorage). */
export function useExpedienteEditable(pacienteId: string) {
  const store = useExpedienteStore();
  return {
    expediente: store.getExpediente(pacienteId),
    update: (patch: Partial<ExpedienteMock>) =>
      store.updateExpediente(pacienteId, patch),
  };
}

export function useArchivos(consultaId: string) {
  const store = useExpedienteStore();
  return {
    archivos: store.listArchivos(consultaId),
    addArchivo: store.addArchivo,
    removeArchivo: store.removeArchivo,
  };
}

export function useNotas(consultaId: string) {
  const store = useExpedienteStore();
  return {
    notas: store.listNotas(consultaId),
    addNota: store.addNota,
    removeNota: store.removeNota,
  };
}
