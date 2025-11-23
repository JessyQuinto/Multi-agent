import os
import csv
import uuid
import json
import glob
from typing import List, Dict, Any
from dotenv import load_dotenv
from azure.cosmos import CosmosClient, PartitionKey
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SimpleField,
    SearchableField,
    SearchFieldDataType,
    VectorSearch,
    HnswAlgorithmConfiguration,
    VectorSearchProfile
)

# Load environment variables
load_dotenv()

# Configuration
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_KEY = os.getenv("COSMOS_KEY")
COSMOS_DB_NAME = os.getenv("COSMOS_DATABASE_NAME", "hr_service_desk")
COSMOS_CONTAINER_EMPLOYEES = "employees"

AZURE_SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
AZURE_SEARCH_KEY = os.getenv("AZURE_SEARCH_KEY")
SEARCH_INDEX_NAME = "policies-index"

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "Datos Cmdb")

def init_cosmos():
    """Initialize Cosmos DB client and container."""
    print(f"🔌 Connecting to Cosmos DB at {COSMOS_ENDPOINT}...")
    client = CosmosClient(COSMOS_ENDPOINT, credential=COSMOS_KEY)
    database = client.create_database_if_not_exists(id=COSMOS_DB_NAME)
    
    # Create employees container
    container = database.create_container_if_not_exists(
        id=COSMOS_CONTAINER_EMPLOYEES,
        partition_key=PartitionKey(path="/id"),
        offer_throughput=400
    )
    print(f"✅ Cosmos DB container '{COSMOS_CONTAINER_EMPLOYEES}' ready.")
    return container

def ingest_employees(container):
    """Read CSV and upload employees to Cosmos DB."""
    csv_path = os.path.join(DATA_DIR, "Empleados", "empleados_cotemporal.csv")
    if not os.path.exists(csv_path):
        print(f"⚠️ Employee CSV not found at {csv_path}")
        return

    print(f"📄 Reading employees from {csv_path}...")
    count = 0
    with open(csv_path, mode='r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';') # Assuming semicolon based on typical regional formats, will check
        # If delimiter is comma, change to ','
        
        # Check first line to detect delimiter if needed, but let's try reading first
        rows = list(reader)
        if len(rows) > 0 and len(rows[0]) == 1:
            # Likely wrong delimiter, try comma
            csvfile.seek(0)
            reader = csv.DictReader(csvfile, delimiter=',')
            rows = list(reader)

        for row in rows:
            # Create a unique ID if not present, or use EmployeeID
            # Mapping fields to a standard schema
            # Adjust these keys based on actual CSV headers
            employee = {
                "id": row.get("EmployeeID", str(uuid.uuid4())),
                "name": row.get("Nombre", row.get("Name", "")),
                "role": row.get("Cargo", row.get("Role", "")),
                "department": row.get("Departamento", row.get("Department", "")),
                "email": row.get("Email", ""),
                "vacation_balance": int(row.get("SaldoVacaciones", row.get("VacationBalance", 15))),
                "payroll_info": {
                    "salary": row.get("Salario", row.get("Salary", 0)),
                    "last_payment_date": "2025-10-30" # Mock/Default
                },
                "metadata": row # Store original data too
            }
            
            container.upsert_item(employee)
            count += 1
            
    print(f"✅ Uploaded {count} employees to Cosmos DB.")

def init_search_index():
    """Create Azure AI Search index."""
    print(f"🔌 Connecting to Azure AI Search at {AZURE_SEARCH_ENDPOINT}...")
    credential = AzureKeyCredential(AZURE_SEARCH_KEY)
    index_client = SearchIndexClient(endpoint=AZURE_SEARCH_ENDPOINT, credential=credential)
    
    # Define Index
    fields = [
        SimpleField(name="id", type=SearchFieldDataType.String, key=True),
        SearchableField(name="content", type=SearchFieldDataType.String, analyzer_name="es.microsoft"),
        SimpleField(name="title", type=SearchFieldDataType.String, filterable=True),
        SimpleField(name="source", type=SearchFieldDataType.String, filterable=True),
        SimpleField(name="chunk_id", type=SearchFieldDataType.Int32, filterable=True),
    ]
    
    index = SearchIndex(name=SEARCH_INDEX_NAME, fields=fields)
    
    try:
        index_client.create_or_update_index(index)
        print(f"✅ Search index '{SEARCH_INDEX_NAME}' created/updated.")
    except Exception as e:
        print(f"❌ Error creating search index: {e}")
        return None
        
    return SearchClient(endpoint=AZURE_SEARCH_ENDPOINT, index_name=SEARCH_INDEX_NAME, credential=credential)

def extract_text_from_pdf(path):
    try:
        import pypdf
        reader = pypdf.PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except ImportError:
        print("❌ 'pypdf' library not found. Please run: pip install pypdf")
        return ""
    except Exception as e:
        print(f"⚠️ Error reading PDF {path}: {e}")
        return ""

def extract_text_from_docx(path):
    try:
        import docx
        doc = docx.Document(path)
        return "\n".join([para.text for para in doc.paragraphs])
    except ImportError:
        print("❌ 'python-docx' library not found. Please run: pip install python-docx")
        return ""
    except Exception as e:
        print(f"⚠️ Error reading DOCX {path}: {e}")
        return ""

def chunk_text(text, size=1000, overlap=100):
    """Simple text chunking."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk)
        start += size - overlap
    return chunks

def ingest_policies(search_client):
    """Read policies and upload to Azure AI Search."""
    policies_dir = os.path.join(DATA_DIR, "Politicas Colombia Transforma")
    if not os.path.exists(policies_dir):
        print(f"⚠️ Policies directory not found at {policies_dir}")
        return

    print(f"📄 Processing policies from {policies_dir}...")
    files = glob.glob(os.path.join(policies_dir, "*.*"))
    
    documents = []
    total_chunks = 0
    
    for file_path in files:
        filename = os.path.basename(file_path)
        print(f"   Processing {filename}...")
        
        text = ""
        if filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif filename.lower().endswith(".docx"):
            text = extract_text_from_docx(file_path)
        
        if not text:
            continue
            
        chunks = chunk_text(text)
        
        for i, chunk in enumerate(chunks):
            # Create a safe ID (base64 encoded or simple hash)
            import base64
            safe_id = base64.urlsafe_b64encode(f"{filename}-{i}".encode()).decode().strip("=")
            
            doc = {
                "id": safe_id,
                "content": chunk,
                "title": filename,
                "source": "policy",
                "chunk_id": i
            }
            documents.append(doc)
            total_chunks += 1
            
            # Upload in batches of 100
            if len(documents) >= 100:
                search_client.upload_documents(documents=documents)
                print(f"   Uploaded batch of {len(documents)} chunks...")
                documents = []

    # Upload remaining
    if documents:
        search_client.upload_documents(documents=documents)
        print(f"   Uploaded final batch of {len(documents)} chunks.")
        
    print(f"✅ Ingested {total_chunks} policy chunks to Azure AI Search.")

def main():
    print("🚀 Starting Data Ingestion...")
    
    # 1. Cosmos DB (Employees)
    try:
        container = init_cosmos()
        ingest_employees(container)
    except Exception as e:
        print(f"❌ Cosmos DB Ingestion Failed: {e}")

    # 2. Azure AI Search (Policies)
    try:
        search_client = init_search_index()
        if search_client:
            ingest_policies(search_client)
    except Exception as e:
        print(f"❌ Azure AI Search Ingestion Failed: {e}")

if __name__ == "__main__":
    main()
