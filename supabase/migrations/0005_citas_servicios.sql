-- 0005_citas_servicios.sql
-- Catálogo de servicios y agenda de citas con sync GHL.

create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre_es text not null,
  nombre_en text,
  descripcion_es text,
  descripcion_en text,
  duracion_min int default 30,
  precio numeric(10,2),
  activo boolean default true,
  destacado boolean default false,
  orden int default 0,
  created_at timestamptz default now()
);

create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete set null,
  servicio_id uuid references servicios(id),
  fecha_hora timestamptz not null,
  duracion_min int default 30,
  estado cita_estado_t default 'agendada',
  ghl_appointment_id text unique,
  notas text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_citas_fecha on citas(fecha_hora);
create index if not exists idx_citas_paciente on citas(paciente_id);
create index if not exists idx_citas_estado on citas(estado);

-- FK diferida que conecta consultas → citas
alter table consultas
  drop constraint if exists fk_consultas_cita,
  add constraint fk_consultas_cita
  foreign key (cita_id) references citas(id) on delete set null;
