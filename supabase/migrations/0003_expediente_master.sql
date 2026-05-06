-- 0003_expediente_master.sql
-- Núcleo del modelo clínico pediátrico-gastroenterológico.

create table if not exists expediente_master (
  paciente_id uuid primary key references pacientes(id) on delete cascade,

  -- Antecedentes perinatales
  complicaciones_embarazo text,
  tipo_lactancia tipo_lactancia_t,
  duracion_lactancia_meses int,
  edad_ablactacion_meses int,
  alimentos_introducidos text,

  -- Familiares (flags + texto)
  fam_eii boolean default false,
  fam_celiaquia boolean default false,
  fam_intolerancia_lactosa boolean default false,
  fam_cancer_gi boolean default false,
  fam_atopia boolean default false,
  fam_alergias text,
  fam_otros text,

  -- Diagnósticos GI activos (ERGE, estreñimiento, APLV, etc.)
  dx_erge boolean default false,
  dx_estrenimiento_cronico boolean default false,
  dx_aplv boolean default false,
  dx_intol_lactosa boolean default false,
  dx_crohn boolean default false,
  dx_cuci boolean default false,
  dx_celiaquia boolean default false,
  dx_dispepsia boolean default false,
  dx_otros text,

  -- Hábitos alimentarios
  num_comidas_dia int,
  alimentos_preferidos text,
  alimentos_rechazados text,
  intolerancias_conocidas text,
  dieta_especial text,

  -- Hábito intestinal (último registro; histórico va por consulta)
  bristol bristol_t,
  frecuencia_evacuaciones_semana int,
  dolor_defecacion boolean,
  sangrado boolean,
  distension boolean,
  vomitos boolean,
  reflujo boolean,

  alergias_medicamentos text,
  hospitalizaciones_previas text,
  cirugias_previas text,

  notas_generales text,
  updated_at timestamptz default now()
);

create table if not exists antropometria (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  fecha date not null default current_date,
  peso_kg numeric(5,2),
  talla_cm numeric(5,1),
  perimetro_cefalico_cm numeric(4,1),
  imc numeric(4,2),
  percentil_peso int,
  percentil_talla int,
  percentil_imc int,
  notas text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_antrop_paciente_fecha
  on antropometria(paciente_id, fecha desc);

create table if not exists procedimientos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  tipo text not null check (
    tipo in (
      'endoscopia_alta','colonoscopia','manometria',
      'phmetria','aliento','biopsia','otro'
    )
  ),
  fecha date not null,
  hallazgos text,
  archivo_url text,
  realizado_por text,
  created_at timestamptz default now()
);

create table if not exists medicamentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  nombre text not null,
  dosis text,
  frecuencia text,
  via text,
  fecha_inicio date,
  fecha_fin date,
  activo boolean default true,
  notas text
);

create table if not exists vacunas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  tipo text not null,
  dosis_num int,
  fecha date,
  lote text,
  notas text
);
