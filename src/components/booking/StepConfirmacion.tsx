import { useLang } from "@/contexts/LanguageContext";
import type { BookingPayload } from "@/lib/schemas/bookingSchema";

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[180px_1fr]">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground">{value || "—"}</div>
    </div>
  );
}

type StepConfirmacionData = Partial<Omit<BookingPayload, "tutor" | "paciente">> & {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
};

export function StepConfirmacion({ data }: { data: StepConfirmacionData }) {
  const { t, lang } = useLang();
  const servicio = t.servicios.items.find((s) => s.slug === data.servicioSlug);

  const fechaLegible = data.fecha
    ? new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(data.fecha))
    : "";

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy">{t.booking.revisar}</h2>
      <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-5">
        <Row label={t.servicios.eyebrow} value={servicio?.nombre} />
        <Row label={t.booking.seleccionarFecha} value={`${fechaLegible} · ${data.hora ?? ""}`} />
        <Row
          label={t.booking.datosTutor}
          value={
            data.tutor
              ? `${data.tutor.nombre} ${data.tutor.apellidos} · ${data.tutor.telefono} · ${data.tutor.email}`
              : ""
          }
        />
        <Row
          label={t.booking.datosNino}
          value={
            data.paciente
              ? `${data.paciente.nombre} ${data.paciente.apellidoPaterno} ${data.paciente.apellidoMaterno ?? ""}`.trim()
              : ""
          }
        />
        <Row
          label={t.booking.motivoConsulta}
          value={data.motivo}
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {lang === "es"
          ? "Al confirmar aceptas el aviso de privacidad. Recibirás confirmación por correo y WhatsApp."
          : "By confirming you accept our privacy notice. You will receive confirmation by email and WhatsApp."}
      </p>
    </div>
  );
}
