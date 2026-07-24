-- WARNING: This script will DESTROY ALL DATA in the database
-- Creates the app database

-- cmd or powershell command to run this script
--   psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f scripts/01_create-empty-database/01_create-empty-database/01_terminate_connections.sql

-- psql shell command to run this script
--  \i J:/projects/internmo/lms-ai-platform/backend/src/db/scripts/01_create-empty-database/01_create-empty-database/01_terminate_connections.sql

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '{{DB_NAME}}'
  AND pid <> pg_backend_pid();
