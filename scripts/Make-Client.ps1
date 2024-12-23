param (
    [int]$Port,
    [string]$ClientPath,
    [string]$UIPath,
    [string]$OutputPath,
    [boolean]$Debug = $false
)

Set-Location $UIPath
Start-Process "npm" -ArgumentList "run build:cli$Port" -Wait
Copy-Item "$UIPath\dist\main.js" "$ClientPath\static\react\js\"
if ($Debug) {
    Copy-Item "$UIPath\dist\main.js.map" "$ClientPath\static\react\js\"
}
Copy-Item "$UIPath\dist\index.html" "$ClientPath\static\react\html\"
New-Item -Path "$ClientPath\static\react\public\" -ItemType Directory
Copy-Item "$UIPath\public\logo.jpg" "$ClientPath\static\react\public\"
Copy-Item "$UIPath\public\logo_1.jpg" "$ClientPath\static\react\public\"
Set-Location $ClientPath
Start-Process "go" -ArgumentList "build" -Wait
Copy-Item "$ClientPath\avdol-client.exe" "$OutputPath\cli$Port\"
Set-Location "$OutputPath\cli$Port\"
$env:AVDOL_CLIENT_API_PORT = "$Port"
$env:AVDOL_CLIENT_LOCAL_DB = "avdol$Port.locdb"
$env:AVDOL_CLIENT_LOG_PREFIX = 'dmvstv_v-local'
$env:AVDOL_SRV_PRIV_KEY = "id_rsa_avdol"
$env:AVDOL_SRV_ADMIN_PORT = "8082"
$env:AVDOL_SRV_ADMIN_TOKEN = "admin"
$env:AVDOL_SRV_TCP_PORT = "8084"
.\avdol-client.exe