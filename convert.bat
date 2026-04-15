@echo off
chcp 65001 >nul
title AURA 4K - Conversion WebP

echo.
echo ========================================
echo    AURA 4K - Conversion WebP
echo ========================================
echo.

:: Verifier ImageMagick
magick --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: ImageMagick non installe!
    echo.
    echo Telecharge: https://imagemagick.org/script/download.php
    echo.
    pause
    exit /b 1
)

:: Dossier du script
set "SCRIPT_DIR=%~dp0"

echo Dossier: %SCRIPT_DIR%
echo.

:: Compter les images
echo Analyse...
set count=0
for /r "%SCRIPT_DIR%" %%i in (*.jpg *.jpeg *.png) do set /a count+=1

if %count%==0 (
    echo Aucune image trouvee.
    pause
    exit /b 0
)

echo %count% images trouvees
echo.
echo Conversion...
echo.

set converted=0
set skipped=0

for /r "%SCRIPT_DIR%" %%i in (*.jpg *.jpeg *.png) do (
    set "INPUT=%%i"
    set "OUTPUT=%%~dpi%%~ni.webp"
    
    if exist "%OUTPUT%" (
        set /a skipped+=1
        <nul set /p "=o"
    ) else (
        magick "%INPUT%" -quality 85 "%OUTPUT%" 2>nul
        if %errorlevel%==0 (
            set /a converted+=1
            <nul set /p "=x"
        ) else (
            <nul set /p "=!"
        )
    )
)

echo.
echo.
echo ========================================
echo    RAPPORT
echo ========================================
echo.
echo Converties: %converted%
echo Ignorees:   %skipped%
echo.
echo Termine!
echo.
pause
