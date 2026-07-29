// Configuración general del consultorio (editable en Configuración → Consultorio).

export type ContactoConfig = {
  whatsapp: string; // dígitos wa.me
  whatsappDisplay: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  mapsUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

export type AccesosConfig = {
  conversaciones: { admin: boolean; doctor: boolean; secretaria: boolean };
  listaEspera: { admin: boolean; doctor: boolean; secretaria: boolean };
};

export type ClinicConfig = {
  bookingEnabled: boolean;
  mostrarFraseLogin: boolean;
  contacto: ContactoConfig;
  accesos: AccesosConfig;
};

export const configSeed: ClinicConfig = {
  bookingEnabled: true,
  mostrarFraseLogin: true,
  contacto: {
    whatsapp: "50688443322",
    whatsappDisplay: "+506 8844-3322",
    telefono: "+506 2280-4455",
    email: "contacto@gastrokids.cr",
    direccion: "Av. Escazú, Torre Médica, Piso 4, Escazú",
    ciudad: "San José, Costa Rica",
    mapsUrl: "https://maps.google.com/?q=Escazu+San+Jose+Costa+Rica",
    instagram: "https://instagram.com/gastrokids.cr",
    facebook: "https://facebook.com/gastrokids.cr",
    tiktok: "https://tiktok.com/@gastrokids.cr",
  },
  accesos: {
    conversaciones: { admin: true, doctor: true, secretaria: true },
    listaEspera: { admin: true, doctor: true, secretaria: true },
  },
};

export function whatsappLinkFrom(
  whatsapp: string,
  mensaje = "Hola, me gustaría agendar una cita para mi hijo/a.",
): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
