$ProjectRoot = Split-Path -Parent $PSScriptRoot

Start-Process `
  -FilePath "node.exe" `
  -ArgumentList @(".\node_modules\next\dist\bin\next", "dev", "--hostname", "127.0.0.1", "--port", "3000") `
  -WorkingDirectory $ProjectRoot `
  -RedirectStandardOutput (Join-Path $ProjectRoot ".next-dev.log") `
  -RedirectStandardError (Join-Path $ProjectRoot ".next-dev.err.log") `
  -WindowStyle Hidden `
  -PassThru
