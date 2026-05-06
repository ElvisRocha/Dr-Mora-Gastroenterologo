import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import logoUrl from "@/assets/logo.png";

export default function Login() {
  const { user, signIn, isMock } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin/dashboard";

  const [email, setEmail] = useState("admin@gastrokids.mx");
  const [password, setPassword] = useState("admin123");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Es necesario escribir un correo");
      return;
    }
    if (!password) {
      setPasswordError("Es necesario escribir una contraseña");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(trimmedEmail, password);
      toast.success("Sesión iniciada");
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setPasswordError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-leaf/15 via-background to-navy/10 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-elevated">
        <div className="flex flex-col items-center">
          <img
            src={logoUrl}
            alt="Gastro Kids · Dr. Alfredo Mora"
            className="h-20 w-auto"
          />
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Panel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Mail size={16} strokeWidth={1.75} className="text-muted-foreground" />
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErrors();
              }}
              placeholder="doctor@gastrokids.mx"
              className="h-12"
              autoComplete="email"
              aria-invalid={!!emailError}
            />
            {emailError ? (
              <p className="mt-1 text-xs text-coral">{emailError}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Lock size={16} strokeWidth={1.75} className="text-muted-foreground" />
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors();
              }}
              placeholder="••••••••"
              className="h-12"
              autoComplete="current-password"
              aria-invalid={!!passwordError}
            />
            {passwordError ? (
              <p className="mt-1 text-xs text-coral">{passwordError}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            Iniciar sesión
          </Button>
        </form>

        {isMock ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Modo demo</strong> — Supabase no
            está configurado.
            <ul className="mt-2 space-y-0.5 font-mono text-[11px]">
              <li>admin@gastrokids.mx · admin123</li>
              <li>dr.mora@gastrokids.mx · doctor123</li>
              <li>secretaria@gastrokids.mx · sec123</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
