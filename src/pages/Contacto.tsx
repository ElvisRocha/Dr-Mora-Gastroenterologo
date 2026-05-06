import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Button, ButtonAnchor } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { whatsappLink } from "@/lib/mock";

type Status = "idle" | "submitting" | "success" | "error";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contacto() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.07 });
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // TODO: integrar con webhook de n8n cuando esté disponible.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <h1 className="font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
            {t.contacto.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.contacto.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          <div
            data-reveal
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-navy">
              {t.contacto.formTitle}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-1 flex-col gap-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.contacto.fullName} required>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder={t.contacto.fullNamePlaceholder}
                    required
                  />
                </Field>
                <Field label={t.contacto.email} required>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder={t.contacto.emailPlaceholder}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t.contacto.phone}>
                  <Input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder={t.contacto.phonePlaceholder}
                  />
                </Field>
                <Field label={t.contacto.subject} required>
                  <Input
                    name="subject"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder={t.contacto.subjectPlaceholder}
                    required
                  />
                </Field>
              </div>

              <Field label={t.contacto.message} required>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder={t.contacto.messagePlaceholder}
                  rows={7}
                  className="min-h-[180px]"
                  required
                />
              </Field>

              {status === "success" && (
                <div className="flex items-start gap-2 rounded-2xl border border-leaf/30 bg-leaf/10 p-3 text-sm text-foreground">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-leaf"
                  />
                  <div>
                    <div className="font-medium">{t.contacto.success}</div>
                    <div className="text-muted-foreground">
                      {t.contacto.successDesc}
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-2xl border border-coral/30 bg-coral/10 p-3 text-sm text-foreground">
                  {t.contacto.error}
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                {t.contacto.helper}
              </p>

              <Button
                type="submit"
                size="lg"
                className="mt-auto w-full"
                disabled={status === "submitting"}
              >
                <Send size={16} strokeWidth={1.75} />
                {status === "submitting"
                  ? t.contacto.sending
                  : t.contacto.send}
              </Button>
            </form>
          </div>

          <div
            data-reveal
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-navy">
              {t.contacto.infoTitle}
            </h2>

            <ul className="mt-6 space-y-6">
              <ContactRow icon={<MapPin size={18} strokeWidth={1.75} />} label={t.contacto.addressLabel}>
                <p className="text-sm text-muted-foreground">
                  {t.footer.contact.address}
                </p>
              </ContactRow>

              <ContactRow icon={<Phone size={18} strokeWidth={1.75} />} label={t.contacto.phoneLabel}>
                <ul className="space-y-1">
                  {t.footer.contact.phones.map((p) => (
                    <li key={p}>
                      <a
                        href={`tel:${p.replace(/\s/g, "")}`}
                        className="text-sm text-navy underline-offset-4 hover:underline"
                      >
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </ContactRow>

              <ContactRow icon={<Mail size={18} strokeWidth={1.75} />} label={t.contacto.emailLabel}>
                <a
                  href={`mailto:${t.footer.contact.email}`}
                  className="text-sm text-navy underline-offset-4 hover:underline"
                >
                  {t.footer.contact.email}
                </a>
              </ContactRow>

              <ContactRow icon={<Clock size={18} strokeWidth={1.75} />} label={t.contacto.hoursLabel}>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {t.footer.hours.items.map((h) => (
                    <li key={h.dia} className="flex flex-wrap gap-x-2">
                      <span className="font-medium text-foreground">{h.dia}</span>
                      <span>{h.horario}</span>
                    </li>
                  ))}
                </ul>
              </ContactRow>
            </ul>

            <div className="mt-auto border-t border-border pt-6">
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t.contacto.whatsappPrompt}
              </p>
              <ButtonAnchor
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <MessageCircle size={18} strokeWidth={1.75} />
                {t.contacto.whatsappCta}
              </ButtonAnchor>
            </div>
          </div>
        </div>

        <div
          data-reveal
          className="mx-auto mt-12 max-w-6xl rounded-3xl border border-border bg-muted/40 p-6 shadow-soft md:p-8 lg:mt-16"
        >
          <h2 className="text-center font-display text-2xl font-semibold text-navy">
            {t.contacto.locationTitle}
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <iframe
              title="Mapa Gastro Kids"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-99.1900%2C19.4250%2C-99.1500%2C19.4450&amp;layer=mapnik"
              className="h-[320px] w-full md:h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="mb-1 text-sm font-semibold text-foreground">{label}</h3>
        {children}
      </div>
    </li>
  );
}
