import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import {
  CATEGORIA_LABEL,
  type ServicioCategoria,
  type ServicioFull,
} from "@/lib/data/servicios";

const EMPTY: ServicioFull = {
  id: "",
  nombre: "",
  nombreEn: "",
  categoria: "consultas",
  duracion: "30 min",
  duracionMin: 30,
  precio: 0,
  descripcion: "",
  icon: "stethoscope",
  activo: true,
  orden: 99,
  requiereSecretaria: false,
};

function slugify(name: string, existing: string[]): string {
  let base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "servicio";
  let slug = base;
  let i = 2;
  while (existing.includes(slug)) slug = `${base}-${i++}`;
  return slug;
}

export function ServicioFormModal({
  open,
  onClose,
  servicio,
  existingIds,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  servicio: ServicioFull | null;
  existingIds: string[];
  onSave: (svc: ServicioFull, isNew: boolean) => void;
}) {
  const [form, setForm] = useState<ServicioFull>(EMPTY);

  useEffect(() => {
    setForm(servicio ?? EMPTY);
  }, [servicio, open]);

  const set = <K extends keyof ServicioFull>(k: K, v: ServicioFull[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    const isNew = !servicio;
    const svc: ServicioFull = {
      ...form,
      id: servicio ? form.id : slugify(form.nombre, existingIds),
      nombreEn: form.nombreEn || form.nombre,
      duracion: `${form.duracionMin} min`,
    };
    onSave(svc, isNew);
    toast.success(isNew ? "Servicio creado" : "Servicio actualizado");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={servicio ? "Editar servicio" : "Nuevo servicio"}
      size="lg"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre del servicio" required>
          <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoría">
            <Select
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value as ServicioCategoria)}
            >
              {(Object.keys(CATEGORIA_LABEL) as ServicioCategoria[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORIA_LABEL[c]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Orden">
            <Input
              type="number"
              value={form.orden}
              onChange={(e) => set("orden", Number(e.target.value))}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Duración (min)">
            <Input
              type="number"
              value={form.duracionMin}
              onChange={(e) => set("duracionMin", Number(e.target.value))}
            />
          </Field>
          <Field label="Precio (MXN)">
            <Input
              type="number"
              value={form.precio}
              onChange={(e) => set("precio", Number(e.target.value))}
            />
          </Field>
        </div>
        <Field label="Nota de precio (opcional)">
          <Input
            value={form.precioNota ?? ""}
            onChange={(e) => set("precioNota", e.target.value)}
            placeholder="Ej. No incluye honorarios de anestesiología"
          />
        </Field>
        <Field label="Descripción para familias">
          <Textarea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
          />
        </Field>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set("activo", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-navy"
            />
            <span className="text-sm text-foreground">Servicio activo</span>
          </label>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.requiereSecretaria}
              onChange={(e) => set("requiereSecretaria", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-navy"
            />
            <span className="text-sm text-foreground">
              Requiere coordinación de recepción
            </span>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{servicio ? "Guardar cambios" : "Crear servicio"}</Button>
        </div>
      </form>
    </Modal>
  );
}
