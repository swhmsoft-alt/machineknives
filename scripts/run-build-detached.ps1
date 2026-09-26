$env:CI = 'true'
$logPath = Join-Path $env:TEMP 'npm-build.log'
$workDir = (Get-Location).Path
$argList = '/c', "npm run build > `"$logPath`" 2>&1"
Start-Process -FilePath 'cmd.exe' -ArgumentList $argList -WorkingDirectory $workDir -WindowStyle Hidden -Wait
Write-Output "BUILD_EXIT_DONE"
