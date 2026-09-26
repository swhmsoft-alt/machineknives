$env:CI = 'true'
$logPath = Join-Path $env:TEMP 'preview-test.log'
$workDir = (Get-Location).Path
# Kill anything on 4321 first
Get-NetTCPConnection -State Listen -LocalPort 4321 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

$argList = '/c', "astro preview --host 127.0.0.1 --port 4322 > `"$logPath`" 2>&1"
$proc = Start-Process -FilePath 'cmd.exe' -ArgumentList $argList -WorkingDirectory $workDir -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 6

$urls = @(
    'http://127.0.0.1:4322/sitemap-index.xml',
    'http://127.0.0.1:4322/sitemap-0.xml',
    'http://127.0.0.1:4322/robots.txt',
    'http://127.0.0.1:4322/'
)
foreach ($u in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5
        Write-Output ("{0}  {1}  {2} bytes" -f $r.StatusCode, $u, $r.RawContentLength)
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        Write-Output ("{0}  {1}" -f $code, $u)
    }
}

Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Write-Output "PREVIEW_TEST_DONE"
