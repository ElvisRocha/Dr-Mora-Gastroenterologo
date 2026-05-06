import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/cn";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Idioma"
    >
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors duration-200",
          lang === "es"
            ? "bg-navy text-offwhite"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors duration-200",
          lang === "en"
            ? "bg-navy text-offwhite"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
    </div>
  );
}
