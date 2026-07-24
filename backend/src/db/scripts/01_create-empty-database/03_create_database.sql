-- WARNING: This script will DESTROY ALL DATA in the database
-- Creates the app database

-- cmd or powershell command to run this script
--   psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f scripts/01_create-empty-database/01_create-empty-database/03_create_database.sql

-- psql shell command to run this script
--  \i J:/projects/internmo/lms-ai-platform/backend/src/db/scripts/01_create-empty-database/01_create-empty-database/03_create_database.sql

CREATE DATABASE "{{DB_NAME}}";
