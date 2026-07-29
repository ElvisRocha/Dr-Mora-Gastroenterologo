import { useEffect, useRef } from "react";

/**
 * Autoguardado con debounce. Mientras `enabled` sea true y `formKey` cambie,
 * reprograma un guardado a los `delay` ms. Espeja `onSave` en un ref para que
 * el timer siempre use la última versión sin reprogramarse por identidad.
 */
export function useAutosave({
  enabled,
  formKey,
  onSave,
  delay = 1200,
}: {
  enabled: boolean;
  formKey: string;
  onSave: () => void;
  delay?: number;
}) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => onSaveRef.current(), delay);
    return () => clearTimeout(t);
  }, [enabled, formKey, delay]);
}
