$token       = "eyJhIjoiYTcxNDk5MzJiMjljMzI1ZTFlYzM0ZDM0OWJiOWRhNDciLCJ0IjoiMmQ4MGI5NjItMzBlYi00MjhmLTgxYWUtNGNkMWI4MmJkOWRiIiwicyI6IlpqRXpZVEJsTURjdE5UZG1aQzAwWm1NNUxXSXpabVF0TmpRMU1HUTFZVFZtWlRjMCJ9"
$accountId   = "a7149932b29c325e1ec34d349bb9da47"
$zoneId      = "84393dfc40c5af8d0841b62b8042f56a"
$tunnelName  = "usgindia-tunnel"
$credFile    = "C:\Users\m\.cloudflare\$tunnelName.json"
$configFile  = "C:\Users\m\.cloudflare\config.yml"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

$base = "https://api.cloudflare.com/client/v4/accounts/$accountId/cfd_tunnel"

Write-Host "=== Step 1: Create Cloudflare Tunnel ===" -ForegroundColor Cyan
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
$body = @{ name = $tunnelName; tunnel_secret = $secret } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri $base -Method Post -Headers $headers -Body $body -TimeoutSec 30
$tunnelId = $resp.result.id
$tunnelToken = $resp.result.token
Write-Host "Tunnel Created! ID: $tunnelId" -ForegroundColor Green

Write-Host ""
Write-Host "=== Step 2: Save tunnel credentials ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "C:\Users\m\.cloudflare" | Out-Null
$cred = @{
    AccountTag   = $accountId
    TunnelSecret = $resp.result.tunnel_secret
    TunnelID     = $tunnelId
} | ConvertTo-Json
$cred | Out-File -FilePath $credFile -Encoding utf8
Write-Host "Credentials saved to $credFile" -ForegroundColor Green

Write-Host ""
Write-Host "=== Step 3: Create DNS CNAME records ===" -ForegroundColor Cyan
$dnsBase = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records"

function Upsert-CNAME($name, $target) {
    $existing = (Invoke-RestMethod -Uri "$dnsBase?name=$name" -Headers $headers -TimeoutSec 20).result
    $cnameBody = @{ type="CNAME"; name=$name; content=$target; proxied=$true; ttl=1 } | ConvertTo-Json
    if ($existing -and $existing.Count -gt 0) {
        $id = $existing[0].id
        $r = Invoke-RestMethod -Uri "$dnsBase/$id" -Method Put -Headers $headers -Body $cnameBody -TimeoutSec 20
        Write-Host "UPDATED CNAME: $name -> $target | success=$($r.success)" -ForegroundColor Green
    } else {
        $r = Invoke-RestMethod -Uri $dnsBase -Method Post -Headers $headers -Body $cnameBody -TimeoutSec 20
        Write-Host "CREATED CNAME: $name -> $target | success=$($r.success)" -ForegroundColor Green
    }
}

$cfTarget = "$tunnelId.cfargotunnel.com"
Upsert-CNAME "usgindia.in"     $cfTarget
Upsert-CNAME "www.usgindia.in" $cfTarget
Upsert-CNAME "api.usgindia.in" $cfTarget

Write-Host ""
Write-Host "=== Step 4: Write cloudflared config.yml ===" -ForegroundColor Cyan
$configYml = @"
tunnel: $tunnelId
credentials-file: $credFile

ingress:
  - hostname: www.usgindia.in
    service: http://localhost:3000
  - hostname: usgindia.in
    service: http://localhost:3000
  - hostname: api.usgindia.in
    service: http://localhost:3001
  - service: http_status:404
"@

$configYml | Out-File -FilePath $configFile -Encoding utf8
Write-Host "Config saved to $configFile" -ForegroundColor Green

Write-Host ""
Write-Host "=== Step 5: Saving tunnel token to .env ===" -ForegroundColor Cyan
Write-Host "TUNNEL_TOKEN=$tunnelToken"
Write-Host "TUNNEL_ID=$tunnelId"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  TUNNEL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "  Tunnel ID: $tunnelId" -ForegroundColor Green
Write-Host "  Now starting cloudflared..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
