-- ============================================================
-- Correção: garantir gravação do usuário no banco
-- Cole no SQL Editor e execute.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- Garante a tabela
create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  login text not null,
  senha_hash text not null,
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint usuarios_login_unico unique (login)
);

-- RLS: permite que a função (security definer) grave com segurança
alter table public.usuarios enable row level security;

drop policy if exists "usuarios_select_none" on public.usuarios;
drop policy if exists "usuarios_insert_none" on public.usuarios;

-- Sem policies abertas para anon na tabela (só via função)
-- A função roda como dono e com row_security off

create or replace function public.criar_usuario(
  p_login text,
  p_senha text,
  p_nome text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
set row_security = off
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
    extensions.crypt(p_senha, extensions.gen_salt('bf')),
    trim(p_nome)
  )
  returning id into v_id;

  if v_id is null then
    raise exception 'Falha ao gravar usuário';
  end if;

  -- confirma que existe
  if not exists (select 1 from public.usuarios where id = v_id) then
    raise exception 'Usuário não encontrado após o insert';
  end if;

  return v_id;
exception
  when unique_violation then
    raise exception 'Já existe um usuário com este login';
end;
$$;

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
set search_path = public, extensions
set row_security = off
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
    and u.senha_hash = extensions.crypt(p_senha, u.senha_hash);
end;
$$;

revoke all on function public.criar_usuario(text, text, text) from public;
revoke all on function public.login_usuario(text, text) from public;
grant execute on function public.criar_usuario(text, text, text) to anon, authenticated;
grant execute on function public.login_usuario(text, text) to anon, authenticated;

-- Conferir usuários atuais
select id, login, nome, ativo, criado_em
from public.usuarios
order by criado_em desc;
