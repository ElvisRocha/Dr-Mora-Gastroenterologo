import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Heart,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import logoUrl from "@/assets/logo.png";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.85a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.28z" />
    </svg>
  );
}

export function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  const socialItems = [
    { href: t.footer.social.instagram, label: "Instagram", Icon: Instagram },
    { href: t.footer.social.facebook, label: "Facebook", Icon: Facebook },
    { href: t.footer.social.tiktok, label: "TikTok", Icon: null },
  ];

  return (
    <footer className="border-t border-border bg-navy text-offwhite">
      <div className="container-wide grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex w-fit flex-col items-center leading-none">
            <img
              src={logoUrl}
              alt="Gastro Kids · Dr. Alfredo Mora"
              className="h-11 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-offwhite/60">
              Dr. Alfredo Mora
            </span>
          </div>

          <p className="mt-6 max-w-md font-display text-2xl leading-tight text-offwhite/95">
            {t.footer.copy}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-offwhite/70">
            {t.footer.about}
          </p>

          <div className="mt-8 flex items-center gap-3">
            {socialItems.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-offwhite/15 bg-offwhite/5 text-offwhite transition-all duration-200 hover:border-leaf hover:bg-leaf hover:text-offblack"
              >
                {Icon ? (
                  <Icon size={16} strokeWidth={1.6} />
                ) : (
                  <TikTokIcon size={16} />
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="md:self-start">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-offwhite/60">
            {t.footer.contact.titulo}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            {t.footer.contact.phones.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Phone size={14} strokeWidth={1.6} className="mt-1 shrink-0 text-leaf" />
                <a
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="text-offwhite/85 underline-offset-4 hover:text-offwhite hover:underline"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <Mail size={14} strokeWidth={1.6} className="mt-1 shrink-0 text-leaf" />
              <a
                href={`mailto:${t.footer.contact.email}`}
                className="text-offwhite/85 underline-offset-4 hover:text-offwhite hover:underline"
              >
                {t.footer.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={14} strokeWidth={1.6} className="mt-1 shrink-0 text-leaf" />
              <span className="text-offwhite/85">{t.footer.contact.address}</span>
            </li>
          </ul>
        </div>

        <div className="md:self-start">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-offwhite/60">
            {t.footer.hours.titulo}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            {t.footer.hours.items.map((it) => (
              <li key={it.dia} className="flex items-start gap-3">
                <Clock size={14} strokeWidth={1.6} className="mt-1 shrink-0 text-leaf" />
                <div className="flex flex-col">
                  <span className="font-medium text-offwhite/90">{it.dia}</span>
                  <span className="text-xs text-offwhite/60">{it.horario}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-offwhite/10">
        <div className="container-wide flex flex-col items-start justify-between gap-3 py-6 text-xs text-offwhite/60 md:flex-row md:items-center">
          <span>
            © {year} Dr. Alfredo Mora{" "}
            <span className="mx-2 text-offwhite/30">•</span> Gastro Kids.{" "}
            {t.footer.derechos}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {t.footer.madeBy}
            <Heart
              size={12}
              strokeWidth={2}
              className="inline-block animate-pulse fill-current align-middle"
              aria-label={lang === "es" ? "amor" : "love"}
            />
            {lang === "es" ? "por" : "by"}{" "}
            <a
              href="#"
              className="font-medium text-offwhite/85 underline-offset-4 hover:text-offwhite hover:underline"
            >
              {t.footer.studio}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
