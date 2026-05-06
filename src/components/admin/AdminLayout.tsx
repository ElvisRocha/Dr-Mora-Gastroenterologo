import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import logoUrl from "@/assets/logo.png";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "secretaria"] },
  { to: "/admin/pacientes", label: "Pacientes", icon: Users, roles: ["admin", "doctor", "secretaria"] },
  { to: "/admin/calendario", label: "Calendario", icon: Calendar, roles: ["admin", "doctor", "secretaria"] },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings, roles: ["admin"] },
] as const;

export function AdminLayout() {
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="grid min-h-[100dvh] grid-cols-[260px_1fr] bg-muted/40">
      <aside className="border-r border-border bg-offwhite px-4 py-6 lg:px-6">
        <div className="flex items-center gap-2 px-2">
          <img src={logoUrl} alt="" className="h-9 w-auto" />
          <div>
            <div className="font-display text-base font-semibold leading-none text-navy">
              Gastro Kids
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Panel clínico
            </div>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-1" aria-label="Admin">
          {navItems
            .filter((it) => hasRole([...it.roles]))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-navy text-offwhite"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  <Icon size={16} strokeWidth={1.6} />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>

        <div className="mt-auto pt-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                <Stethoscope size={16} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{user?.nombre}</div>
                <div className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {user?.roles.join(" · ")}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="mt-3 w-full">
              <LogOut size={14} strokeWidth={1.75} />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      <main className="overflow-x-hidden">
        <div className="px-6 py-8 lg:px-10 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
