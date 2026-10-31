# SkyFlip Local Server & Hypixel API Bridge
# Requires NO Node.js or Python! Uses Windows built-in PowerShell .NET

$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " SkyFlip Server running at: $prefix" -ForegroundColor Cyan
    Write-Host " Bridging Hypixel SkyBlock Bazaar directly!" -ForegroundColor Yellow
    Write-Host " Press Ctrl+C in this window to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    # Launch browser automatically
    Start-Process $prefix

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath

        # Route 1: Local Direct Hypixel API Bridge (bypasses browser CORS completely)
        if ($path -eq "/api/bazaar") {
            try {
                $bazaarUrl = "https://api.hypixel.net/v2/skyblock/bazaar"
                $webClient = New-Object System.Net.WebClient
                $json = $webClient.DownloadString($bazaarUrl)
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } catch {
                $err = '{"success":false,"cause":"Failed to fetch Hypixel API"}'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($err)
                $response.StatusCode = 500
                $response.ContentType = "application/json"
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        }
        # Route 2: Static files (index.html, app.js, items_npc_data.js)
        else {
            if ($path -eq "/" -or $path -eq "") {
                $path = "/index.html"
            }
            $localFilePath = Join-Path $PSScriptRoot ($path.TrimStart('/'))

            if (Test-Path $localFilePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
                if ($path.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
                elseif ($path.EndsWith(".js")) { $response.ContentType = "application/javascript; charset=utf-8" }
                elseif ($path.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
                elseif ($path.EndsWith(".json")) { $response.ContentType = "application/json; charset=utf-8" }
                else { $response.ContentType = "application/octet-stream" }

                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
