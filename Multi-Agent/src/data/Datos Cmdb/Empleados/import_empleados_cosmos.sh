#!/usr/bin/env bash
set -euo pipefail

# Uso:
# ./import_empleados_cosmos.sh <resource_group> <account_name> <database_name> <container_name> <csv_file>
#
# Ejemplo:
# ./import_empleados_cosmos.sh rg-agents hctdevacb01 RRHH empleados empleados_cotemporal.csv

RESOURCE_GROUP="${1:-}"
ACCOUNT_NAME="${2:-}"
DATABASE_NAME="${3:-}"
CONTAINER_NAME="${4:-}"
CSV_FILE="${5:-}"

if [[ -z "$RESOURCE_GROUP" || -z "$ACCOUNT_NAME" || -z "$DATABASE_NAME" || -z "$CONTAINER_NAME" || -z "$CSV_FILE" ]]; then
  echo "Uso: $0 <resource_group> <account_name> <database_name> <container_name> <csv_file>"
  exit 1
fi

if [[ ! -f "$CSV_FILE" ]]; then
  echo "ERROR: No se encontró el archivo CSV: $CSV_FILE"
  exit 1
fi

echo ">> Creando base de datos si no existe (serverless, sin throughput)..."
az cosmosdb sql database create \
  --resource-group "$RESOURCE_GROUP" \
  --account-name "$ACCOUNT_NAME" \
  --name "$DATABASE_NAME" \
  --only-show-errors \
  --query "name" -o tsv >/dev/null || true

echo ">> Creando contenedor si no existe (serverless, sin throughput)..."
az cosmosdb sql container create \
  --resource-group "$RESOURCE_GROUP" \
  --account-name "$ACCOUNT_NAME" \
  --database-name "$DATABASE_NAME" \
  --name "$CONTAINER_NAME" \
  --partition-key-path "/department" \
  --only-show-errors \
  --query "name" -o tsv >/dev/null || true

echo ">> Obteniendo endpoint y key..."
ENDPOINT="https://${ACCOUNT_NAME}.documents.azure.com:443/"
PRIMARY_KEY=$(az cosmosdb keys list \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACCOUNT_NAME" \
  --type keys \
  --query "primaryMasterKey" -o tsv)

echo ">> Importando datos desde CSV a Cosmos DB..."
python3 <<EOF
import csv
from azure.cosmos import CosmosClient

endpoint = "$ENDPOINT"
key = "$PRIMARY_KEY"
database_name = "$DATABASE_NAME"
container_name = "$CONTAINER_NAME"
csv_file = "$CSV_FILE"

client = CosmosClient(endpoint, key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

with open(csv_file, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    count = 0
    for row in reader:
        status_raw = row["status"].strip()
        status_lower = status_raw.lower()

        doc = {
            "id": row["employeeId"],
            "employeeId": row["employeeId"],
            "fullName": row["fullName"],
            "department": row["department"],
            "position": row["position"],
            "email": row["email"],
            "startDate": row["startDate"],
            "status": status_raw
        }

        # Solo asignar endDate si está y el empleado está retirado
        end_date = row.get("endDate", "").strip()
        if status_lower == "retirado" and end_date:
            doc["endDate"] = end_date

        # Manejo de salary (int si es posible)
        salary_str = row.get("salary", "").strip()
        if salary_str:
            try:
                doc["salary"] = int(salary_str)
            except ValueError:
                # Si por algún motivo no es numérico, se guarda como string
                doc["salary"] = salary_str

        container.upsert_item(doc)
        count += 1

print(f"Importación completada. Documentos procesados: {count}")
EOF

echo ">> Proceso finalizado correctamente."
