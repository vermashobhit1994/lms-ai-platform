-- Creates the app database (not the test DB).

-- cmd or powershell command to run this script
--   psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f scripts/01_create_database.sql

-- psql shell command to run this script
--  \i J:/projects/internmo/lms-ai-platform/backend/src/db/scripts/01_create_database.sql

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'lms_ai_db'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS lms_ai_db;
CREATE DATABASE lms_ai_db;
