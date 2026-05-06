import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { LangToggle } from "@/components/ui/LangToggle";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import logoUrl from "@/assets/logo.png";

export function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links: { label: string; to: string }[] = [
    { label: t.nav.inicio, to: "/" },
    { label: t.nav.sobreElDoctor, to: "/sobre-el-doctor" },
    { label: t.nav.servicios, to: "/#servicios" },
    { label: t.nav.galeria, to: "/galeria" },
    { label: t.nav.contacto, to: "/contacto" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 ease-gentle",
        scrolled
          ? "border-b border-border bg-offwhite/80 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <div className="relative flex h-16 items-center justify-between gap-4 px-6 lg:h-20">
        <Link
          to="/"
          className="relative z-10 flex flex-col items-center leading-none transition-opacity hover:opacity-80"
        >
          <img
            src={logoUrl}
            alt="Gastro Kids · Dr. Alfredo Mora"
            className="h-8 w-auto lg:h-10"
          />
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground lg:text-[10px]">
            Dr. Alfredo Mora
          </span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="Principal"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive && link.to !== "/#servicios"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 lg:gap-3">
          <LangToggle className="hidden sm:inline-flex" />
          <ButtonLink
            to="/agendar-cita"
            size="sm"
            className="hidden md:inline-flex"
          >
            {t.nav.agendarCita}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Abrir menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-offwhite lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive && link.to !== "/#servicios"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <LangToggle />
              <ButtonLink to="/agendar-cita" size="sm">
                {t.nav.agendarCita}
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
