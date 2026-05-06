import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import logoUrl from "@/assets/logo.png";

export default function Login() {
  const { user, signIn, isMock } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin/dashboard";

  const [email, setEmail] = useState("admin@gastrokids.mx");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Sesión iniciada");
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center bg-muted/40 py-16">
      <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <img src={logoUrl} alt="Gastro Kids" className="h-12 w-auto" />
          <h1 className="mt-8 max-w-sm font-display text-fluid-h2 font-semibold leading-tight text-navy">
            Acceso al sistema clínico
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Solo personal autorizado. Si tienes problemas para acceder, contacta al administrador del consultorio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-8 shadow-soft"
        >
          <h2 className="font-display text-2xl font-semibold text-navy">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Usa tus credenciales del consultorio.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Correo" required>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Contraseña" required>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </div>

          <Button type="submit" className="mt-8 w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} strokeWidth={1.75} />
            )}
            Entrar
          </Button>

          {isMock ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Modo demo</strong> — Supabase no está configurado.
              <ul className="mt-2 space-y-0.5 font-mono text-[11px]">
                <li>admin@gastrokids.mx · admin123</li>
                <li>dr.mora@gastrokids.mx · doctor123</li>
                <li>secretaria@gastrokids.mx · sec123</li>
              </ul>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
