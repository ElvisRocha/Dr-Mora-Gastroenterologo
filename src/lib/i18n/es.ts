import type { Dictionary } from "./types";

export const es: Dictionary = {
  nav: {
    inicio: "Inicio",
    sobreElDoctor: "Sobre el doctor",
    servicios: "Servicios",
    galeria: "Galería",
    contacto: "Contacto",
    agendarCita: "Agendar cita",
    iniciarSesion: "Iniciar sesión",
  },
  hero: {
    eyebrow: "Gastroenterología pediátrica",
    titlePart1: "Salud digestiva,",
    titlePart2: "infancias plenas.",
    subtitle:
      "Atención integral del aparato digestivo en pacientes de 0 a 21 años. Diagnóstico clínico riguroso, nutrición especializada y endoscopía pediátrica con un equipo dedicado al bienestar de tu hijo.",
    ctaPrimary: "Agendar cita",
    ctaSecondary: "Conocer al doctor",
    badges: [
      "Pediatra certificado",
      "Endoscopía digestiva",
      "Nutrición infantil",
      "Atención bilingüe ES · EN",
    ],
  },
  servicios: {
    eyebrow: "Servicios",
    title: "Atención clínica diseñada para cada etapa",
    subtitle:
      "Desde lactantes con cólicos hasta adolescentes con enfermedades inflamatorias intestinales. Cada plan se adapta a la edad y al contexto familiar.",
    items: [
      {
        slug: "consulta-gastro",
        nombre: "Consulta de gastroenterología pediátrica",
        descripcion:
          "Evaluación completa del sistema digestivo con plan diagnóstico y terapéutico personalizado.",
      },
      {
        slug: "endoscopia-alta",
        nombre: "Endoscopía digestiva alta",
        descripcion:
          "Procedimiento ambulatorio bajo sedación pediátrica para estudio de esófago, estómago y duodeno.",
      },
      {
        slug: "colonoscopia",
        nombre: "Colonoscopía pediátrica",
        descripcion:
          "Estudio del colon con preparación adecuada al peso y edad del paciente.",
      },
      {
        slug: "phmetria",
        nombre: "pH-metría de 24 horas",
        descripcion:
          "Medición ambulatoria del reflujo ácido para confirmar o descartar ERGE.",
      },
      {
        slug: "manometria",
        nombre: "Manometría anorrectal",
        descripcion:
          "Estudio funcional del piso pélvico en estreñimiento crónico y trastornos defecatorios.",
      },
      {
        slug: "aliento",
        nombre: "Prueba de aliento",
        descripcion:
          "Diagnóstico no invasivo para intolerancia a lactosa, fructosa y H. pylori.",
      },
      {
        slug: "nutricion",
        nombre: "Consulta de nutrición infantil",
        descripcion:
          "Plan alimentario personalizado, manejo de alergias y selectividad alimentaria.",
      },
      {
        slug: "seguimiento-cronico",
        nombre: "Seguimiento de patología crónica",
        descripcion:
          "Manejo continuo de EII, celiaquía y APLV con controles programados.",
      },
    ],
  },
  porQue: {
    eyebrow: "¿Por qué Gastro Kids?",
    title: "Un consultorio pensado para niños y para sus familias",
    subtitle:
      "Cuatro pilares que sostienen cada decisión clínica.",
    pilares: [
      {
        titulo: "Formación de excelencia",
        descripcion:
          "Pediatría, gastroenterología, nutrición y endoscopía digestiva en una sola consulta.",
      },
      {
        titulo: "Espacio amigable",
        descripcion:
          "Consultorio diseñado para reducir la ansiedad del niño y acompañar a los padres.",
      },
      {
        titulo: "Diagnóstico responsable",
        descripcion:
          "Estudios solo cuando son necesarios. Explicaciones claras, sin tecnicismos.",
      },
      {
        titulo: "Continuidad de la atención",
        descripcion:
          "Expediente clínico integral y comunicación directa entre consultas.",
      },
    ],
  },
  doctor: {
    eyebrow: "Sobre el doctor",
    title: "Un solo médico, cuatro especialidades enfocadas en tu hijo",
    nombre: "Dr. Alfredo Mora",
    cargo: "Pediatra · Gastroenterólogo · Nutriólogo · Endoscopista digestivo",
    bio: [
      "Egresado de la Facultad de Medicina con formación en pediatría general y subespecialidad en gastroenterología, hepatología y nutrición pediátrica.",
      "Más de una década de práctica clínica enfocada en patologías digestivas funcionales y orgánicas, desde el lactante hasta el adulto joven con enfermedades inflamatorias intestinales.",
      "Realiza endoscopías digestivas altas y colonoscopías pediátricas en hospitales certificados, siempre acompañado de un equipo de anestesiología pediátrica.",
    ],
    credenciales: [
      "Pediatra certificado",
      "Gastroenterología, hepatología y nutrición pediátrica",
      "Endoscopía digestiva pediátrica",
      "Miembro activo de sociedades de la especialidad",
    ],
    cta: "Conocer su trayectoria",
  },
  testimonios: {
    eyebrow: "Familias que confían",
    title: "Lo que dicen padres y madres",
    subtitle:
      "Historias reales de seguimiento clínico y nutricional.",
    items: [
      {
        autor: "Marisol A.",
        relacion: "Madre de Tomás, 4 años",
        texto:
          "Mi hijo llevaba meses con cólicos y reflujo. El Dr. Mora ordenó solo lo necesario, y en dos consultas ya teníamos un plan claro. Tomás duerme y come tranquilo desde entonces.",
      },
      {
        autor: "Iván R.",
        relacion: "Padre de Lucía, 11 años",
        texto:
          "Lucía vive con celiaquía. La continuidad y la honestidad del consultorio nos ha dado tranquilidad. Saben hablarle a ella, no solo a nosotros.",
      },
      {
        autor: "Patricia K.",
        relacion: "Madre de Daniel, 17 años",
        texto:
          "Diagnóstico de Crohn a los 16. La transición a un manejo de adolescente fue cuidadosa, con explicaciones que Daniel entendió y respetó.",
      },
      {
        autor: "Roberto S.",
        relacion: "Padre de Sofía, 2 años",
        texto:
          "Alergia a la proteína de la leche. La nutrióloga del equipo nos guió en la fórmula correcta y en la introducción de alimentos. Sofía recuperó peso en seis semanas.",
      },
      {
        autor: "Andrea V.",
        relacion: "Madre de Mateo, 9 años",
        texto:
          "Estreñimiento crónico que veníamos cargando hace años. La manometría aclaró todo. Hoy Mateo va al baño sin dolor.",
      },
      {
        autor: "Sandra M.",
        relacion: "Madre de Joaquín, 11 años",
        texto:
          "Después de meses de pruebas en otros lados, aquí encontramos claridad. La intolerancia a la lactosa estaba enmascarando un cuadro más fino. El plan combinado de nutrición y gastro nos cambió la rutina.",
      },
    ],
  },
  galeria: {
    eyebrow: "El espacio",
    title: "Un consultorio pensado para infancias",
    subtitle: "Recorrido fotográfico del consultorio y áreas de procedimientos.",
    cta: "Ver galería completa",
    featuredCards: [
      {
        titulo: "Recepción cálida",
        descripcion:
          "El primer contacto siempre es con una persona, no con un mostrador. Espacio amable para padres y niños desde la llegada.",
      },
      {
        titulo: "Consultorio amigable",
        descripcion:
          "Diseño que reduce la ansiedad infantil: iluminación natural, libros, juguetes y zona de exploración para los más pequeños.",
      },
      {
        titulo: "Procedimientos en hospital",
        descripcion:
          "Endoscopías y colonoscopías se realizan en hospitales certificados, siempre con anestesiología pediátrica acompañando.",
      },
      {
        titulo: "Equipo dedicado",
        descripcion:
          "Pediatría, gastroenterología, nutrición y endoscopía bajo un mismo equipo. Continuidad real entre cada consulta.",
      },
    ],
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que las familias suelen preguntar",
    subtitle: "Si tu duda no está aquí, escríbenos directamente.",
    items: [
      {
        pregunta: "¿A partir de qué edad atiende el Dr. Mora?",
        respuesta:
          "Atendemos desde recién nacidos hasta los 21 años. Para pacientes con patologías crónicas, el seguimiento puede extenderse durante la transición a la atención adulta.",
      },
      {
        pregunta: "¿Cuánto dura la primera consulta?",
        respuesta:
          "Entre 45 y 60 minutos. Incluye historia clínica completa, exploración física, antropometría y plan diagnóstico inicial.",
      },
      {
        pregunta: "¿Qué debo llevar a la primera consulta?",
        respuesta:
          "Cartilla de vacunación, estudios previos (laboratorios, ultrasonidos, endoscopías), lista de medicamentos actuales y un registro alimentario de los últimos 7 días si aplica.",
      },
      {
        pregunta: "¿Las endoscopías se realizan en el consultorio?",
        respuesta:
          "No. Se realizan en hospitales certificados con equipo de anestesiología pediátrica. Te guiamos en cada paso del proceso.",
      },
      {
        pregunta: "¿Atienden urgencias?",
        respuesta:
          "Para urgencias verdaderas indicamos asistir al servicio hospitalario más cercano. Para consultas prioritarias contamos con horarios reservados.",
      },
      {
        pregunta: "¿Manejan seguros médicos?",
        respuesta:
          "Trabajamos con las principales aseguradoras nacionales. Confirma el detalle al momento de agendar.",
      },
    ],
    ctaTitle: "¿No encontraste tu pregunta?",
    ctaDescription:
      "Escríbenos directamente o agenda tu primera consulta. Las dudas específicas las resolvemos en la valoración inicial con el contexto de tu hijo.",
    ctaButton: "Reservar consulta",
  },
  cta: {
    title: "¿Listo para agendar la primera consulta?",
    subtitle:
      "Reserva en línea en menos de dos minutos. Confirmamos por correo y WhatsApp.",
    primary: "Agendar ahora",
    secondary: "Hablar por WhatsApp",
  },
  footer: {
    copy: "Salud digestiva, infancias plenas.",
    about:
      "Gastroenterología, nutrición y endoscopía pediátrica con calidez clínica y diagnóstico responsable para pacientes de 0 a 21 años.",
    derechos: "Todos los derechos reservados.",
    madeBy: "Hecho con",
    studio: "SmartFlow Automations",
    contact: {
      titulo: "Contacto",
      phones: ["+52 55 5555 5555", "+52 55 4444 4444"],
      email: "contacto@gastrokids.mx",
      address: "Av. Reforma 1234, Piso 8, Cuauhtémoc, 06600, Ciudad de México",
    },
    hours: {
      titulo: "Horarios",
      items: [
        { dia: "Lunes a Jueves", horario: "9:00 — 19:00" },
        { dia: "Viernes", horario: "9:00 — 17:00" },
        { dia: "Sábado", horario: "9:00 — 14:00" },
        { dia: "Domingo", horario: "Cerrado" },
      ],
    },
    social: {
      instagram: "https://instagram.com/gastrokids.mx",
      facebook: "https://facebook.com/gastrokids.mx",
      tiktok: "https://tiktok.com/@gastrokids.mx",
    },
  },
  booking: {
    title: "Agendar consulta",
    subtitle: "Cuatro pasos. Menos de dos minutos.",
    pasos: ["Servicio", "Fecha y hora", "Datos", "Confirmar"],
    seleccionarServicio: "Selecciona el servicio",
    seleccionarFecha: "Selecciona la fecha",
    seleccionarHora: "Horarios disponibles",
    sinSlots: "No hay horarios disponibles para esta fecha. Prueba otro día.",
    datosTutor: "Datos del tutor",
    datosNino: "Datos del paciente",
    motivoConsulta: "Motivo de consulta",
    revisar: "Revisa la información antes de confirmar",
    confirmar: "Confirmar cita",
    exito: "¡Cita agendada! Te confirmamos por correo y WhatsApp.",
    error: "No pudimos completar el agendamiento. Inténtalo de nuevo.",
    siguiente: "Siguiente",
    atras: "Atrás",
    relacion: "Relación con el paciente",
    nombre: "Nombre(s)",
    apellidos: "Apellidos",
    telefono: "Teléfono",
    email: "Correo electrónico",
    fechaNacimiento: "Fecha de nacimiento",
    sexo: "Sexo",
  },
  comun: {
    cargando: "Cargando…",
    masInfo: "Más información",
    cerrar: "Cerrar",
  },
};
