-- 0002_pacientes_tutores.sql
-- Tablas centrales del paciente pediátrico y sus tutores.

create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido_paterno text not null,
  apellido_materno text,
  fecha_nacimiento date not null,
  sexo sexo_t not null default 'no_especificado',
  grupo_sanguineo text,
  rh rh_t,
  peso_nacimiento_g int,
  talla_nacimiento_cm numeric(4,1),
  semanas_gestacion int,
  tipo_parto tipo_parto_t,
  ghl_contact_id text unique,
  notas_admin text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_pacientes_nombre
  on pacientes (apellido_paterno, nombre);

create index if not exists idx_pacientes_ghl
  on pacientes (ghl_contact_id);

create table if not exists tutores (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  relacion relacion_tutor_t not null,
  nombre text not null,
  apellidos text,
  telefono text,
  email text,
  ocupacion text,
  antecedentes_relevantes text,
  es_contacto_principal boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_tutores_paciente on tutores(paciente_id);
create index if not exists idx_tutores_email on tutores(email);
create unique index if not exists ux_tutores_principal_por_paciente
  on tutores(paciente_id) where es_contacto_principal;
