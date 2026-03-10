$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"

$root = $PSScriptRoot

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $url = $request.Url.LocalPath
    if ($url -eq "/") { $url = "/index.html" }
    
    $filePath = Join-Path $root $url.TrimStart("/")
    
    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $contentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".json" { "application/json" }
            default { "text/plain" }
        }
        
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $url")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    
    $response.Close()
}
