import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useExpediente } from "@/store/expedienteStore";

export function ExpedienteCrecimiento({ pacienteId }: { pacienteId: string }) {
  const exp = useExpediente(pacienteId);
  const data = [...exp.antropometria].sort(
    (a, b) => +new Date(b.fecha) - +new Date(a.fecha),
  );

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No hay registros de antropometría para este paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Histórico de mediciones
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {data.length} registro{data.length === 1 ? "" : "s"} · más reciente
          primero
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Peso</th>
              <th className="px-5 py-3">Talla</th>
              <th className="px-5 py-3">IMC</th>
              <th className="px-5 py-3">Percentil peso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.fecha}>
                <td className="px-5 py-3 capitalize text-muted-foreground">
                  {format(new Date(row.fecha), "dd MMM yyyy", { locale: es })}
                </td>
                <td className="px-5 py-3 text-foreground">{row.pesoKg} kg</td>
                <td className="px-5 py-3 text-foreground">{row.tallaCm} cm</td>
                <td className="px-5 py-3 text-foreground">
                  {row.imc.toFixed(1)}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {row.percentilPeso ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
