-- 0008_seed_mock.sql
-- Datos mock iniciales: servicios y un paciente de muestra.
-- Los pacientes/citas de demostración del frontend viven en src/lib/mock.ts y
-- pueden migrarse a Supabase con scripts adicionales cuando se desee.

insert into servicios (slug, nombre_es, nombre_en, descripcion_es, descripcion_en, duracion_min, destacado, orden)
values
  ('consulta-gastro', 'Consulta de gastroenterología pediátrica', 'Pediatric gastroenterology consult',
   'Evaluación completa del sistema digestivo con plan diagnóstico y terapéutico personalizado.',
   'Comprehensive evaluation of the digestive system with a personalized diagnostic and therapeutic plan.',
   60, true, 10),
  ('endoscopia-alta', 'Endoscopía digestiva alta', 'Upper digestive endoscopy',
   'Procedimiento ambulatorio bajo sedación pediátrica para estudio de esófago, estómago y duodeno.',
   'Outpatient procedure under pediatric sedation to study the esophagus, stomach, and duodenum.',
   45, false, 20),
  ('colonoscopia', 'Colonoscopía pediátrica', 'Pediatric colonoscopy',
   'Estudio del colon con preparación adecuada al peso y edad del paciente.',
   'Colon study with preparation tailored to the patient''s weight and age.',
   60, false, 30),
  ('phmetria', 'pH-metría de 24 horas', '24-hour pH monitoring',
   'Medición ambulatoria del reflujo ácido para confirmar o descartar ERGE.',
   'Ambulatory measurement of acid reflux to confirm or rule out GERD.',
   30, false, 40),
  ('manometria', 'Manometría anorrectal', 'Anorectal manometry',
   'Estudio funcional del piso pélvico en estreñimiento crónico y trastornos defecatorios.',
   'Functional pelvic floor study for chronic constipation and defecation disorders.',
   45, false, 50),
  ('aliento', 'Prueba de aliento', 'Breath test',
   'Diagnóstico no invasivo para intolerancia a lactosa, fructosa y H. pylori.',
   'Non-invasive diagnosis for lactose, fructose intolerance, and H. pylori.',
   30, false, 60),
  ('nutricion', 'Consulta de nutrición infantil', 'Pediatric nutrition consult',
   'Plan alimentario personalizado, manejo de alergias y selectividad alimentaria.',
   'Personalized eating plan, allergy management, and feeding selectivity.',
   45, true, 70),
  ('seguimiento-cronico', 'Seguimiento de patología crónica', 'Chronic disease follow-up',
   'Manejo continuo de EII, celiaquía y APLV con controles programados.',
   'Continuous management of IBD, celiac disease, and CMPA with scheduled controls.',
   30, false, 80)
on conflict (slug) do nothing;

-- Site settings con valores reales de Gastro Kids
update site_settings
set
  whatsapp = '+506 8844-3322',
  email_contacto = 'contacto@gastrokids.cr',
  direccion = 'Av. Escazú, Torre Médica, Piso 4, Escazú, San José, Costa Rica',
  horario = 'Lun a Vie · 9:00 — 19:00 · Sáb · 9:00 — 14:00'
where id = 1;
