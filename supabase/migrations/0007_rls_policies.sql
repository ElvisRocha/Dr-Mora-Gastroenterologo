-- 0007_rls_policies.sql
-- Row Level Security: rol-based access control.

-- Activar RLS en tablas clínicas
alter table pacientes enable row level security;
alter table tutores enable row level security;
alter table expediente_master enable row level security;
alter table antropometria enable row level security;
alter table procedimientos enable row level security;
alter table medicamentos enable row level security;
alter table vacunas enable row level security;
alter table consultas enable row level security;
alter table consulta_archivos enable row level security;
alter table consulta_notas enable row level security;
alter table citas enable row level security;
alter table servicios enable row level security;
alter table site_settings enable row level security;
alter table profiles enable row level security;
alter table user_roles enable row level security;

-- Pacientes y tutores: admin/doctor/secretaria pueden ver y modificar
create policy pacientes_clinico_all on pacientes
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]));

create policy tutores_clinico_all on tutores
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]));

-- Expediente y datos clínicos sensibles: solo admin y doctor
create policy expediente_master_clinico on expediente_master
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy antropometria_clinico on antropometria
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy procedimientos_clinico on procedimientos
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy medicamentos_clinico on medicamentos
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy vacunas_clinico on vacunas
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy consultas_clinico on consultas
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy consulta_archivos_clinico on consulta_archivos
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

create policy consulta_notas_clinico on consulta_notas
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor']::rol_t[]));

-- Citas: admin/doctor/secretaria
create policy citas_all on citas
  for all to authenticated
  using (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]))
  with check (any_role(auth.uid(), array['admin','doctor','secretaria']::rol_t[]));

-- Servicios: lectura pública (anon), modificación admin
create policy servicios_public_read on servicios
  for select to anon, authenticated
  using (true);

create policy servicios_admin_write on servicios
  for all to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

-- Site settings: lectura pública, modificación admin
create policy site_settings_public_read on site_settings
  for select to anon, authenticated
  using (true);

create policy site_settings_admin_write on site_settings
  for update to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

-- Profiles: cada usuario ve y edita el suyo; admin lee todo
create policy profiles_self on profiles
  for all to authenticated
  using (id = auth.uid() or has_role(auth.uid(), 'admin'))
  with check (id = auth.uid() or has_role(auth.uid(), 'admin'));

-- User roles: solo admin
create policy user_roles_admin on user_roles
  for all to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));
