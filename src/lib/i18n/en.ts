import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    inicio: "Home",
    sobreElDoctor: "About",
    servicios: "Services",
    galeria: "Gallery",
    contacto: "Contact",
    agendarCita: "Book appointment",
    iniciarSesion: "Sign in",
  },
  hero: {
    eyebrow: "Pediatric gastroenterology",
    titlePart1: "Digestive health,",
    titlePart2: "thriving childhoods.",
    subtitle:
      "Comprehensive care of the digestive system for patients aged 0 to 21. Rigorous clinical diagnosis, specialized nutrition, and pediatric endoscopy by a team focused on your child's well-being.",
    ctaPrimary: "Book appointment",
    ctaSecondary: "Meet the doctor",
    badges: [
      "Board-certified pediatrician",
      "Digestive endoscopy",
      "Pediatric nutrition",
      "Bilingual care EN · ES",
    ],
  },
  servicios: {
    eyebrow: "Services",
    title: "Clinical care designed for every stage",
    subtitle:
      "From colicky infants to adolescents with inflammatory bowel disease. Every plan adapts to age and family context.",
    items: [
      {
        slug: "consulta-gastro",
        nombre: "Pediatric gastroenterology consult",
        descripcion:
          "Comprehensive evaluation of the digestive system with a personalized diagnostic and therapeutic plan.",
      },
      {
        slug: "endoscopia-alta",
        nombre: "Upper digestive endoscopy",
        descripcion:
          "Outpatient procedure under pediatric sedation to study the esophagus, stomach, and duodenum.",
      },
      {
        slug: "colonoscopia",
        nombre: "Pediatric colonoscopy",
        descripcion:
          "Colon study with preparation tailored to the patient's weight and age.",
      },
      {
        slug: "phmetria",
        nombre: "24-hour pH monitoring",
        descripcion:
          "Ambulatory measurement of acid reflux to confirm or rule out GERD.",
      },
      {
        slug: "manometria",
        nombre: "Anorectal manometry",
        descripcion:
          "Functional pelvic floor study for chronic constipation and defecation disorders.",
      },
      {
        slug: "aliento",
        nombre: "Breath test",
        descripcion:
          "Non-invasive diagnosis for lactose, fructose intolerance, and H. pylori.",
      },
      {
        slug: "nutricion",
        nombre: "Pediatric nutrition consult",
        descripcion:
          "Personalized eating plan, allergy management, and feeding selectivity.",
      },
      {
        slug: "seguimiento-cronico",
        nombre: "Chronic disease follow-up",
        descripcion:
          "Continuous management of IBD, celiac disease, and CMPA with scheduled controls.",
      },
    ],
  },
  porQue: {
    eyebrow: "Why Gastro Kids?",
    title: "A practice designed for children and their families",
    subtitle: "Four pillars supporting every clinical decision.",
    pilares: [
      {
        titulo: "Excellence in training",
        descripcion:
          "Pediatrics, gastroenterology, nutrition, and digestive endoscopy in a single consult.",
      },
      {
        titulo: "Friendly space",
        descripcion:
          "An office designed to reduce the child's anxiety and accompany the parents.",
      },
      {
        titulo: "Responsible diagnosis",
        descripcion:
          "Studies only when needed. Clear explanations, free of jargon.",
      },
      {
        titulo: "Continuity of care",
        descripcion:
          "Comprehensive clinical record and direct communication between consults.",
      },
    ],
  },
  doctor: {
    eyebrow: "About the doctor",
    title: "One physician, four specialties focused on your child",
    nombre: "Dr. Alfredo Mora",
    cargo: "Pediatrician · Gastroenterologist · Nutritionist · Digestive endoscopist",
    bio: [
      "Graduated from the School of Medicine, with training in general pediatrics and a sub-specialty in gastroenterology, hepatology, and pediatric nutrition.",
      "More than a decade of clinical practice focused on functional and organic digestive conditions, from infants to young adults with inflammatory bowel disease.",
      "Performs upper digestive endoscopies and pediatric colonoscopies in certified hospitals, always accompanied by a pediatric anesthesiology team.",
    ],
    credenciales: [
      "Board-certified pediatrician",
      "Gastroenterology, hepatology, and pediatric nutrition",
      "Pediatric digestive endoscopy",
      "Active member of specialty societies",
    ],
    cta: "Read full bio",
  },
  testimonios: {
    eyebrow: "Trusted families",
    title: "What parents say",
    subtitle: "Real stories of clinical and nutritional follow-up.",
    items: [
      {
        autor: "Marisol A.",
        relacion: "Mother of Tomás, age 4",
        texto:
          "My son had colic and reflux for months. Dr. Mora ordered only what was needed, and within two visits we had a clear plan. Tomás has been sleeping and eating peacefully since.",
      },
      {
        autor: "Iván R.",
        relacion: "Father of Lucía, age 11",
        texto:
          "Lucía lives with celiac disease. The continuity and honesty of this practice have given us peace of mind. They know how to talk to her, not just to us.",
      },
      {
        autor: "Patricia K.",
        relacion: "Mother of Daniel, age 17",
        texto:
          "Crohn's diagnosis at 16. The transition to adolescent management was careful, with explanations Daniel understood and respected.",
      },
      {
        autor: "Roberto S.",
        relacion: "Father of Sofía, age 2",
        texto:
          "Cow's milk protein allergy. The team's nutritionist guided us through the right formula and food introduction. Sofía gained weight back in six weeks.",
      },
      {
        autor: "Andrea V.",
        relacion: "Mother of Mateo, age 9",
        texto:
          "Chronic constipation we had been carrying for years. The manometry clarified everything. Today Mateo goes to the bathroom without pain.",
      },
      {
        autor: "Sandra M.",
        relacion: "Mother of Joaquín, age 11",
        texto:
          "After months of tests elsewhere, here we finally found clarity. The lactose intolerance was masking a finer issue. The combined nutrition and gastro plan changed our routine.",
      },
    ],
  },
  galeria: {
    eyebrow: "The space",
    title: "An office made for childhoods",
    subtitle: "Photo tour of the consult room and procedure areas.",
    cta: "View full gallery",
    featuredCards: [
      {
        titulo: "Warm reception",
        descripcion:
          "The first point of contact is a person, not a counter. A welcoming space for parents and children from the moment they arrive.",
      },
      {
        titulo: "Friendly consult room",
        descripcion:
          "Designed to reduce children's anxiety: natural light, books, toys, and an exploration corner for the youngest patients.",
      },
      {
        titulo: "Hospital procedures",
        descripcion:
          "Endoscopies and colonoscopies are performed in certified hospitals, always accompanied by pediatric anesthesiology.",
      },
      {
        titulo: "Dedicated team",
        descripcion:
          "Pediatrics, gastroenterology, nutrition, and endoscopy under one team. True continuity between every consult.",
      },
    ],
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "What families usually ask",
    subtitle: "If your question isn't here, write to us directly.",
    items: [
      {
        pregunta: "What ages does Dr. Mora see?",
        respuesta:
          "We care for newborns up to 21 years old. For patients with chronic conditions, follow-up can extend through the transition to adult care.",
      },
      {
        pregunta: "How long is the first consult?",
        respuesta:
          "Between 45 and 60 minutes. It includes a complete clinical history, physical exam, anthropometry, and an initial diagnostic plan.",
      },
      {
        pregunta: "What should I bring to the first consult?",
        respuesta:
          "Vaccination card, prior studies (labs, ultrasounds, endoscopies), list of current medications, and a 7-day food diary if relevant.",
      },
      {
        pregunta: "Are endoscopies performed in the office?",
        respuesta:
          "No. They are performed in certified hospitals with a pediatric anesthesiology team. We guide you through every step.",
      },
      {
        pregunta: "Do you handle emergencies?",
        respuesta:
          "For real emergencies we direct families to the nearest hospital service. For priority consults we keep reserved time slots.",
      },
      {
        pregunta: "Do you accept insurance?",
        respuesta:
          "We work with the main national insurers. Confirm details when booking.",
      },
    ],
    ctaTitle: "Couldn't find your question?",
    ctaDescription:
      "Write to us directly or book your first consult. We address specific questions during the initial evaluation, with full context of your child.",
    ctaButton: "Book a consult",
  },
  cta: {
    title: "Ready to book your first consult?",
    subtitle:
      "Book online in less than two minutes. We confirm via email and WhatsApp.",
    primary: "Book now",
    secondary: "Chat on WhatsApp",
  },
  footer: {
    copy: "Digestive health, thriving childhoods.",
    about:
      "Pediatric gastroenterology, nutrition, and digestive endoscopy with clinical warmth and responsible diagnosis for patients aged 0 to 21.",
    derechos: "All rights reserved.",
    madeBy: "Made with",
    studio: "SmartFlow Automations",
    contact: {
      titulo: "Contact",
      phones: ["+52 55 5555 5555", "+52 55 4444 4444"],
      email: "contacto@gastrokids.mx",
      address: "Av. Reforma 1234, 8th floor, Cuauhtémoc, 06600, Mexico City",
    },
    hours: {
      titulo: "Hours",
      items: [
        { dia: "Monday to Thursday", horario: "9:00 AM — 7:00 PM" },
        { dia: "Friday", horario: "9:00 AM — 5:00 PM" },
        { dia: "Saturday", horario: "9:00 AM — 2:00 PM" },
        { dia: "Sunday", horario: "Closed" },
      ],
    },
    social: {
      instagram: "https://instagram.com/gastrokids.mx",
      facebook: "https://facebook.com/gastrokids.mx",
      tiktok: "https://tiktok.com/@gastrokids.mx",
    },
  },
  booking: {
    title: "Book a consult",
    subtitle: "Four steps. Under two minutes.",
    pasos: ["Service", "Date & time", "Details", "Confirm"],
    seleccionarServicio: "Select a service",
    seleccionarFecha: "Pick a date",
    seleccionarHora: "Available times",
    sinSlots: "No times available for this date. Try another day.",
    datosTutor: "Guardian information",
    datosNino: "Patient information",
    motivoConsulta: "Reason for consult",
    revisar: "Review your information before confirming",
    confirmar: "Confirm appointment",
    exito: "Appointment booked! We confirm via email and WhatsApp.",
    error: "We couldn't complete the booking. Please try again.",
    siguiente: "Next",
    atras: "Back",
    relacion: "Relationship to patient",
    nombre: "First name",
    apellidos: "Last name",
    telefono: "Phone",
    email: "Email",
    fechaNacimiento: "Date of birth",
    sexo: "Sex",
  },
  comun: {
    cargando: "Loading…",
    masInfo: "More info",
    cerrar: "Close",
  },
};
