import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Mail, Phone, Search, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useExpedienteStore } from "@/store/expedienteStore";
import { formatearEdadTabla, TIPO_ID_LABEL } from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { NuevoPacienteModal } from "@/components/admin/NuevoPacienteModal";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 25;

export default function Pacientes() {
  const { listPacientes } = useExpedienteStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const pacientes = listPacientes();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const digits = term.replace(/\D/g, "");
    if (!term) return pacientes;
    return pacientes.filter((p) => {
      const nombre = `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}`.toLowerCase();
      const id = (p.identificacion?.numero ?? "").toLowerCase();
      const tel = (p.telefonoTutor ?? "").replace(/\D/g, "");
      const tutor = (p.tutorPrincipal ?? "").toLowerCase();
      return (
        nombre.includes(term) ||
        tutor.includes(term) ||
        id.includes(term) ||
        (digits.length >= 3 && tel.includes(digits))
      );
    });
  }, [pacientes, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const rows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const onSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Pacientes</span>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-navy">
            Expedientes activos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length.toLocaleString("es-CR")} de{" "}
            {pacientes.length.toLocaleString("es-CR")} pacientes
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus size={16} />
          Nuevo paciente
        </Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre, cédula o teléfono…"
          className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-navy/40 focus:ring-2 focus:ring-navy/15"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Identificación</th>
                <th className="px-5 py-3 font-medium">Edad</th>
                <th className="px-5 py-3 font-medium">Contacto</th>
                <th className="px-5 py-3 text-right font-medium">Registro</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    No se encontraron pacientes.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                    className="cursor-pointer border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy/15 to-leaf/15 text-[11px] font-semibold text-navy">
                          {p.nombre[0]}
                          {p.apellidoPaterno[0]}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno ?? ""}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            Tutor: {p.tutorPrincipal}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {p.identificacion ? (
                        <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-xs text-foreground">
                          {TIPO_ID_LABEL[p.identificacion.tipo]} {p.identificacion.numero}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {p.fechaNacimiento ? formatearEdadTabla(p.fechaNacimiento) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {p.telefonoTutor ? (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone size={12} className="shrink-0" />
                            {p.telefonoTutor}
                          </p>
                        ) : null}
                        {p.email ? (
                          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <Mail size={12} className="shrink-0" />
                            {p.email}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                      {p.fechaRegistro
                        ? format(new Date(p.fechaRegistro), "dd MMM yyyy", { locale: es })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>
              Página {pageSafe} de {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors",
                  pageSafe <= 1 ? "opacity-40" : "hover:bg-muted",
                )}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors",
                  pageSafe >= totalPages ? "opacity-40" : "hover:bg-muted",
                )}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <NuevoPacienteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
