import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "navy" | "leaf" | "teal" | "amber" | "coral" | "neutral";

const styles: Record<Variant, string> = {
  navy: "bg-navy/10 text-navy",
  leaf: "bg-leaf/15 text-leaf",
  teal: "bg-teal/15 text-teal",
  amber: "bg-amber/15 text-amber",
  coral: "bg-coral/15 text-coral",
  neutral: "bg-muted text-muted-foreground",
};

export function Badge({
  variant = "navy",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
