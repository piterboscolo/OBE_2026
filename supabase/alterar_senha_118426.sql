-- Troca a senha do RE 118426 para "jose"
-- Cole no SQL Editor do Supabase e execute.

update public.usuarios
set senha_hash = extensions.crypt('jose', extensions.gen_salt('bf'))
where login = '118426';

-- Conferir login
select * from public.login_usuario('118426', 'jose');
