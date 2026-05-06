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
    pageTitle: string;
    pageSubtitle: string;
    filters: {
      todas: string;
      consultorio: string;
      procedimientos: string;
      nutricion: string;
      pacientes: string;
    };
    counter: string;
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
  contacto: {
    title: string;
    subtitle: string;
    formTitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    helper: string;
    send: string;
    sending: string;
    success: string;
    successDesc: string;
    error: string;
    infoTitle: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    whatsappPrompt: string;
    whatsappCta: string;
    locationTitle: string;
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
    pasosMenor: string[];
    seleccionarServicio: string;
    seleccionarFecha: string;
    seleccionarHora: string;
    sinSlots: string;
    preguntaMayorTitulo: string;
    preguntaMayorAyuda: string;
    siMayor: string;
    noMenor: string;
    cambiarRespuesta: string;
    respuestaMayor: string;
    respuestaMenor: string;
    datosTutor: string;
    datosNino: string;
    datosPaciente: string;
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
