import { useLang } from "@/contexts/LanguageContext";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import type { BookingPayload } from "@/lib/schemas/bookingSchema";

type StepDatosData = Partial<Omit<BookingPayload, "tutor" | "paciente">> & {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
};

type Patch = {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
  motivo?: string;
};

export function StepDatos({
  data,
  onChange,
}: {
  data: StepDatosData;
  onChange: (patch: Patch) => void;
}) {
  const { t, lang } = useLang();
  const t1 = data.tutor ?? {};
  const p = data.paciente ?? {};

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy">
          {t.booking.datosTutor}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label={t.booking.relacion} required>
            <Select
              value={t1.relacion ?? ""}
              onChange={(e) =>
                onChange({ tutor: { relacion: e.target.value as BookingPayload["tutor"]["relacion"] } })
              }
            >
              <option value="" disabled>
                — {lang === "es" ? "Selecciona" : "Select"} —
              </option>
              <option value="madre">{lang === "es" ? "Madre" : "Mother"}</option>
              <option value="padre">{lang === "es" ? "Padre" : "Father"}</option>
              <option value="abuelo">{lang === "es" ? "Abuelo/a" : "Grandparent"}</option>
              <option value="tio">{lang === "es" ? "Tío/a" : "Aunt/Uncle"}</option>
              <option value="tutor_legal">
                {lang === "es" ? "Tutor legal" : "Legal guardian"}
              </option>
              <option value="otro">{lang === "es" ? "Otro" : "Other"}</option>
            </Select>
          </Field>
          <Field label={t.booking.nombre} required>
            <Input
              value={t1.nombre ?? ""}
              onChange={(e) => onChange({ tutor: { nombre: e.target.value } })}
            />
          </Field>
          <Field label={t.booking.apellidos} required>
            <Input
              value={t1.apellidos ?? ""}
              onChange={(e) => onChange({ tutor: { apellidos: e.target.value } })}
            />
          </Field>
          <Field label={t.booking.telefono} required>
            <Input
              type="tel"
              placeholder="+52 55 …"
              value={t1.telefono ?? ""}
              onChange={(e) => onChange({ tutor: { telefono: e.target.value } })}
            />
          </Field>
          <Field label={t.booking.email} className="sm:col-span-2" required>
            <Input
              type="email"
              value={t1.email ?? ""}
              onChange={(e) => onChange({ tutor: { email: e.target.value } })}
            />
          </Field>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-navy">
          {t.booking.datosNino}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label={t.booking.nombre} required>
            <Input
              value={p.nombre ?? ""}
              onChange={(e) => onChange({ paciente: { nombre: e.target.value } })}
            />
          </Field>
          <Field label={lang === "es" ? "Apellido paterno" : "Paternal surname"} required>
            <Input
              value={p.apellidoPaterno ?? ""}
              onChange={(e) =>
                onChange({ paciente: { apellidoPaterno: e.target.value } })
              }
            />
          </Field>
          <Field label={lang === "es" ? "Apellido materno" : "Maternal surname"}>
            <Input
              value={p.apellidoMaterno ?? ""}
              onChange={(e) =>
                onChange({ paciente: { apellidoMaterno: e.target.value } })
              }
            />
          </Field>
          <Field label={t.booking.fechaNacimiento} required>
            <Input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={p.fechaNacimiento ?? ""}
              onChange={(e) =>
                onChange({ paciente: { fechaNacimiento: e.target.value } })
              }
            />
          </Field>
          <Field label={t.booking.sexo} className="sm:col-span-2" required>
            <Select
              value={p.sexo ?? ""}
              onChange={(e) =>
                onChange({
                  paciente: {
                    sexo: e.target.value as BookingPayload["paciente"]["sexo"],
                  },
                })
              }
            >
              <option value="" disabled>
                — {lang === "es" ? "Selecciona" : "Select"} —
              </option>
              <option value="masculino">{lang === "es" ? "Masculino" : "Male"}</option>
              <option value="femenino">{lang === "es" ? "Femenino" : "Female"}</option>
              <option value="intersexual">{lang === "es" ? "Intersexual" : "Intersex"}</option>
              <option value="no_especificado">
                {lang === "es" ? "Prefiero no decirlo" : "Prefer not to say"}
              </option>
            </Select>
          </Field>
        </div>
      </div>

      <Field
        label={t.booking.motivoConsulta}
        hint={lang === "es" ? "Opcional. Describe brevemente el motivo." : "Optional. Briefly describe the reason."}
      >
        <Textarea
          value={data.motivo ?? ""}
          onChange={(e) => onChange({ motivo: e.target.value })}
          rows={4}
        />
      </Field>
    </div>
  );
}
