param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $true)]
    [string]$StorageAccountName,

    [string]$TableName = "VacacionesSaldo",

    [string]$CsvPath = "./empleados_cotemporal.csv",

    [string]$PartitionKey = "COTEMPORAL",

    [int]$DiasTotalesAnuales = 15
)

Write-Host ">> Leyendo CSV desde: $CsvPath"
if (-not (Test-Path $CsvPath)) {
    Write-Error "No se encontró el archivo CSV."
    exit 1
}

Write-Host ">> Obteniendo Storage Account Key..."
$accountKey = az storage account keys list `
    --resource-group $ResourceGroupName `
    --account-name $StorageAccountName `
    --query "[0].value" `
    -o tsv

Write-Host ">> Creando tabla (si no existe)..."
az storage table create `
    --name $TableName `
    --account-name $StorageAccountName `
    --account-key $accountKey `
    -o none

Write-Host ">> Cargando CSV..."
$empleados = Import-Csv -Path $CsvPath

$hoy = (Get-Date).ToString("yyyy-MM-dd")

foreach ($emp in $empleados) {

    $estado = $emp.status.Trim().ToUpper()

    if ($estado -ne "ACTIVO") {
        Write-Host ">> Empleado $($emp.employeeId) ($($emp.fullName)) NO ACTIVO - omitido."
        continue
    }

    $dias = Get-Random -Minimum 5 -Maximum 21

    Write-Host ">> Insertando $($emp.employeeId) - $($emp.fullName) con $dias días disponibles..."

    $entity = @"
PartitionKey=$PartitionKey
RowKey=$($emp.employeeId)
employeeId=$($emp.employeeId)
fullName="$($emp.fullName)"
department="$($emp.department)"
position="$($emp.position)"
email="$($emp.email)"
startDate="$($emp.startDate)"
endDate="$($emp.endDate)"
status="$estado"
diasDisponibles=int:$dias
diasEnTramite=int:0
diasTotalesAnuales=int:$DiasTotalesAnuales
fechaActualizacion="$hoy"
"@

    az storage entity insert `
        --table-name $TableName `
        --account-name $StorageAccountName `
        --account-key $accountKey `
        --if-exists replace `
        --entity $entity `
        -o none
}

Write-Host ">> Proceso completado correctamente."
