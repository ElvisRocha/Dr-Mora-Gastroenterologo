import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Configuracion() {
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [whatsapp, setWhatsapp] = useState("+52 55 5555 5555");
  const [email, setEmail] = useState("contacto@gastrokids.mx");
  const [direccion, setDireccion] = useState("Av. Reforma 1234, Piso 8 · Ciudad de México");
  const [ghlLocationId, setGhlLocationId] = useState("");
  const [ghlCalendarId, setGhlCalendarId] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configuración guardada (mock)");
  };

  return (
    <div>
      <span className="eyebrow">Configuración</span>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy">
        Ajustes del consultorio
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cambios visibles en el sitio público y en los workflows de notificación.
      </p>

      <form onSubmit={save} className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-navy">Reservas</h2>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={bookingEnabled}
              onChange={(e) => setBookingEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border accent-navy"
            />
            <span className="text-sm">
              <strong className="block text-foreground">Reservas en línea activadas</strong>
              <span className="text-muted-foreground">
                Si lo desactivas, la página /agendar-cita muestra un aviso.
              </span>
            </span>
          </label>
          <Field label="Email de contacto público">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </Field>
          <Field label="WhatsApp del consultorio">
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label="Dirección visible">
            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </Field>
        </Card>

        <Card className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-navy">Integración GHL</h2>
          <p className="text-xs text-muted-foreground">
            Las claves se guardan en n8n por seguridad. Aquí solo se referencian los IDs públicos.
          </p>
          <Field label="GHL Location ID">
            <Input value={ghlLocationId} onChange={(e) => setGhlLocationId(e.target.value)} />
          </Field>
          <Field label="GHL Calendar ID (Dr. Mora)">
            <Input value={ghlCalendarId} onChange={(e) => setGhlCalendarId(e.target.value)} />
          </Field>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit">
            <Save size={16} strokeWidth={1.75} />
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
