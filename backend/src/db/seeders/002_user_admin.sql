-- 1) Insert admin user (use a REAL argon2id hash, not '$argon2id$...')
WITH new_admin AS (
  INSERT INTO users (full_name, email, password_hash)
  VALUES (
    'System Admin',
    'admin@example.com',
    -- TODO: implement argon2id hash in Step3 of password service
    '$argon2id$v=19$m=65536,t=3,p=4$REPLACE_WITH_REAL_SALT_AND_HASH'
  )
  RETURNING id
)
-- 2) Attach admin role (this is what’s missing in your current seeder)
INSERT INTO user_roles (user_id, role_id)
SELECT new_admin.id, roles.id
FROM new_admin
JOIN roles ON roles.name = 'admin';
