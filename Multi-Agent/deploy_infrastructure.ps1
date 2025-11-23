# deploy_infrastructure.ps1
param (
    [string]$ResourceGroupName = "rg-hr-service-desk",
    [string]$Location = "eastus2"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Infrastructure Deployment (Azure CLI)..." -ForegroundColor Cyan

# 1. Check Azure Login
Write-Host "🔍 Checking Azure login..."
$account = az account show 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Not logged in. Please run 'az login' first." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Logged in." -ForegroundColor Green

# 2. Create Resource Group
Write-Host "📦 Creating/Updating Resource Group: $ResourceGroupName..."
az group create --name $ResourceGroupName --location $Location --output none
Write-Host "✅ Resource Group ready." -ForegroundColor Green

# 3. Deploy Bicep
Write-Host "🏗️ Deploying Bicep templates (this may take 5-10 mins)..."
$deploymentName = "hr-desk-deploy-$(Get-Date -Format 'yyyyMMddHHmm')"
$deploymentOutput = az deployment group create `
    --name $deploymentName `
    --resource-group $ResourceGroupName `
    --template-file "infra/main.bicep" `
    --output json | ConvertFrom-Json

if (-not $deploymentOutput) {
    Write-Host "❌ Deployment Failed or returned no output!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment Complete!" -ForegroundColor Green

# 4. Extract Outputs
$outputs = $deploymentOutput.properties.outputs
$envUpdates = @{}

if ($outputs) {
    foreach ($key in $outputs.PSObject.Properties.Name) {
        $val = $outputs.$key.value
        $envUpdates[$key] = $val
        Write-Host "   🔑 $key extracted."
    }
}

# 5. Update .env files
function Update-EnvFile {
    param ($Path, $Updates)
    
    if (-not (Test-Path $Path)) {
        Write-Host "⚠️ File not found: $Path" -ForegroundColor Yellow
        return
    }

    $content = Get-Content $Path
    $newContent = @()
    
    # Read existing lines and update if key exists
    foreach ($line in $content) {
        $found = $false
        foreach ($key in $Updates.Keys) {
            if ($line -match "^$key=") {
                $newContent += "$key=$($Updates[$key])"
                $Updates.Remove($key) # Remove so we know what's left
                $found = $true
                break
            }
        }
        if (-not $found) {
            $newContent += $line
        }
    }

    # Append remaining new keys
    foreach ($key in $Updates.Keys) {
        $newContent += "$key=$($Updates[$key])"
    }

    $newContent | Set-Content $Path
    Write-Host "✅ Updated $Path" -ForegroundColor Green
}

# Clone updates hash because the function modifies it
$backendUpdates = $envUpdates.Clone()
$mcpUpdates = $envUpdates.Clone()

Write-Host "📝 Updating .env files..."
Update-EnvFile -Path "src/backend/.env" -Updates $backendUpdates
Update-EnvFile -Path "src/mcp_server/.env" -Updates $mcpUpdates

Write-Host "🎉 Infrastructure Setup Complete! You can now run the provisioning script." -ForegroundColor Cyan
