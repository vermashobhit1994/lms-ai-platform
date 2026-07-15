-- Schema tests for roles + user_roles.
-- Run against a TEST DB after migrations 001–004.
-- Seed roles first if needed: seeders/001_user_roles.sql
-- psql -U postgres -d lms_ai_db_test -v ON_ERROR_STOP=1 -f backend/tests/db/003_roles_user_roles.test.sql

DO $$
BEGIN
  IF to_regclass('public.roles') IS NULL THEN
    RAISE EXCEPTION 'roles table does not exist';
  END IF;
  IF to_regclass('public.user_roles') IS NULL THEN
    RAISE EXCEPTION 'user_roles table does not exist';
  END IF;
END $$;

DO $$
DECLARE
  v_user_id uuid;
  v_role_id int;
  v_cnt int;
BEGIN
  -- Ensure a unique role name for this test run
  INSERT INTO roles (name)
  VALUES ('schema_test_role')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_role_id;

  -- UNIQUE on roles.name
  BEGIN
    INSERT INTO roles (name) VALUES ('schema_test_role');
    RAISE EXCEPTION 'expected unique violation on roles.name';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;

  INSERT INTO users (full_name, email, password_hash)
  VALUES ('Role Schema Test', 'role-schema-test@example.com', 'hash_x')
  RETURNING id INTO v_user_id;

  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, v_role_id);

  -- PRIMARY KEY (user_id, role_id) must reject duplicates
  BEGIN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id);
    RAISE EXCEPTION 'expected unique/pk violation on user_roles';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;

  -- FK: unknown user
  BEGIN
    INSERT INTO user_roles (user_id, role_id)
    VALUES ('00000000-0000-0000-0000-000000000000', v_role_id);
    RAISE EXCEPTION 'expected foreign_key_violation for user_id';
  EXCEPTION
    WHEN foreign_key_violation THEN
      NULL;
  END;

  -- FK: unknown role
  BEGIN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (v_user_id, 999999);
    RAISE EXCEPTION 'expected foreign_key_violation for role_id';
  EXCEPTION
    WHEN foreign_key_violation THEN
      NULL;
  END;

  -- ON DELETE CASCADE from users
  DELETE FROM users WHERE id = v_user_id;

  SELECT count(*) INTO v_cnt
  FROM user_roles
  WHERE user_id = v_user_id;

  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ON DELETE CASCADE failed for user_roles (user delete)';
  END IF;

  -- cleanup test role
  DELETE FROM roles WHERE id = v_role_id;

  RAISE NOTICE '003_roles_user_roles tests passed';
END $$;
