-- ============================================================
-- Correção: gen_salt / crypt no schema extensions (Supabase)
-- Cole no SQL Editor e execute.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- Criar usuário (com extensions.crypt / gen_salt)
create or replace function public.criar_usuario(
  p_login text,
  p_senha text,
  p_nome text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
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

  return v_id;
exception
  when unique_violation then
    raise exception 'Já existe um usuário com este login';
end;
$$;

-- Login
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

-- Alterar senha
create or replace function public.alterar_senha(
  p_login text,
  p_senha_atual text,
  p_senha_nova text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
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
  set senha_hash = extensions.crypt(p_senha_nova, extensions.gen_salt('bf'))
  where u.login = v_login
    and u.ativo = true
    and u.senha_hash = extensions.crypt(p_senha_atual, u.senha_hash);

  get diagnostics v_ok = row_count;
  return v_ok > 0;
end;
$$;

grant execute on function public.criar_usuario(text, text, text) to anon, authenticated;
grant execute on function public.login_usuario(text, text) to anon, authenticated;
grant execute on function public.alterar_senha(text, text, text) to anon, authenticated;
