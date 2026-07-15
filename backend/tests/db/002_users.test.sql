-- Schema tests for users.
-- Run against a TEST DB after migrations 001–002 (+ later ones fine).
-- psql -U postgres -d lms_ai_db_test -v ON_ERROR_STOP=1 -f backend/tests/db/002_users.test.sql

DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'users table does not exist';
  END IF;
END $$;

DO $$
DECLARE
  v_user_id uuid;
  v_is_active boolean;
BEGIN
  INSERT INTO users (full_name, email, password_hash)
  VALUES ('User Schema Test', 'user-schema-test@example.com', 'hash_x')
  RETURNING id, is_active INTO v_user_id, v_is_active;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'expected generated uuid id';
  END IF;

  IF v_is_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'expected is_active default TRUE';
  END IF;

  -- UNIQUE on email must reject duplicates
  BEGIN
    INSERT INTO users (full_name, email, password_hash)
    VALUES ('Dup', 'user-schema-test@example.com', 'hash_y');
    RAISE EXCEPTION 'expected unique violation on email';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;

  -- NOT NULL on email
  BEGIN
    INSERT INTO users (full_name, email, password_hash)
    VALUES ('No Email', NULL, 'hash_z');
    RAISE EXCEPTION 'expected not_null_violation on email';
  EXCEPTION
    WHEN not_null_violation THEN
      NULL;
  END;

  -- NOT NULL on password_hash
  BEGIN
    INSERT INTO users (full_name, email, password_hash)
    VALUES ('No Hash', 'user-no-hash@example.com', NULL);
    RAISE EXCEPTION 'expected not_null_violation on password_hash';
  EXCEPTION
    WHEN not_null_violation THEN
      NULL;
  END;

  DELETE FROM users WHERE id = v_user_id;

  RAISE NOTICE '002_users tests passed';
END $$;
