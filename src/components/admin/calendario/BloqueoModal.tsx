import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useClinic } from "@/store/clinicStore";
import {
  BLOQUEO_LABEL,
  type BloqueoCategoria,
  type BloqueoMock,
} from "@/lib/data/bloqueos";

export function BloqueoModal({
  open,
  onClose,
  defaultDate,
  bloqueo,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
  /** Si se pasa, el modal edita el bloqueo existente en lugar de crear uno. */
  bloqueo?: BloqueoMock | null;
}) {
  const { addBloqueo, updateBloqueo } = useClinic();
  const editando = !!bloqueo;
  const [fecha, setFecha] = useState("");
  const [inicio, setInicio] = useState("14:00");
  const [fin, setFin] = useState("15:00");
  const [todoElDia, setTodoElDia] = useState(false);
  const [categoria, setCategoria] = useState<BloqueoCategoria>("personal");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (!open) return;
    if (bloqueo) {
      const bi = new Date(bloqueo.inicio);
      const bf = new Date(bloqueo.fin);
      setFecha(format(bi, "yyyy-MM-dd"));
      setInicio(format(bi, "HH:mm"));
      setFin(format(bf, "HH:mm"));
      setTodoElDia(bloqueo.todoElDia);
      setCategoria(bloqueo.categoria);
      setMotivo(
        bloqueo.motivo && bloqueo.motivo !== BLOQUEO_LABEL[bloqueo.categoria]
          ? bloqueo.motivo
          : "",
      );
    } else {
      setFecha(format(defaultDate ?? new Date(), "yyyy-MM-dd"));
      setInicio("14:00");
      setFin("15:00");
      setTodoElDia(false);
      setCategoria("personal");
      setMotivo("");
    }
  }, [open, defaultDate, bloqueo]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) {
      toast.error("Selecciona una fecha");
      return;
    }
    const d = new Date(fecha);
    const start = new Date(d);
    const end = new Date(d);
    if (todoElDia) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 0, 0);
    } else {
      const [hi, mi] = inicio.split(":").map(Number);
      const [hf, mf] = fin.split(":").map(Number);
      start.setHours(hi, mi, 0, 0);
      end.setHours(hf, mf, 0, 0);
      if (end <= start) {
        toast.error("La hora de fin debe ser mayor a la de inicio");
        return;
      }
    }
    const datos = {
      inicio: start.toISOString(),
      fin: end.toISOString(),
      todoElDia,
      categoria,
      motivo: motivo.trim() || BLOQUEO_LABEL[categoria],
    };
    if (bloqueo) {
      updateBloqueo(bloqueo.id, datos);
      toast.success("Bloqueo actualizado", {
        description: `${BLOQUEO_LABEL[categoria]} · ${format(start, "dd/MM")}`,
      });
    } else {
      addBloqueo({ id: `bl-${Date.now()}`, ...datos });
      toast.success("Horario bloqueado", {
        description: `${BLOQUEO_LABEL[categoria]} · ${format(start, "dd/MM")}`,
      });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? "Editar bloqueo" : "Bloquear horario"}
      description="El tiempo bloqueado no estará disponible para agendar."
      size="md"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Fecha" required>
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={todoElDia}
            onChange={(e) => setTodoElDia(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-navy"
          />
          <span className="text-sm text-foreground">Todo el día</span>
        </label>
        {!todoElDia ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Desde">
              <Input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} step={900} />
            </Field>
            <Field label="Hasta">
              <Input type="time" value={fin} onChange={(e) => setFin(e.target.value)} step={900} />
            </Field>
          </div>
        ) : null}
        <Field label="Categoría">
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as BloqueoCategoria)}
          >
            {(Object.keys(BLOQUEO_LABEL) as BloqueoCategoria[]).map((c) => (
              <option key={c} value={c}>
                {BLOQUEO_LABEL[c]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Motivo (opcional)">
          <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej. Procedimientos en hospital" />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{editando ? "Guardar cambios" : "Bloquear"}</Button>
        </div>
      </form>
    </Modal>
  );
}
