# From backend/src/db:
#   .\scripts\02_run_migrations.ps1

param(
  [string]$Database = "lms_ai_db",
  [string]$User = "postgres"
)

$ErrorActionPreference = "Stop"
# $PSScriptRoot = .../backend/src/db/scripts → parent is .../backend/src/db
$root = Split-Path -Parent $PSScriptRoot
$migrations = Join-Path $root "migrations"

$files = @(
  "001_enable_extensions.sql",
  "002_create_users.sql",
  "003_create_roles.sql",
  "004_create_user_roles_mappings.sql",
  "005_create_refresh_tokens.sql"
)

$psqlArgs = @(
  "-U", $User,
  "-d", $Database,
  "-v", "ON_ERROR_STOP=1"
)

foreach ($file in $files) {
  $path = Join-Path $migrations $file
  if (-not (Test-Path $path)) {
    throw "Missing migration file: $path"
  }
  Write-Host "Queued $file"
  $psqlArgs += @("-f", $path)
}

Write-Host "Applying $($files.Count) migrations to $Database (one connection)..."
& psql @psqlArgs
if ($LASTEXITCODE -ne 0) {
  throw "Migration run failed"
}

Write-Host "All migrations applied to $Database"
