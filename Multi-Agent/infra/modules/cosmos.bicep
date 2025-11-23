// infra/modules/cosmos.bicep
param location string
param resourceToken string
param tags object

var cosmosAccountName = 'cosmos-${resourceToken}'
var databaseName = 'hr-db'

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = {
  name: cosmosAccountName
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-11-15' = {
  parent: cosmosAccount
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
  }
}

// Containers
resource casesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'cases'
  properties: {
    resource: {
      id: 'cases'
      partitionKey: {
        paths: ['/user_id']
        kind: 'Hash'
      }
    }
  }
}

resource employeesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'employees'
  properties: {
    resource: {
      id: 'employees'
      partitionKey: {
        paths: ['/email']
        kind: 'Hash'
      }
    }
  }
}

output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosKey string = cosmosAccount.listKeys().primaryMasterKey
output databaseName string = databaseName
