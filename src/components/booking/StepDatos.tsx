import { useLang } from "@/contexts/LanguageContext";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import type { BookingPayload } from "@/lib/schemas/bookingSchema";

export type StepDatosMode = "adulto" | "tutor" | "paciente";

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
  mode,
  data,
  onChange,
}: {
  mode: StepDatosMode;
  data: StepDatosData;
  onChange: (patch: Patch) => void;
}) {
  const { t, lang } = useLang();
  const tutor = data.tutor ?? {};
  const paciente = data.paciente ?? {};

  if (mode === "tutor") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.booking.relacion} required>
            <Select
              value={tutor.relacion ?? ""}
              onChange={(e) =>
                onChange({
                  tutor: {
                    relacion: e.target
                      .value as BookingPayload["tutor"]["relacion"],
                  },
                })
              }
            >
              <option value="" disabled>
                — {lang === "es" ? "Selecciona" : "Select"} —
              </option>
              <option value="madre">
                {lang === "es" ? "Madre" : "Mother"}
              </option>
              <option value="padre">
                {lang === "es" ? "Padre" : "Father"}
              </option>
              <option value="abuelo">
                {lang === "es" ? "Abuelo/a" : "Grandparent"}
              </option>
              <option value="tio">
                {lang === "es" ? "Tío/a" : "Aunt/Uncle"}
              </option>
              <option value="tutor_legal">
                {lang === "es" ? "Tutor legal" : "Legal guardian"}
              </option>
              <option value="otro">
                {lang === "es" ? "Otro" : "Other"}
              </option>
            </Select>
          </Field>
          <Field label={t.booking.nombre} required>
            <Input
              value={tutor.nombre ?? ""}
              onChange={(e) => onChange({ tutor: { nombre: e.target.value } })}
            />
          </Field>
          <Field label={t.booking.apellidos} required>
            <Input
              value={tutor.apellidos ?? ""}
              onChange={(e) =>
                onChange({ tutor: { apellidos: e.target.value } })
              }
            />
          </Field>
          <Field label={t.booking.telefono} required>
            <Input
              type="tel"
              placeholder="+506 8888-8888"
              value={tutor.telefono ?? ""}
              onChange={(e) =>
                onChange({ tutor: { telefono: e.target.value } })
              }
            />
          </Field>
          <Field label={t.booking.email} className="sm:col-span-2" required>
            <Input
              type="email"
              value={tutor.email ?? ""}
              onChange={(e) => onChange({ tutor: { email: e.target.value } })}
            />
          </Field>
      </div>
    );
  }

  // mode === "paciente" or "adulto" share the patient identity block.
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.booking.nombre} required>
            <Input
              value={paciente.nombre ?? ""}
              onChange={(e) =>
                onChange({ paciente: { nombre: e.target.value } })
              }
            />
          </Field>
          <Field
            label={lang === "es" ? "Apellido paterno" : "Paternal surname"}
            required
          >
            <Input
              value={paciente.apellidoPaterno ?? ""}
              onChange={(e) =>
                onChange({ paciente: { apellidoPaterno: e.target.value } })
              }
            />
          </Field>
          <Field
            label={lang === "es" ? "Apellido materno" : "Maternal surname"}
          >
            <Input
              value={paciente.apellidoMaterno ?? ""}
              onChange={(e) =>
                onChange({ paciente: { apellidoMaterno: e.target.value } })
              }
            />
          </Field>
          <Field label={t.booking.fechaNacimiento} required>
            <Input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={paciente.fechaNacimiento ?? ""}
              onChange={(e) =>
                onChange({ paciente: { fechaNacimiento: e.target.value } })
              }
            />
          </Field>
          <Field
            label={t.booking.sexo}
            className={mode === "adulto" ? undefined : "sm:col-span-2"}
            required
          >
            <Select
              value={paciente.sexo ?? ""}
              onChange={(e) =>
                onChange({
                  paciente: {
                    sexo: e.target
                      .value as BookingPayload["paciente"]["sexo"],
                  },
                })
              }
            >
              <option value="" disabled>
                — {lang === "es" ? "Selecciona" : "Select"} —
              </option>
              <option value="masculino">
                {lang === "es" ? "Masculino" : "Male"}
              </option>
              <option value="femenino">
                {lang === "es" ? "Femenino" : "Female"}
              </option>
              <option value="intersexual">
                {lang === "es" ? "Intersexual" : "Intersex"}
              </option>
              <option value="no_especificado">
                {lang === "es" ? "Prefiero no decirlo" : "Prefer not to say"}
              </option>
            </Select>
          </Field>

          {mode === "adulto" ? (
            <>
              <Field label={t.booking.telefono} required>
                <Input
                  type="tel"
                  placeholder="+506 8888-8888"
                  value={tutor.telefono ?? ""}
                  onChange={(e) =>
                    onChange({ tutor: { telefono: e.target.value } })
                  }
                />
              </Field>
              <Field
                label={t.booking.email}
                className="sm:col-span-2"
                required
              >
                <Input
                  type="email"
                  value={tutor.email ?? ""}
                  onChange={(e) =>
                    onChange({ tutor: { email: e.target.value } })
                  }
                />
              </Field>
            </>
          ) : null}
      </div>

      <Field
        label={t.booking.motivoConsulta}
        hint={
          lang === "es"
            ? "Opcional. Describe brevemente el motivo."
            : "Optional. Briefly describe the reason."
        }
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
