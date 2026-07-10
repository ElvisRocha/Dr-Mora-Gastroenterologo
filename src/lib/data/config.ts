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
    whatsapp: "525555555555",
    whatsappDisplay: "+52 55 5555 5555",
    telefono: "+52 55 4444 4444",
    email: "contacto@gastrokids.mx",
    direccion: "Av. Reforma 1234, Piso 8, Cuauhtémoc",
    ciudad: "06600, Ciudad de México",
    mapsUrl: "https://maps.google.com/?q=Av.+Reforma+1234+Ciudad+de+Mexico",
    instagram: "https://instagram.com/gastrokids.mx",
    facebook: "https://facebook.com/gastrokids.mx",
    tiktok: "https://tiktok.com/@gastrokids.mx",
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
