import { Globe, MessageCircle, Phone, UserRound } from "lucide-react";
import type { CitaSource } from "@/store/clinicStore";

export const SOURCE_CONFIG: Record<
  CitaSource,
  { Icon: typeof Globe; color: string; label: string }
> = {
  web: { Icon: Globe, color: "text-navy", label: "Agendada en el sitio web" },
  whatsapp: {
    Icon: MessageCircle,
    color: "text-leaf",
    label: "Agendada por WhatsApp (Gastrito)",
  },
  telefono: { Icon: Phone, color: "text-amber", label: "Agendada por teléfono" },
  manual: {
    Icon: UserRound,
    color: "text-teal",
    label: "Agendada por recepción",
  },
};
