import { BookingWizard } from "@/components/booking/BookingWizard";
import { useLang } from "@/contexts/LanguageContext";

export default function AgendarCita() {
  const { t } = useLang();
  return (
    <section className="py-16 lg:py-24">
      <div className="container-narrow">
        <div className="text-center">
          <span className="eyebrow">{t.nav.agendarCita}</span>
          <h1 className="mt-5 font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
            {t.booking.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{t.booking.subtitle}</p>
        </div>
        <div className="mt-12">
          <BookingWizard />
        </div>
      </div>
    </section>
  );
}
