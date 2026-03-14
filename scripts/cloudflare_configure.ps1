$token = "CDy_3KmDhh-re-28_tXLPXymz0Oy5T6OZTmpnKOc"
$zoneId = "84393dfc40c5af8d0841b62b8042f56a"
$accountId = "a7149932b29c325e1ec34d349bb9da47"
$ip = "223.184.241.22"
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
$base = "https://api.cloudflare.com/client/v4/zones/$zoneId"

function Upsert-DNSRecord($name, $ip, $proxied) {
    $existing = (Invoke-RestMethod -Uri "$base/dns_records?type=A&name=$name" -Headers $headers -TimeoutSec 20).result
    if ($existing -and $existing.Count -gt 0) {
        $id = $existing[0].id
        $body = @{ type="A"; name=$name; content=$ip; proxied=$proxied; ttl=1 } | ConvertTo-Json
        $r = Invoke-RestMethod -Uri "$base/dns_records/$id" -Method Put -Headers $headers -Body $body -TimeoutSec 20
        Write-Host "UPDATED: $name -> $ip (proxied=$proxied) | success=$($r.success)"
    } else {
        $body = @{ type="A"; name=$name; content=$ip; proxied=$proxied; ttl=1 } | ConvertTo-Json
        $r = Invoke-RestMethod -Uri "$base/dns_records" -Method Post -Headers $headers -Body $body -TimeoutSec 20
        Write-Host "CREATED: $name -> $ip (proxied=$proxied) | success=$($r.success)"
    }
}

Write-Host "=== Configuring DNS Records ==="
Upsert-DNSRecord "usgindia.in"     $ip $true
Upsert-DNSRecord "www.usgindia.in" $ip $true
Upsert-DNSRecord "api.usgindia.in" $ip $true

Write-Host ""
Write-Host "=== Setting SSL to Full ==="
$sslBody = @{ value="full" } | ConvertTo-Json
$ssl = Invoke-RestMethod -Uri "$base/settings/ssl" -Method Patch -Headers $headers -Body $sslBody -TimeoutSec 20
Write-Host "SSL Mode: $($ssl.result.value) | success=$($ssl.success)"

Write-Host ""
Write-Host "=== Enable Always Use HTTPS ==="
$httpsBody = @{ value="on" } | ConvertTo-Json
$https = Invoke-RestMethod -Uri "$base/settings/always_use_https" -Method Patch -Headers $headers -Body $httpsBody -TimeoutSec 20
Write-Host "Always HTTPS: $($https.result.value) | success=$($https.success)"

Write-Host ""
Write-Host "=== Enable HTTP/2 ==="
$h2Body = @{ value="on" } | ConvertTo-Json
$h2 = Invoke-RestMethod -Uri "$base/settings/http2" -Method Patch -Headers $headers -Body $h2Body -TimeoutSec 20
Write-Host "HTTP/2: $($h2.result.value) | success=$($h2.success)"

Write-Host ""
Write-Host "=== Enable Brotli ==="
$brBody = @{ value="on" } | ConvertTo-Json
$br = Invoke-RestMethod -Uri "$base/settings/brotli" -Method Patch -Headers $headers -Body $brBody -TimeoutSec 20
Write-Host "Brotli: $($br.result.value) | success=$($br.success)"

Write-Host ""
Write-Host "=== Enable Minify (JS/CSS/HTML) ==="
$minBody = @{ value=@{ css="on"; html="on"; js="on" } } | ConvertTo-Json
$min = Invoke-RestMethod -Uri "$base/settings/minify" -Method Patch -Headers $headers -Body $minBody -TimeoutSec 20
Write-Host "Minify: success=$($min.success)"

Write-Host ""
Write-Host "=== Set Browser Cache TTL = 14400s ==="
$cacheBody = @{ value=14400 } | ConvertTo-Json
$cache = Invoke-RestMethod -Uri "$base/settings/browser_cache_ttl" -Method Patch -Headers $headers -Body $cacheBody -TimeoutSec 20
Write-Host "Cache TTL: $($cache.result.value) | success=$($cache.success)"

Write-Host ""
Write-Host "=== Enable Rocket Loader (performance) ==="
$rlBody = @{ value="on" } | ConvertTo-Json
$rl = Invoke-RestMethod -Uri "$base/settings/rocket_loader" -Method Patch -Headers $headers -Body $rlBody -TimeoutSec 20
Write-Host "Rocket Loader: $($rl.result.value) | success=$($rl.success)"

Write-Host ""
Write-Host "=== Set Security Level = medium ==="
$secBody = @{ value="medium" } | ConvertTo-Json
$sec = Invoke-RestMethod -Uri "$base/settings/security_level" -Method Patch -Headers $headers -Body $secBody -TimeoutSec 20
Write-Host "Security: $($sec.result.value) | success=$($sec.success)"

Write-Host ""
Write-Host "============================================"
Write-Host "   ALL CLOUDFLARE SETTINGS CONFIGURED!"
Write-Host "   www.usgindia.in is now LIVE!"
Write-Host "============================================"
