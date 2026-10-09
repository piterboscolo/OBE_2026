-- ============================================================
-- Monitor de acessos — Auxílio ao Público (OBE 2026 SGE)
-- Conta cliques/aberturas de página somente no banco.
-- Cole no SQL Editor do Supabase e execute.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Log de cada abertura (1 linha = 1 clique)
-- ------------------------------------------------------------
create table if not exists public.acessos_apoio_publico (
  id uuid primary key default gen_random_uuid(),
  pagina_id text not null,
  pagina_titulo text,
  categoria text,
  login text,
  nome text,
  criado_em timestamptz not null default now(),
  constraint acessos_apoio_publico_pagina_id_chk check (
    char_length(trim(pagina_id)) >= 2
  )
);

create index if not exists idx_acessos_ap_pagina
  on public.acessos_apoio_publico (pagina_id);

create index if not exists idx_acessos_ap_criado
  on public.acessos_apoio_publico (criado_em desc);

create index if not exists idx_acessos_ap_login
  on public.acessos_apoio_publico (login);

create index if not exists idx_acessos_ap_categoria
  on public.acessos_apoio_publico (categoria);

comment on table public.acessos_apoio_publico is
  'Log de cliques/aberturas das páginas de Auxílio ao Público';
comment on column public.acessos_apoio_publico.pagina_id is
  'ID da rota no app (ex.: abastecimento, pi-hospital, shopping-west-plaza)';
comment on column public.acessos_apoio_publico.categoria is
  'Grupo: menu, hospital, metro, shopping, parques, espacos, delegacias';

alter table public.acessos_apoio_publico enable row level security;

-- ------------------------------------------------------------
-- 2) Registrar 1 acesso (chamar a cada clique no app)
-- ------------------------------------------------------------
create or replace function public.registrar_acesso_apoio_publico(
  p_pagina_id text,
  p_pagina_titulo text default null,
  p_categoria text default null,
  p_login text default null,
  p_nome text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_id uuid;
  v_pagina text;
  v_login text;
begin
  v_pagina := lower(trim(p_pagina_id));
  if v_pagina is null or char_length(v_pagina) < 2 then
    raise exception 'pagina_id inválido';
  end if;

  v_login := nullif(lower(trim(p_login)), '');

  insert into public.acessos_apoio_publico (
    pagina_id,
    pagina_titulo,
    categoria,
    login,
    nome
  )
  values (
    v_pagina,
    nullif(trim(p_pagina_titulo), ''),
    nullif(lower(trim(p_categoria)), ''),
    v_login,
    nullif(trim(p_nome), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.registrar_acesso_apoio_publico(text, text, text, text, text)
  to anon, authenticated;

-- ------------------------------------------------------------
-- 3) Totais por página (contador)
-- ------------------------------------------------------------
create or replace function public.totais_acessos_apoio_publico(
  p_desde timestamptz default null,
  p_ate timestamptz default null
)
returns table (
  pagina_id text,
  pagina_titulo text,
  categoria text,
  total_acessos bigint,
  ultimo_acesso timestamptz
)
language sql
security definer
set search_path = public
set row_security = off
as $$
  select
    a.pagina_id,
    max(a.pagina_titulo) filter (where a.pagina_titulo is not null) as pagina_titulo,
    max(a.categoria) filter (where a.categoria is not null) as categoria,
    count(*)::bigint as total_acessos,
    max(a.criado_em) as ultimo_acesso
  from public.acessos_apoio_publico a
  where (p_desde is null or a.criado_em >= p_desde)
    and (p_ate is null or a.criado_em <= p_ate)
  group by a.pagina_id
  order by total_acessos desc, a.pagina_id;
$$;

grant execute on function public.totais_acessos_apoio_publico(timestamptz, timestamptz)
  to anon, authenticated;

-- ------------------------------------------------------------
-- 4) Totais por categoria (Hospital, Shopping, etc.)
-- ------------------------------------------------------------
create or replace function public.totais_acessos_por_categoria(
  p_desde timestamptz default null,
  p_ate timestamptz default null
)
returns table (
  categoria text,
  total_acessos bigint,
  paginas_distintas integer,
  ultimo_acesso timestamptz
)
language sql
security definer
set search_path = public
set row_security = off
as $$
  select
    coalesce(nullif(trim(a.categoria), ''), 'sem_categoria') as categoria,
    count(*)::bigint as total_acessos,
    count(distinct a.pagina_id)::integer as paginas_distintas,
    max(a.criado_em) as ultimo_acesso
  from public.acessos_apoio_publico a
  where (p_desde is null or a.criado_em >= p_desde)
    and (p_ate is null or a.criado_em <= p_ate)
  group by 1
  order by total_acessos desc;
$$;

grant execute on function public.totais_acessos_por_categoria(timestamptz, timestamptz)
  to anon, authenticated;

-- ------------------------------------------------------------
-- 5) Acessos por dia (série temporal)
-- ------------------------------------------------------------
create or replace function public.acessos_apoio_publico_por_dia(
  p_desde date default (current_date - 30),
  p_ate date default current_date
)
returns table (
  dia date,
  total_acessos bigint
)
language sql
security definer
set search_path = public
set row_security = off
as $$
  select
    (a.criado_em at time zone 'America/Sao_Paulo')::date as dia,
    count(*)::bigint as total_acessos
  from public.acessos_apoio_publico a
  where (a.criado_em at time zone 'America/Sao_Paulo')::date
        between coalesce(p_desde, current_date - 30) and coalesce(p_ate, current_date)
  group by 1
  order by 1;
$$;

grant execute on function public.acessos_apoio_publico_por_dia(date, date)
  to anon, authenticated;

-- ------------------------------------------------------------
-- 6) Consultas úteis (rode no SQL Editor para monitorar)
-- ------------------------------------------------------------

-- Exemplo: registrar um clique manualmente (teste)
-- select public.registrar_acesso_apoio_publico(
--   'pi-hospital',
--   'Hospital',
--   'hospital',
--   '118426',
--   'Operador Teste'
-- );

-- Ranking geral de páginas
-- select * from public.totais_acessos_apoio_publico();

-- Totais só de hoje (horário de São Paulo)
-- select * from public.totais_acessos_apoio_publico(
--   (current_date::timestamp at time zone 'America/Sao_Paulo'),
--   ((current_date + 1)::timestamp at time zone 'America/Sao_Paulo')
-- );

-- Por categoria
-- select * from public.totais_acessos_por_categoria();

-- Por dia (últimos 30 dias)
-- select * from public.acessos_apoio_publico_por_dia();

-- Últimos 50 cliques
-- select pagina_id, pagina_titulo, categoria, login, criado_em
-- from public.acessos_apoio_publico
-- order by criado_em desc
-- limit 50;

-- Páginas sugeridas do módulo Auxílio ao Público (referencia):
--   abastecimento          → menu Auxílio ao Público
--   pi-hospital            → Hospital
--   pi-metro               → Metro
--   pi-shopping            → Shopping
--   pi-parques             → Parques
--   pi-espacos             → Espaços
--   pi-delegacias          → Delegacias
--   shopping-west-plaza, shopping-bourbon, hosp-*, parque-*, etc.
