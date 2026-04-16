@echo off
cd /d "C:\Users\User\Desktop\aura-4k"

:: Installe les dépendances si node_modules n'existe pas encore
if not exist "node_modules" (
    echo Installation des dependances...
    npm install
)

:: Lance le launcher
npm start
