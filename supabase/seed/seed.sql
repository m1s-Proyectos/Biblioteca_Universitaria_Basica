-- Seed de desarrollo: usuarios de prueba SGBU
-- Ejecutar SOLO en entornos de desarrollo.
-- El trigger on_auth_user_created crea las filas en public.usuarios.

-- Credenciales (desarrollo):
-- admin@sgbu.dev          / Admin123!
-- bibliotecario@sgbu.dev  / Biblio123!
-- estudiante1@sgbu.dev    / Est123!
-- estudiante2@sgbu.dev    / Est223!

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_instance_id UUID;
BEGIN
  SELECT id INTO v_instance_id FROM auth.instances LIMIT 1;
  IF v_instance_id IS NULL THEN
    v_instance_id := '00000000-0000-0000-0000-000000000000';
  END IF;

  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    v_instance_id,
    'authenticated',
    'authenticated',
    'admin@sgbu.dev',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Admin SGBU","rol":"admin","matricula":"ADM-001"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    v_instance_id,
    'authenticated',
    'authenticated',
    'bibliotecario@sgbu.dev',
    crypt('Biblio123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Bibliotecario SGBU","rol":"bibliotecario","matricula":"BIB-001"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    v_instance_id,
    'authenticated',
    'authenticated',
    'estudiante1@sgbu.dev',
    crypt('Est123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Estudiante Uno","rol":"estudiante","matricula":"EST-001"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    v_instance_id,
    'authenticated',
    'authenticated',
    'estudiante2@sgbu.dev',
    crypt('Est223!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Estudiante Dos","rol":"estudiante","matricula":"EST-002"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'admin@sgbu.dev'),
    'email',
    'a0000000-0000-0000-0000-000000000001',
    now(), now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000002', 'email', 'bibliotecario@sgbu.dev'),
    'email',
    'a0000000-0000-0000-0000-000000000002',
    now(), now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000003', 'email', 'estudiante1@sgbu.dev'),
    'email',
    'a0000000-0000-0000-0000-000000000003',
    now(), now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000004', 'email', 'estudiante2@sgbu.dev'),
    'email',
    'a0000000-0000-0000-0000-000000000004',
    now(), now(), now()
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Asegurar roles correctos si el usuario ya existia
UPDATE public.usuarios SET rol = 'admin', nombre = 'Admin SGBU', matricula = 'ADM-001'
WHERE email = 'admin@sgbu.dev';

UPDATE public.usuarios SET rol = 'bibliotecario', nombre = 'Bibliotecario SGBU', matricula = 'BIB-001'
WHERE email = 'bibliotecario@sgbu.dev';

UPDATE public.usuarios SET rol = 'estudiante', nombre = 'Estudiante Uno', matricula = 'EST-001'
WHERE email = 'estudiante1@sgbu.dev';

UPDATE public.usuarios SET rol = 'estudiante', nombre = 'Estudiante Dos', matricula = 'EST-002'
WHERE email = 'estudiante2@sgbu.dev';
