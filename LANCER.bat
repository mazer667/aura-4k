@echo off
cd /d "C:\Users\User\Desktop\Aura 4K"

:: Installe les dépendances si node_modules n'existe pas encore
if not exist "node_modules" (
    echo Installation des dependances...
    npm install
)

:: Lance le launcher
npm start
