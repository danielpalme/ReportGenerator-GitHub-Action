param(
[string]$From,
[string]$To)

Write-Host $From
Write-Host $To

((Get-Content -path package.json -Raw) -replace $From, $To) | Set-Content -Path package.json -NoNewline
((Get-Content -path package-lock.json -Raw) -replace $From, $To) | Set-Content -Path package-lock.json -NoNewline
((Get-Content -path README.md -Raw) -replace $From, $To) | Set-Content -Path README.md -NoNewline
((Get-Content -path src\reportgenerator.ts -Raw) -replace $From, $To) | Set-Content -Path src\reportgenerator.ts -NoNewline

npm run build

git commit -a -m $To
git tag -f 5