-- ============================================================
-- OBE 2026 SGE — Seed dos REs já cadastrados no sistema
-- Execute DEPOIS de supabase/usuarios.sql
-- Cole no SQL Editor do Supabase e rode.
-- Login = RE (sem dígito) | Senha = nome de guerra (minúsculas)
-- ============================================================

-- Ignora RE que já existir (não duplica)
do $$
declare
  r record;
begin
  for r in
    select * from (
      values
        ('171204', 'soriano', 'SORIANO'),
        ('200183', 'alyson', 'ALYSON'),
        ('102525', 'murilo', 'MURILO'),
        ('104032', 'roberto brito', 'ROBERTO BRITO'),
        ('150912', 'reis', 'REIS'),
        ('146472', 'castro', 'CASTRO'),
        ('103971', 'terin', 'TERIN'),
        ('105921', 'capaz', 'CAPAZ'),
        ('181028', 'rejane', 'REJANE'),
        ('201451', 'guilherme', 'GUILHERME'),
        ('104143', 'marcos', 'MARCOS'),
        ('130404', 'custodio', 'CUSTÓDIO'),
        ('104221', 'passos', 'PASSOS'),
        ('191906', 'jessica', 'JESSICA'),
        ('191042', 'rayane', 'RAYANE'),
        ('152709', 'marcella', 'MARCELLA'),
        ('136802', 'bezerra', 'BEZERRA'),
        ('129361', 'braga', 'BRAGA'),
        ('149756', 'russo', 'RUSSO'),
        ('910345', 'asaka', 'ASAKA'),
        ('981001', 'alex', 'ALEX'),
        ('100295', 'flavia', 'FLAVIA'),
        ('118455', 'tania', 'TANIA'),
        ('980874', 'granero', 'GRANERO'),
        ('930633', 'helder', 'HELDER'),
        ('118426', 'jose', 'JOSE ANTONIO')
    ) as t(login, senha, nome)
  loop
    begin
      perform public.criar_usuario(r.login, r.senha, r.nome);
    exception
      when others then
        -- já existe ou erro pontual: segue para o próximo
        raise notice 'Pulou %: %', r.login, sqlerrm;
    end;
  end loop;
end $$;

-- Conferência
select login, nome, ativo, criado_em
from public.usuarios
order by login;
