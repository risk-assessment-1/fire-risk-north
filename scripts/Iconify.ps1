param(
  [string]$IconLibrary = "lucide",
  [string[]]$IconNames = @(),
  [string]$OutputDir = "src/assets/icons"
)

if ($IconNames.Count -eq 0) {
  Write-Host "Usage: ./scripts/Iconify.ps1 -IconLibrary 'lucide' -IconNames @('building-2', 'home')"
  exit 1
}

if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

foreach ($name in $IconNames) {
  $url = "https://api.iconify.design/$IconLibrary/$name.svg"
  $outFile = Join-Path $OutputDir "$name.svg"

  try {
    Invoke-WebRequest -Uri $url -OutFile $outFile -ErrorAction Stop
    Write-Host "Downloaded: $name.svg" -ForegroundColor Green
  } catch {
    Write-Host "Failed: $name.svg - $_" -ForegroundColor Red
  }
}
