-- ============================================================
-- Resultado Quantitativo — OBE 2026 SGE
-- Cole no SQL Editor do Supabase e execute.
-- ============================================================

create table if not exists public.resultados_quantitativos (
  id uuid primary key default gen_random_uuid(),
  login text not null,
  nome text,
  pessoas_abordadas integer not null default 0 check (pessoas_abordadas >= 0),
  veiculos_fiscalizados integer not null default 0 check (veiculos_fiscalizados >= 0),
  apoio_ao_publico integer not null default 0 check (apoio_ao_publico >= 0),
  bopm integer not null default 0 check (bopm >= 0),
  conducao_ao_dp integer not null default 0 check (conducao_ao_dp >= 0),
  flagrante_delito integer not null default 0 check (flagrante_delito >= 0),
  armas_apreendidas integer not null default 0 check (armas_apreendidas >= 0),
  drogas_kg numeric(12, 3) not null default 0 check (drogas_kg >= 0),
  criado_em timestamptz not null default now()
);

create index if not exists idx_rq_login on public.resultados_quantitativos (login);
create index if not exists idx_rq_criado on public.resultados_quantitativos (criado_em desc);

alter table public.resultados_quantitativos enable row level security;

create or replace function public.salvar_resultado_quantitativo(
  p_login text,
  p_nome text,
  p_pessoas_abordadas integer,
  p_veiculos_fiscalizados integer,
  p_apoio_ao_publico integer,
  p_bopm integer,
  p_conducao_ao_dp integer,
  p_flagrante_delito integer,
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
    veiculos_fiscalizados,
    apoio_ao_publico,
    bopm,
    conducao_ao_dp,
    flagrante_delito,
    armas_apreendidas,
    drogas_kg
  )
  values (
    v_login,
    nullif(trim(coalesce(p_nome, '')), ''),
    greatest(coalesce(p_pessoas_abordadas, 0), 0),
    greatest(coalesce(p_veiculos_fiscalizados, 0), 0),
    greatest(coalesce(p_apoio_ao_publico, 0), 0),
    greatest(coalesce(p_bopm, 0), 0),
    greatest(coalesce(p_conducao_ao_dp, 0), 0),
    greatest(coalesce(p_flagrante_delito, 0), 0),
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
  veiculos_fiscalizados integer,
  apoio_ao_publico integer,
  bopm integer,
  conducao_ao_dp integer,
  flagrante_delito integer,
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
    r.veiculos_fiscalizados,
    r.apoio_ao_publico,
    r.bopm,
    r.conducao_ao_dp,
    r.flagrante_delito,
    r.armas_apreendidas,
    r.drogas_kg,
    r.criado_em
  from public.resultados_quantitativos r
  where v_login is null or r.login = v_login
  order by r.criado_em desc
  limit v_limite;
end;
$$;

revoke all on function public.salvar_resultado_quantitativo(text, text, integer, integer, integer, integer, integer, integer, integer, numeric) from public;
revoke all on function public.listar_resultados_quantitativos(text, integer) from public;
grant execute on function public.salvar_resultado_quantitativo(text, text, integer, integer, integer, integer, integer, integer, integer, numeric) to anon, authenticated;
grant execute on function public.listar_resultados_quantitativos(text, integer) to anon, authenticated;
