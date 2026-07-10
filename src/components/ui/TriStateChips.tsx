import { cn } from "@/lib/cn";
import type { TriState } from "@/lib/mock";

const chipBase =
  "inline-flex h-7 items-center justify-center rounded-full border px-3 text-xs font-semibold leading-none transition-colors";
const chipIdle =
  "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground";
const chipYes = "border-leaf/40 bg-leaf/15 text-leaf";
const chipNo = "border-coral/45 bg-coral/15 text-coral";

/**
 * Chips Sí / No con tres estados. El estado nulo (ningún chip activo) solo se
 * alcanza como valor inicial: al elegir un chip se alterna Sí/No y ya no vuelve
 * a null desde la interfaz.
 */
export function TriStateChips({
  value,
  onChange,
  className,
}: {
  value: TriState | undefined;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex gap-1.5", className)}>
      <button
        type="button"
        aria-pressed={value === true}
        onClick={() => onChange(true)}
        className={cn(chipBase, value === true ? chipYes : chipIdle)}
      >
        Sí
      </button>
      <button
        type="button"
        aria-pressed={value === false}
        onClick={() => onChange(false)}
        className={cn(chipBase, value === false ? chipNo : chipIdle)}
      >
        No
      </button>
    </div>
  );
}
