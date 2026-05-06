export type Lang = "es" | "en";

export type Dictionary = {
  nav: {
    inicio: string;
    sobreElDoctor: string;
    servicios: string;
    galeria: string;
    contacto: string;
    agendarCita: string;
    iniciarSesion: string;
  };
  hero: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badges: string[];
  };
  servicios: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { slug: string; nombre: string; descripcion: string }[];
  };
  porQue: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pilares: { titulo: string; descripcion: string }[];
  };
  doctor: {
    eyebrow: string;
    title: string;
    nombre: string;
    cargo: string;
    bio: string[];
    credenciales: string[];
    cta: string;
  };
  testimonios: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { autor: string; relacion: string; texto: string }[];
  };
  galeria: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    featuredCards: { titulo: string; descripcion: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { pregunta: string; respuesta: string }[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    copy: string;
    about: string;
    derechos: string;
    madeBy: string;
    studio: string;
    contact: {
      titulo: string;
      phones: string[];
      email: string;
      address: string;
    };
    hours: {
      titulo: string;
      items: { dia: string; horario: string }[];
    };
    social: {
      instagram: string;
      facebook: string;
      tiktok: string;
    };
  };
  booking: {
    title: string;
    subtitle: string;
    pasos: string[];
    seleccionarServicio: string;
    seleccionarFecha: string;
    seleccionarHora: string;
    sinSlots: string;
    datosTutor: string;
    datosNino: string;
    motivoConsulta: string;
    revisar: string;
    confirmar: string;
    exito: string;
    error: string;
    siguiente: string;
    atras: string;
    relacion: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    sexo: string;
  };
  comun: {
    cargando: string;
    masInfo: string;
    cerrar: string;
  };
};
