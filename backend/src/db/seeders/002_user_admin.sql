-- 1) Insert admin user (use a REAL argon2id hash, not '$argon2id$...')

-- Common Table Expression (CTE) to store data in temporary table and
-- store generated user id in new_admin
WITH new_admin AS (
  INSERT INTO users (full_name, email, password_hash)
  VALUES (
    $1,
    $2,
    $3
  )
  RETURNING id
)
-- 2) Attach admin role (this is what’s missing in your current seeder)
INSERT INTO user_roles (user_id, role_id)
SELECT new_admin.id, roles.id
FROM new_admin
JOIN roles ON roles.name = 'admin';
