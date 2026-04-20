# AURA 4K - Conversion WebP
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $folder

Write-Host ""
Write-Host "========================================"
Write-Host "   AURA 4K - Conversion WebP"
Write-Host "========================================"
Write-Host ""

$images = Get-ChildItem -Path $folder -Include "*.jpg","*.jpeg","*.png" -Recurse
$count = $images.Count

if ($count -eq 0) {
    Write-Host "Aucune image trouvee."
    Read-Host
    exit
}

Write-Host "Dossier: $folder"
Write-Host "$count images trouvees"
Write-Host ""
Write-Host "Conversion..."
Write-Host ""

$converted = 0
$skipped = 0

foreach ($img in $images) {
    $base = $img.BaseName
    $webp = $img.FullName -replace '\.(jpg|jpeg|png)$', '.webp'
    
    if (Test-Path $webp) {
        $skipped++
        Remove-Item $img.FullName -Force
        Write-Host "$base.webp [JP G supprime]" -ForegroundColor Cyan
    } else {
        magick "$($img.FullName)" -quality 85 "$webp" 2>$null
        if ($?) {
            $converted++
            Remove-Item $img.FullName
            Write-Host "$base.webp [OK]" -ForegroundColor Green
        } else {
            Write-Host "$base.jpg [ERREUR]" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "   RAPPORT"
Write-Host "========================================"
Write-Host ""
Write-Host "Converties: $converted" -ForegroundColor Cyan
Write-Host "Ignorees:  $skipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "Termine!"
Read-Host
