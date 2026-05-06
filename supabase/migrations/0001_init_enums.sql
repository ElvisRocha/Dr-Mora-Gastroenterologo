-- 0001_init_enums.sql
-- Enums centrales del proyecto Gastro Kids.

create extension if not exists "pgcrypto";

do $$ begin
  create type sexo_t as enum ('masculino','femenino','intersexual','no_especificado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rh_t as enum ('positivo','negativo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_parto_t as enum ('eutocico','cesarea','instrumentado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_lactancia_t as enum ('materna_exclusiva','formula','mixta','no_aplica');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bristol_t as enum ('1','2','3','4','5','6','7');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rol_t as enum ('admin','doctor','secretaria');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cita_estado_t as enum ('agendada','confirmada','realizada','cancelada','no_asistio');
exception when duplicate_object then null; end $$;

do $$ begin
  create type relacion_tutor_t as enum ('madre','padre','abuelo','tio','tutor_legal','otro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type idioma_t as enum ('es','en');
exception when duplicate_object then null; end $$;
