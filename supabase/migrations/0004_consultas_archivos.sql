-- 0004_consultas_archivos.sql
-- Consultas individuales y archivos adjuntos por consulta.

create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete cascade,
  cita_id uuid,  -- FK añadida en 0005 cuando exista la tabla citas
  fecha date default current_date,
  motivo text,
  exploracion text,
  plan_terapeutico text,
  bristol bristol_t,
  peso_kg numeric(5,2),
  talla_cm numeric(5,1),
  doctor_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_consultas_paciente_fecha
  on consultas(paciente_id, fecha desc);

create table if not exists consulta_archivos (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid references consultas(id) on delete cascade,
  url text not null,
  tipo text,
  nombre text,
  tamano_bytes int,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists consulta_notas (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid references consultas(id) on delete cascade,
  autor_id uuid references auth.users(id),
  contenido text not null,
  created_at timestamptz default now()
);
