import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useLang } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <section className="container-narrow flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-6 font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
        {lang === "es"
          ? "No encontramos esta página"
          : "We couldn't find this page"}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        {lang === "es"
          ? "El enlace puede haber cambiado o la página fue movida."
          : "The link may have changed or the page was moved."}
      </p>
      <ButtonLink to="/" className="mt-8">
        <ArrowLeft size={16} strokeWidth={1.75} />
        {lang === "es" ? "Volver al inicio" : "Back to home"}
      </ButtonLink>
    </section>
  );
}
