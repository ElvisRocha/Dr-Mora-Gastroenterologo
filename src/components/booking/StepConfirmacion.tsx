import {
  Calendar,
  Clock as ClockIcon,
  Mail,
  MessageSquare,
  Phone,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { serviciosMock } from "@/lib/mock";
import type { BookingPayload } from "@/lib/schemas/bookingSchema";

type StepConfirmacionData = Partial<Omit<BookingPayload, "tutor" | "paciente">> & {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
};

export function StepConfirmacion({
  data,
  esMayorDeEdad,
}: {
  data: StepConfirmacionData;
  esMayorDeEdad: boolean;
}) {
  const { t, lang } = useLang();
  const servicio = t.servicios.items.find((s) => s.slug === data.servicioSlug);
  const servicioMeta = serviciosMock.find((m) => m.slug === data.servicioSlug);

  const fechaLegible = data.fecha
    ? new Intl.DateTimeFormat(lang === "es" ? "es-CR" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(data.fecha))
    : "";

  const pacienteNombre = data.paciente
    ? `${data.paciente.nombre ?? ""} ${data.paciente.apellidoPaterno ?? ""} ${data.paciente.apellidoMaterno ?? ""}`.trim()
    : "";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
            <Stethoscope size={18} strokeWidth={1.75} />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t.servicios.eyebrow}
            </p>
            <h3 className="mt-1 font-semibold text-foreground">
              {servicio?.nombre ?? "—"}
            </h3>
            {servicioMeta?.duracion ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {servicioMeta.duracion} min
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
            <Calendar size={18} strokeWidth={1.75} />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {lang === "es" ? "Fecha y hora" : "Date & time"}
            </p>
            <p className="mt-1 font-medium capitalize text-foreground">
              {fechaLegible || "—"}
            </p>
            {data.hora ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                <ClockIcon size={14} strokeWidth={1.75} />
                {data.hora}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
            <User size={18} strokeWidth={1.75} />
          </span>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t.booking.datosPaciente}
              </p>
              <p className="mt-1 font-medium text-foreground">
                {pacienteNombre || "—"}
              </p>
            </div>
            {esMayorDeEdad ? (
              <>
                {data.tutor?.telefono ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} strokeWidth={1.75} />
                    {data.tutor.telefono}
                  </div>
                ) : null}
                {data.tutor?.email ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} strokeWidth={1.75} />
                    {data.tutor.email}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {!esMayorDeEdad ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
              <Users size={18} strokeWidth={1.75} />
            </span>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t.booking.datosTutor}
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {data.tutor
                    ? `${data.tutor.nombre ?? ""} ${data.tutor.apellidos ?? ""}`.trim() ||
                      "—"
                    : "—"}
                </p>
              </div>
              {data.tutor?.telefono ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} strokeWidth={1.75} />
                  {data.tutor.telefono}
                </div>
              ) : null}
              {data.tutor?.email ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} strokeWidth={1.75} />
                  {data.tutor.email}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {data.motivo ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
              <MessageSquare size={18} strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t.booking.motivoConsulta}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {data.motivo}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <p className="pt-2 text-center text-xs text-muted-foreground">
        {lang === "es"
          ? "Al confirmar aceptas el aviso de privacidad. Recibirás confirmación por correo y WhatsApp."
          : "By confirming you accept our privacy notice. You will receive confirmation by email and WhatsApp."}
      </p>
    </div>
  );
}
