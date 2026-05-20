@echo off
setlocal

pushd "%~dp0"

echo Starting PostgreSQL with Docker Compose...
docker compose up -d postgres

echo Starting auth-service...
start "auth-service" cmd /k "cd /d ""%~dp0services\auth-service"" && npm run start:dev"

echo Starting gateway...
start "gateway" cmd /k "cd /d ""%~dp0gateway"" && npm run start:dev"

echo Waiting for the gateway to finish booting...
timeout /t 10 /nobreak >nul

echo Opening Apollo Sandbox Explorer...
start "" "https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql"

popd
endlocal