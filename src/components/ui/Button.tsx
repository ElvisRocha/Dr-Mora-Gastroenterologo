import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "subtle";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-navy text-offwhite hover:bg-navy/90 active:translate-y-px shadow-soft",
  secondary:
    "bg-leaf text-offblack hover:bg-leaf/90 active:translate-y-px shadow-soft",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
  outline:
    "border border-border bg-card text-foreground hover:border-navy/40 hover:bg-muted/40",
  subtle:
    "bg-muted text-foreground hover:bg-muted/70",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonOwnProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

type ButtonLinkProps = LinkProps & ButtonOwnProps & { className?: string };

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
}

type ExternalButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonOwnProps;

export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ExternalButtonProps) {
  return (
    <a
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
}
