-- ============================================================
-- OBE 2026 SGE — Usuários (login / senha)
-- Cole no SQL Editor do Supabase e execute.
-- ============================================================

-- Extensão para hash de senha (bcrypt)
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabela de usuários
-- ------------------------------------------------------------
create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  login text not null,
  senha_hash text not null,
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint usuarios_login_unico unique (login),
  constraint usuarios_login_formato check (
    char_length(trim(login)) >= 3
    and login = lower(trim(login))
  )
);

create index if not exists idx_usuarios_login on public.usuarios (login);
create index if not exists idx_usuarios_ativo on public.usuarios (ativo);

comment on table public.usuarios is 'Usuários do SGE OBE 2026 (login e senha)';
comment on column public.usuarios.login is 'Login único (sempre em minúsculas)';
comment on column public.usuarios.senha_hash is 'Hash bcrypt da senha (nunca armazenar senha em texto puro)';

-- Atualiza automaticamente atualizado_em
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_usuarios_atualizado_em on public.usuarios;
create trigger trg_usuarios_atualizado_em
before update on public.usuarios
for each row
execute function public.set_atualizado_em();

-- ------------------------------------------------------------
-- Criar usuário
-- Retorna o id do usuário criado
-- ------------------------------------------------------------
create or replace function public.criar_usuario(
  p_login text,
  p_senha text,
  p_nome text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_login text;
begin
  v_login := lower(trim(p_login));

  if v_login is null or char_length(v_login) < 3 then
    raise exception 'Login deve ter no mínimo 3 caracteres';
  end if;

  if p_senha is null or char_length(p_senha) < 4 then
    raise exception 'Senha deve ter no mínimo 4 caracteres';
  end if;

  if p_nome is null or char_length(trim(p_nome)) < 2 then
    raise exception 'Nome é obrigatório';
  end if;

  insert into public.usuarios (login, senha_hash, nome)
  values (
    v_login,
    crypt(p_senha, gen_salt('bf')),
    trim(p_nome)
  )
  returning id into v_id;

  return v_id;
exception
  when unique_violation then
    raise exception 'Já existe um usuário com este login';
end;
$$;

-- ------------------------------------------------------------
-- Login (valida login + senha)
-- Retorna dados do usuário se ok; senão, nenhuma linha
-- ------------------------------------------------------------
create or replace function public.login_usuario(
  p_login text,
  p_senha text
)
returns table (
  id uuid,
  login text,
  nome text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_login text;
begin
  v_login := lower(trim(p_login));

  return query
  select u.id, u.login, u.nome
  from public.usuarios u
  where u.login = v_login
    and u.ativo = true
    and u.senha_hash = crypt(p_senha, u.senha_hash);
end;
$$;

-- ------------------------------------------------------------
-- Alterar senha
-- ------------------------------------------------------------
create or replace function public.alterar_senha(
  p_login text,
  p_senha_atual text,
  p_senha_nova text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_login text;
  v_ok boolean;
begin
  v_login := lower(trim(p_login));

  if p_senha_nova is null or char_length(p_senha_nova) < 4 then
    raise exception 'Nova senha deve ter no mínimo 4 caracteres';
  end if;

  update public.usuarios u
  set senha_hash = crypt(p_senha_nova, gen_salt('bf'))
  where u.login = v_login
    and u.ativo = true
    and u.senha_hash = crypt(p_senha_atual, u.senha_hash);

  get diagnostics v_ok = row_count;
  return v_ok > 0;
end;
$$;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.usuarios enable row level security;

-- Impede leitura direta da tabela (senha_hash) via API
-- O acesso deve ser só pelas funções (security definer)
drop policy if exists "usuarios_sem_acesso_direto" on public.usuarios;

-- Sem policies de SELECT/INSERT/UPDATE/DELETE abertas:
-- a tabela fica bloqueada para o papel anon/authenticated via PostgREST.
-- As funções security definer continuam funcionando.

-- Libera execução das funções para anon (login no app)
grant usage on schema public to anon, authenticated;
grant execute on function public.criar_usuario(text, text, text) to anon, authenticated;
grant execute on function public.login_usuario(text, text) to anon, authenticated;
grant execute on function public.alterar_senha(text, text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- Exemplos (descomente para testar no SQL Editor)
-- ------------------------------------------------------------
-- select public.criar_usuario('admin', 'admin123', 'Administrador');
-- select * from public.login_usuario('admin', 'admin123');
-- select public.alterar_senha('admin', 'admin123', 'novaSenha456');
