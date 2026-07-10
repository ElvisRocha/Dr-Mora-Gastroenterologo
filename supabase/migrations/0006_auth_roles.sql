-- 0006_auth_roles.sql
-- Perfiles de usuarios del sistema y configuración pública.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  rol rol_t not null,
  primary key (user_id, rol),
  created_at timestamptz default now()
);

create or replace function has_role(uid uuid, target_rol rol_t)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = uid and rol = target_rol
  );
$$;

create or replace function any_role(uid uuid, roles rol_t[])
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = uid and rol = any(roles)
  );
$$;

create table if not exists site_settings (
  id int primary key default 1,
  booking_enabled boolean default true,
  idioma_default idioma_t default 'es',
  whatsapp text,
  email_contacto text,
  direccion text,
  horario text,
  ghl_location_id text,
  ghl_calendar_id text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id, booking_enabled, idioma_default, email_contacto)
values (1, true, 'es', 'contacto@gastrokids.cr')
on conflict (id) do nothing;
