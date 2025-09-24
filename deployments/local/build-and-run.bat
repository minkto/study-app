@echo off

:: Command line arguments
set PROJECT_PATH=%~1
set DEST_DIR=%~2
set ENABLE_DB_MIGRATION=%~3


:: Set defaults if not provided
if "%PROJECT_PATH%"=="" (
	echo You must set the root path of the project as an argument.
	pause
	exit
)
if "%DEST_DIR%"=="" (
	echo You must set the destination path of the project as an argument.
	pause
	exit
)

if "%ENABLE_DB_MIGRATION%"=="" set ENABLE_DB_MIGRATION=1

echo Setting Build Variables
echo Using PROJECT_PATH: %PROJECT_PATH%
echo Using DEST_DIR: %DEST_DIR%
echo DB Migration Flag: %ENABLE_DB_MIGRATION%

:: Run build (change to build directory first)
cd /d "%PROJECT_PATH%"


echo 🚀 Building Next.js app in standalone mode...
:: Run build
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Exiting...
    pause
    exit /b %errorlevel%
)

if "%ENABLE_DB_MIGRATION%"=="1" (
	echo 🚀 Performing DB Migration
	call npm run migrate-deploy:postgres
	if %errorlevel% neq 0 (
		echo ❌ Prisma DB Migration failed! Exiting...
		pause
		exit /b !errorlevel!
	)
)

:: Copy standalone folder to Web Application folder
xcopy "%PROJECT_PATH%\.next\standalone" "%DEST_DIR%\standalone\" /E /I /Y


:: Copy standalone folder to Web Application folder
xcopy "%PROJECT_PATH%\.next\static" "%DEST_DIR%\standalone\.next\static\" /E /I /Y


:: Copy public folder to Web Application folder
xcopy "%PROJECT_PATH%\public" "%DEST_DIR%\standalone\public\" /E /I /Y


:: Copy .env variables to Web Application folder
xcopy "%PROJECT_PATH%\.env" "%DEST_DIR%\standalone\" /Y


:: Change to standalone folder
cd /d "%DEST_DIR%\standalone\"
:: Run the server
echo ✅ Starting Next.js standalone server on http://localhost:3000
node server.js
:: Keep window open
pause