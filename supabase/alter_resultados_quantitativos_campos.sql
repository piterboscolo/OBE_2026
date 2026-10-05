-- ============================================================
-- Migração: novos campos do Resultado Quantitativo
-- Execute no SQL Editor do Supabase (projeto já em uso).
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

-- Remove funções antigas (assinatura antiga)
drop function if exists public.salvar_resultado_quantitativo(text, text, integer, integer, integer, integer, integer, integer, integer, numeric);
drop function if exists public.listar_resultados_quantitativos(text, integer);

create or replace function public.salvar_resultado_quantitativo(
  p_login text,
  p_nome text,
  p_pessoas_abordadas integer,
  p_pessoas_presa_detida integer,
  p_veiculos_fiscalizados integer,
  p_automoveis_fiscalizados integer,
  p_motocicletas_vistoriadas integer,
  p_automoveis_removidos integer,
  p_motos_removidas integer,
  p_apoio_ao_publico integer,
  p_bopm integer,
  p_conducao_ao_dp integer,
  p_flagrante_delito integer,
  p_ait_lavrados integer,
  p_armas_apreendidas integer,
  p_drogas_kg numeric
)
returns uuid
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_id uuid;
  v_login text;
begin
  v_login := lower(trim(p_login));
  if v_login is null or char_length(v_login) < 3 then
    raise exception 'Login inválido';
  end if;

  insert into public.resultados_quantitativos (
    login,
    nome,
    pessoas_abordadas,
    pessoas_presa_detida,
    veiculos_fiscalizados,
    automoveis_fiscalizados,
    motocicletas_vistoriadas,
    automoveis_removidos,
    motos_removidas,
    apoio_ao_publico,
    bopm,
    conducao_ao_dp,
    flagrante_delito,
    ait_lavrados,
    armas_apreendidas,
    drogas_kg
  )
  values (
    v_login,
    nullif(trim(coalesce(p_nome, '')), ''),
    greatest(coalesce(p_pessoas_abordadas, 0), 0),
    greatest(coalesce(p_pessoas_presa_detida, 0), 0),
    greatest(coalesce(p_veiculos_fiscalizados, 0), 0),
    greatest(coalesce(p_automoveis_fiscalizados, 0), 0),
    greatest(coalesce(p_motocicletas_vistoriadas, 0), 0),
    greatest(coalesce(p_automoveis_removidos, 0), 0),
    greatest(coalesce(p_motos_removidas, 0), 0),
    greatest(coalesce(p_apoio_ao_publico, 0), 0),
    greatest(coalesce(p_bopm, 0), 0),
    greatest(coalesce(p_conducao_ao_dp, 0), 0),
    greatest(coalesce(p_flagrante_delito, 0), 0),
    greatest(coalesce(p_ait_lavrados, 0), 0),
    greatest(coalesce(p_armas_apreendidas, 0), 0),
    greatest(coalesce(p_drogas_kg, 0), 0)
  )
  returning id into v_id;

  return v_id;
end;
$$;

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
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_login text;
  v_limite integer;
begin
  v_login := nullif(lower(trim(coalesce(p_login, ''))), '');
  v_limite := least(greatest(coalesce(p_limite, 20), 1), 100);

  return query
  select
    r.id,
    r.login,
    r.nome,
    r.pessoas_abordadas,
    r.pessoas_presa_detida,
    r.veiculos_fiscalizados,
    r.automoveis_fiscalizados,
    r.motocicletas_vistoriadas,
    r.automoveis_removidos,
    r.motos_removidas,
    r.apoio_ao_publico,
    r.bopm,
    r.conducao_ao_dp,
    r.flagrante_delito,
    r.ait_lavrados,
    r.armas_apreendidas,
    r.drogas_kg,
    r.criado_em
  from public.resultados_quantitativos r
  where v_login is null or r.login = v_login
  order by r.criado_em desc
  limit v_limite;
end;
$$;

grant execute on function public.salvar_resultado_quantitativo(text, text, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, integer, numeric) to anon, authenticated;
grant execute on function public.listar_resultados_quantitativos(text, integer) to anon, authenticated;
