// infra/main.bicep
targetScope = 'resourceGroup'

param location string = resourceGroup().location
param appName string = 'hr-desk'
param environment string = 'dev'

var resourceToken = toLower(uniqueString(subscription().id, resourceGroup().id, appName))
var tags = {
  Application: appName
  Environment: environment
}

module aiFoundry 'modules/ai_foundry.bicep' = {
  name: 'ai-foundry-deploy'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
  }
}

module cosmos 'modules/cosmos.bicep' = {
  name: 'cosmos-deploy'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
  }
}

module search 'modules/search.bicep' = {
  name: 'search-deploy'
  params: {
    location: location
    resourceToken: resourceToken
    tags: tags
  }
}

// Outputs for the script to capture
output AZURE_AI_PROJECT_NAME string = aiFoundry.outputs.projectName
output AZURE_AI_AGENT_ENDPOINT string = aiFoundry.outputs.projectConnectionString
output AZURE_OPENAI_ENDPOINT string = aiFoundry.outputs.openAiEndpoint
output AZURE_OPENAI_API_KEY string = aiFoundry.outputs.openAiKey
output COSMOS_ENDPOINT string = cosmos.outputs.cosmosEndpoint
output COSMOS_KEY string = cosmos.outputs.cosmosKey
output AZURE_SEARCH_ENDPOINT string = search.outputs.searchEndpoint
output AZURE_SEARCH_KEY string = search.outputs.searchKey
