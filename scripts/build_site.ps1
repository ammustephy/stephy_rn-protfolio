# Windows version of scripts/build_site.sh, for building and checking the
# site locally. Run from the repository root:  .\scripts\build_site.ps1
# Flutter prints notices on stderr, which Windows PowerShell would treat as
# errors under 'Stop', so check exit codes instead.
$ErrorActionPreference = 'Continue'

flutter pub get
if ($LASTEXITCODE -ne 0) { throw 'flutter pub get failed' }
flutter build web --release --base-href /classic/
if ($LASTEXITCODE -ne 0) { throw 'flutter build web failed' }

if (Test-Path build/site) { Remove-Item -Recurse -Force build/site }
New-Item -ItemType Directory -Force build/site/classic | Out-Null
Copy-Item -Recurse -Force web3d/* build/site/
Remove-Item -Force build/site/README.md -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force build/web/* build/site/classic/

Write-Host 'Site assembled in build/site'
