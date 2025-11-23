// infra/modules/ai_foundry.bicep
param location string
param resourceToken string
param tags object

var aiHubName = 'ai-hub-${resourceToken}'
var aiProjectName = 'ai-project-${resourceToken}'
var openAiName = 'openai-${resourceToken}'

// 1. Azure OpenAI Service
resource openAi 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: openAiName
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: openAiName
  }
}

// Deploy GPT-4o model
resource gpt4o 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAi
  name: 'gpt-4o'
  sku: {
    name: 'Standard'
    capacity: 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-05-13'
    }
    raiPolicyName: 'Microsoft.Default'
  }
}

// 2. AI Hub (Machine Learning Workspace)
resource aiHub 'Microsoft.MachineLearningServices/workspaces@2024-01-01-preview' = {
  name: aiHubName
  location: location
  tags: tags
  kind: 'Hub'
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    friendlyName: 'HR Service Desk Hub'
  }
}

// 3. AI Project
resource aiProject 'Microsoft.MachineLearningServices/workspaces@2024-01-01-preview' = {
  name: aiProjectName
  location: location
  tags: tags
  kind: 'Project'
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    friendlyName: 'HR Service Desk Project'
    hubResourceId: aiHub.id
  }
}

// 4. Connection: Project -> OpenAI
resource openAiConnection 'Microsoft.MachineLearningServices/workspaces/connections@2024-01-01-preview' = {
  parent: aiProject
  name: 'aoai-connection'
  properties: {
    category: 'AzureOpenAI'
    target: openAi.properties.endpoint
    authType: 'ApiKey'
    isSharedToAll: true
    metadata: {
      ApiType: 'Azure'
      ResourceId: openAi.id
    }
    credentials: {
      key: openAi.listKeys().key1
    }
  }
}

output projectConnectionString string = 'https://${location}.api.azureml.ms' // Simplified discovery URL
output projectName string = aiProject.name
output openAiEndpoint string = openAi.properties.endpoint
output openAiKey string = openAi.listKeys().key1
