// infra/modules/search.bicep
param location string
param resourceToken string
param tags object

var searchServiceName = 'search-${resourceToken}'

resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: searchServiceName
  location: location
  tags: tags
  sku: {
    name: 'basic'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
  }
}

output searchEndpoint string = 'https://${searchServiceName}.search.windows.net'
output searchKey string = searchService.listAdminKeys().primaryKey
