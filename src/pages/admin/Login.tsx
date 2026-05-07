import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import logoUrl from "@/assets/logo.png";

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin/dashboard";

  const [email, setEmail] = useState("admin@gastrokids.mx");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:text-center">
          <img src={logoUrl} alt="Gastro Kids" className="h-[103px] w-auto" />
          <h1 className="mt-8 whitespace-nowrap font-display text-fluid-h2 font-semibold leading-tight text-navy">
            Acceso al sistema clínico
          </h1>
          <p className="mt-4 max-w-[26rem] text-sm leading-relaxed text-muted-foreground">
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  title={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.75} />
                  ) : (
                    <Eye size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
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
        </form>
      </div>
    </section>
  );
}
