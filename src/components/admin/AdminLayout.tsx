import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useAuth, type Rol } from "@/hooks/useAuth";
import { ExpedienteStoreProvider } from "@/store/expedienteStore";
import { useClinic } from "@/store/clinicStore";
import { NotificacionesBell } from "@/components/admin/NotificacionesBell";
import { cn } from "@/lib/cn";
import logoUrl from "@/assets/logo.png";
import faviconUrl from "@/assets/favicon.png";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "doctor", "secretaria"] satisfies Rol[],
    badge: "none" as const,
  },
  {
    to: "/admin/calendario",
    label: "Calendario",
    icon: Calendar,
    roles: ["admin", "doctor", "secretaria"] satisfies Rol[],
    badge: "none" as const,
  },
  {
    to: "/admin/conversaciones",
    label: "Conversaciones",
    icon: MessagesSquare,
    roles: ["admin", "doctor", "secretaria"] satisfies Rol[],
    badge: "conversaciones" as const,
  },
  {
    to: "/admin/lista-espera",
    label: "Lista de espera",
    icon: ClipboardList,
    roles: ["admin", "doctor", "secretaria"] satisfies Rol[],
    badge: "listaEspera" as const,
  },
  {
    to: "/admin/pacientes",
    label: "Pacientes",
    icon: Users,
    roles: ["admin", "doctor", "secretaria"] satisfies Rol[],
    badge: "none" as const,
  },
] as const;

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  pacientes: "Pacientes",
  calendario: "Calendario",
  conversaciones: "Conversaciones",
  "lista-espera": "Lista de espera",
  configuracion: "Configuración",
};

const roleBadgeStyle: Record<Rol, string> = {
  admin: "bg-navy/10 text-navy",
  doctor: "bg-leaf/15 text-leaf",
  secretaria: "bg-muted text-muted-foreground",
};

const roleLabel: Record<Rol, string> = {
  admin: "Admin",
  doctor: "Doctor",
  secretaria: "Secretaría",
};

const COLLAPSED_KEY = "gastrokids:admin:sidebarCollapsed";

export function AdminLayout() {
  const { user, signOut, hasRole } = useAuth();
  const { conversaciones, listaEspera } = useClinic();
  const navigate = useNavigate();
  const location = useLocation();

  const badgeCounts = {
    conversaciones: conversaciones.reduce((a, c) => a + (c.noLeidos > 0 ? 1 : 0), 0),
    listaEspera: listaEspera.filter((e) => e.estado === "pendiente").length,
    none: 0,
  };

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore (private mode, quota)
    }
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed((c) => !c);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const segments = location.pathname
    .replace("/admin/", "")
    .split("/")
    .filter(Boolean);
  const crumbs = segments.map(
    (seg) =>
      breadcrumbLabels[seg] ?? (seg.length === 36 ? "Detalle" : seg),
  );

  return (
    <ExpedienteStoreProvider>
    <div
      className={cn(
        "grid min-h-[100dvh] bg-muted/40 transition-[grid-template-columns] duration-200 ease-gentle",
        collapsed ? "grid-cols-[72px_1fr]" : "grid-cols-[260px_1fr]",
      )}
    >
      <aside className="sticky top-0 flex h-[100dvh] min-w-0 flex-col border-r border-border bg-offwhite">
        <div
          className={cn(
            "flex h-[96px] items-center justify-center border-b border-border py-3",
            collapsed ? "px-2" : "px-4",
          )}
        >
          <NavLink
            to="/admin/dashboard"
            title={collapsed ? "Gastro Kids · Dr. Alfredo Mora" : undefined}
            className="flex flex-col items-center leading-none transition-opacity hover:opacity-80"
          >
            <img
              src={collapsed ? faviconUrl : logoUrl}
              alt="Gastro Kids · Dr. Alfredo Mora"
              className={cn(
                "w-auto transition-[height] duration-200 ease-gentle",
                collapsed ? "h-9" : "h-[52px]",
              )}
            />
            {!collapsed ? (
              <span className="mt-[5px] text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Dr. Alfredo Mora
              </span>
            ) : null}
          </NavLink>
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4",
            collapsed ? "px-2" : "px-3",
          )}
          aria-label="Admin"
        >
          <ul className="space-y-0.5">
            {navItems
              .filter((it) => hasRole([...it.roles]))
              .map((item) => {
                const Icon = item.icon;
                const count = badgeCounts[item.badge];
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          "relative flex items-center rounded-lg text-sm font-medium transition-colors",
                          collapsed
                            ? "justify-center py-3"
                            : "gap-3 px-3 py-2.5",
                          isActive
                            ? "bg-navy text-offwhite"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      <Icon
                        size={collapsed ? 18 : 16}
                        strokeWidth={1.6}
                      />
                      {!collapsed ? (
                        <span className="flex-1">{item.label}</span>
                      ) : null}
                      {count > 0 ? (
                        collapsed ? (
                          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
                        ) : (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-semibold text-offwhite">
                            {count > 99 ? "99+" : count}
                          </span>
                        )
                      ) : null}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div
          className={cn(
            "border-t border-border",
            collapsed ? "p-1.5" : "p-2",
          )}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className={cn(
              "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose size={16} strokeWidth={1.75} />
                Colapsar menú
              </>
            )}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex h-[96px] items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm md:px-6">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              Admin
            </span>
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="hidden text-muted-foreground sm:inline">
                  /
                </span>
                <span
                  className={
                    i === crumbs.length - 1
                      ? "max-w-[160px] truncate font-medium text-foreground"
                      : "hidden text-muted-foreground sm:inline"
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <NotificacionesBell />
            {user ? (
              <UserMenu
                user={user}
                canConfig={hasRole(["admin", "doctor"])}
                onConfig={() => navigate("/admin/configuracion")}
                onLogout={handleLogout}
              />
            ) : null}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
    </ExpedienteStoreProvider>
  );
}

function UserMenu({
  user,
  canConfig,
  onConfig,
  onLogout,
}: {
  user: { nombre: string; email: string; roles: Rol[] };
  canConfig: boolean;
  onConfig: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const primaryRole = user.roles[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleConfig = () => {
    setOpen(false);
    onConfig();
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-navy/30"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy/20 bg-gradient-to-br from-navy/10 to-leaf/10 text-navy">
          <User size={16} strokeWidth={1.75} />
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-xs font-medium leading-none text-foreground">
            {user.nombre}
          </span>
          {primaryRole ? (
            <span
              className={cn(
                "mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                roleBadgeStyle[primaryRole],
              )}
            >
              {roleLabel[primaryRole]}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className="hidden text-muted-foreground md:block"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
        >
          <div className="px-3 pb-2 pt-3">
            <p className="text-sm font-semibold text-foreground">
              {user.nombre}
            </p>
            {user.email ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            ) : null}
            {primaryRole ? (
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  roleBadgeStyle[primaryRole],
                )}
              >
                {roleLabel[primaryRole]}
              </span>
            ) : null}
          </div>

          {canConfig ? (
            <>
              <div className="h-px bg-border" />
              <button
                type="button"
                role="menuitem"
                onClick={handleConfig}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Settings size={14} strokeWidth={1.75} />
                Configuración
              </button>
            </>
          ) : null}

          <div className="h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-coral transition-colors hover:bg-coral/10"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
