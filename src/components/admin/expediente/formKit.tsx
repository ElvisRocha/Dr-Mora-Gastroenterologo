import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { TriStateChips } from "@/components/ui/TriStateChips";
import { useAutosave } from "@/hooks/useAutosave";
import { useExpedienteEditable } from "@/store/expedienteStore";
import type { ExpedienteMock, TriState } from "@/lib/mock";

// ─── Estado editable de una sección del expediente ─────────────────────────
// Cada pestaña editable posee una clave de primer nivel del ExpedienteMock
// (antecedentes, perinatal, habitoDigestivo…). El hook mantiene un borrador
// local, marca "sin guardar", autoguarda con debounce y persiste la sección
// completa en el store (localStorage). Al terminar la consulta la data queda.
export function useExpedienteSection<K extends keyof ExpedienteMock>(
  pacienteId: string,
  section: K,
  initial: ExpedienteMock[K],
) {
  const { update } = useExpedienteEditable(pacienteId);
  const [form, setFormState] = useState<ExpedienteMock[K]>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const formRef = useRef(form);
  formRef.current = form;
  const savedRef = useRef(JSON.stringify(initial));
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const mountedRef = useRef(true);

  // Al cambiar de paciente recargamos la sección desde su base.
  const pidRef = useRef(pacienteId);
  useEffect(() => {
    if (pidRef.current !== pacienteId) {
      pidRef.current = pacienteId;
      setFormState(initial);
      savedRef.current = JSON.stringify(initial);
      setDirty(false);
      setSaving(false);
    }
  }, [pacienteId, initial]);

  // Flush al desmontar: si el usuario cambia de pestaña dentro de la ventana
  // de debounce, no perdemos lo tecleado (el store persiste en localStorage).
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (dirtyRef.current) {
        savedRef.current = JSON.stringify(formRef.current);
        update({ [section]: formRef.current } as Partial<ExpedienteMock>);
      }
    };
  }, [section, update]);

  const setForm = useCallback(
    (updater: (prev: ExpedienteMock[K]) => ExpedienteMock[K]) => {
      setFormState((prev) => updater(prev));
      setDirty(true);
    },
    [],
  );

  const set = useCallback(
    <F extends keyof ExpedienteMock[K]>(
      field: F,
      value: ExpedienteMock[K][F],
    ) => {
      setFormState((prev) => ({ ...prev, [field]: value }) as ExpedienteMock[K]);
      setDirty(true);
    },
    [],
  );

  const save = useCallback(() => {
    const snapshot = JSON.stringify(formRef.current);
    savedRef.current = snapshot;
    setSaving(true);
    update({ [section]: formRef.current } as Partial<ExpedienteMock>);
    // Persistencia real es síncrona (localStorage); el breve "Guardando…" es
    // cosmético y refleja la escritura, como en el consultorio de referencia.
    window.setTimeout(() => {
      if (!mountedRef.current) return;
      setSaving(false);
      if (JSON.stringify(formRef.current) === savedRef.current) setDirty(false);
    }, 450);
  }, [section, update]);

  useAutosave({
    enabled: dirty && !saving,
    formKey: JSON.stringify(form),
    onSave: save,
  });

  return { form, set, setForm, dirty, saving, save };
}

// ─── Presentación ──────────────────────────────────────────────────────────

export function Sec({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-border bg-card p-5 shadow-soft " +
        (className ?? "")
      }
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-navy">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Etiqueta + chips Sí/No con un campo de detalle debajo (¿Cuál? / ¿De qué?). */
export function ToggleCell({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: TriState | undefined;
  onChange: (v: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-tight text-foreground">
          {label}
        </span>
        <TriStateChips value={value} onChange={onChange} className="shrink-0" />
      </div>
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  );
}

/**
 * Chip Sí/No cuyo textarea de detalle solo se **muestra** cuando la respuesta
 * es "Sí"; con "No" o sin responder el textarea queda oculto. El texto ya
 * capturado se conserva en el borrador y reaparece si se vuelve a elegir "Sí".
 */
export function ToggleField({
  label,
  value,
  onChange,
  detail,
  onDetail,
  placeholder,
  minH = "min-h-[72px]",
}: {
  label: string;
  value: TriState | undefined;
  onChange: (v: boolean) => void;
  detail: string;
  onDetail: (v: string) => void;
  placeholder: string;
  minH?: string;
}) {
  const show = value === true;
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-tight text-foreground">
          {label}
        </span>
        <TriStateChips value={value} onChange={onChange} className="shrink-0" />
      </div>
      {show ? (
        <div className="animate-fade-up">
          <Textarea
            value={detail}
            onChange={(e) => onDetail(e.target.value)}
            placeholder={placeholder}
            className={minH}
          />
        </div>
      ) : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  );
}

function AutosaveStatus({ dirty, saving }: { dirty: boolean; saving: boolean }) {
  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 size={13} className="animate-spin" /> Guardando…
      </span>
    );
  }
  if (dirty) {
    return <span className="text-xs text-amber">Cambios sin guardar</span>;
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Check size={13} className="text-leaf" /> Guardado
    </span>
  );
}

/**
 * Barra de guardado que se teletransporta al pie fijo del expediente
 * (`#expediente-footer-slot`). Cada pestaña editable renderiza la suya; el
 * slot está oculto (`empty:hidden`) cuando ninguna la ocupa.
 */
export function ExpedienteFooter({
  dirty,
  saving,
  onSave,
  label,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  label: string;
}) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setSlot(document.getElementById("expediente-footer-slot"));
  }, []);
  if (!slot) return null;
  return createPortal(
    <>
      <AutosaveStatus dirty={dirty} saving={saving} />
      <Button type="button" onClick={onSave} disabled={saving}>
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Save size={14} strokeWidth={1.75} />
        )}
        Guardar {label}
      </Button>
    </>,
    slot,
  );
}
