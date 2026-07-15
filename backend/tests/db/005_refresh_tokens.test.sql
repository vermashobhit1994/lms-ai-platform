-- Schema tests for refresh_tokens.
-- Run against a TEST database after applying migrations 001–005.
-- psql -U postgres -d lms_ai_db_test -v ON_ERROR_STOP=1 -f src/db/tests/005_refresh_tokens.test.sql

DO $$
BEGIN
  IF to_regclass('public.refresh_tokens') IS NULL THEN
    RAISE EXCEPTION 'refresh_tokens table does not exist';
  END IF;
END $$;

DO $$
DECLARE
  v_user_id uuid;
  v_cnt int;
BEGIN
  INSERT INTO users (full_name, email, password_hash)
  VALUES ('Schema Test', 'schema-test@example.com', 'x')
  RETURNING id INTO v_user_id;

  INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
  VALUES (v_user_id, 'test_hash_1', now() + interval '7 days');

  -- UNIQUE on token_hash must reject duplicates
  BEGIN
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (v_user_id, 'test_hash_1', now() + interval '7 days');
    RAISE EXCEPTION 'expected unique violation on token_hash';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;

  -- FK must reject unknown user_id
  BEGIN
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ('00000000-0000-0000-0000-000000000000', 'test_hash_2', now() + interval '1 day');
    RAISE EXCEPTION 'expected foreign_key_violation';
  EXCEPTION
    WHEN foreign_key_violation THEN
      NULL;
  END;

  UPDATE refresh_tokens
  SET revoked_at = now()
  WHERE token_hash = 'test_hash_1';

  SELECT count(*) INTO v_cnt
  FROM refresh_tokens
  WHERE token_hash = 'test_hash_1'
    AND revoked_at IS NULL
    AND expires_at > now();

  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'revoked token still looks active';
  END IF;

  DELETE FROM users WHERE id = v_user_id;

  SELECT count(*) INTO v_cnt
  FROM refresh_tokens
  WHERE token_hash = 'test_hash_1';

  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ON DELETE CASCADE failed for refresh_tokens';
  END IF;

  RAISE NOTICE '005_refresh_tokens tests passed';
END $$;
