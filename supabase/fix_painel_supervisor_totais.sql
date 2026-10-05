-- ============================================================
-- Correção: totais do Painel do Supervisor (todos os campos)
-- Execute no SQL Editor do Supabase.
-- ============================================================

alter table public.resultados_quantitativos
  add column if not exists pessoas_presa_detida integer not null default 0;
alter table public.resultados_quantitativos
  add column if not exists automoveis_fiscalizados integer not null default 0;
alter table public.resultados_quantitativos
  add column if not exists motocicletas_vistoriadas integer not null default 0;
alter table public.resultados_quantitativos
  add column if not exists automoveis_removidos integer not null default 0;
alter table public.resultados_quantitativos
  add column if not exists motos_removidas integer not null default 0;
alter table public.resultados_quantitativos
  add column if not exists ait_lavrados integer not null default 0;

-- Recria listar com todos os campos (evita conflito de nomes OUT)
drop function if exists public.listar_resultados_quantitativos(text, integer);

create or replace function public.listar_resultados_quantitativos(
  p_login text default null,
  p_limite integer default 20
)
returns table (
  id uuid,
  login text,
  nome text,
  pessoas_abordadas integer,
  pessoas_presa_detida integer,
  veiculos_fiscalizados integer,
  automoveis_fiscalizados integer,
  motocicletas_vistoriadas integer,
  automoveis_removidos integer,
  motos_removidas integer,
  apoio_ao_publico integer,
  bopm integer,
  conducao_ao_dp integer,
  flagrante_delito integer,
  ait_lavrados integer,
  armas_apreendidas integer,
  drogas_kg numeric,
  criado_em timestamptz
)
language sql
security definer
set search_path = public
set row_security = off
as $$
  select
    r.id,
    r.login,
    r.nome,
    r.pessoas_abordadas,
    coalesce(r.pessoas_presa_detida, 0),
    r.veiculos_fiscalizados,
    coalesce(r.automoveis_fiscalizados, 0),
    coalesce(r.motocicletas_vistoriadas, 0),
    coalesce(r.automoveis_removidos, 0),
    coalesce(r.motos_removidas, 0),
    r.apoio_ao_publico,
    r.bopm,
    r.conducao_ao_dp,
    r.flagrante_delito,
    coalesce(r.ait_lavrados, 0),
    r.armas_apreendidas,
    r.drogas_kg,
    r.criado_em
  from public.resultados_quantitativos r
  where nullif(lower(trim(coalesce(p_login, ''))), '') is null
     or r.login = lower(trim(p_login))
  order by r.criado_em desc
  limit least(greatest(coalesce(p_limite, 20), 1), 500);
$$;

-- Totais agregados (fonte do Painel do Supervisor)
drop function if exists public.totais_resultados_quantitativos();

create or replace function public.totais_resultados_quantitativos()
returns json
language sql
security definer
set search_path = public
set row_security = off
as $$
  select json_build_object(
    'envios', count(*)::integer,
    'pessoas_abordadas', coalesce(sum(pessoas_abordadas), 0)::integer,
    'pessoas_presa_detida', coalesce(sum(pessoas_presa_detida), 0)::integer,
    'veiculos_fiscalizados', coalesce(sum(veiculos_fiscalizados), 0)::integer,
    'automoveis_fiscalizados', coalesce(sum(automoveis_fiscalizados), 0)::integer,
    'motocicletas_vistoriadas', coalesce(sum(motocicletas_vistoriadas), 0)::integer,
    'automoveis_removidos', coalesce(sum(automoveis_removidos), 0)::integer,
    'motos_removidas', coalesce(sum(motos_removidas), 0)::integer,
    'apoio_ao_publico', coalesce(sum(apoio_ao_publico), 0)::integer,
    'bopm', coalesce(sum(bopm), 0)::integer,
    'conducao_ao_dp', coalesce(sum(conducao_ao_dp), 0)::integer,
    'flagrante_delito', coalesce(sum(flagrante_delito), 0)::integer,
    'ait_lavrados', coalesce(sum(ait_lavrados), 0)::integer,
    'armas_apreendidas', coalesce(sum(armas_apreendidas), 0)::integer,
    'drogas_kg', coalesce(sum(drogas_kg), 0)
  )
  from public.resultados_quantitativos;
$$;

grant execute on function public.listar_resultados_quantitativos(text, integer) to anon, authenticated;
grant execute on function public.totais_resultados_quantitativos() to anon, authenticated;

notify pgrst, 'reload schema';
