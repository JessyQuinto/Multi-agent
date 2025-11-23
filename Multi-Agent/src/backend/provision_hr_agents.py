import os
import asyncio
import json
from azure.ai.projects import AIProjectClient
from azure.ai.agents.models import ConnectedAgentTool, MessageRole
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

ENDPOINT = os.getenv("AZURE_AI_AGENT_ENDPOINT")
PROJECT_NAME = os.getenv("AZURE_AI_PROJECT_NAME")

if not ENDPOINT:
    print("❌ Error: AZURE_AI_AGENT_ENDPOINT not found in .env")
    exit(1)

print(f"🔌 Connecting to Azure AI Foundry Project at: {ENDPOINT}")

# ================================================================
# 1. Initialize Azure AI Foundry Project Client
# ================================================================
print(f"🔑 Initializing credentials...")
credential = DefaultAzureCredential()

subscription_id = os.getenv("AZURE_AI_SUBSCRIPTION_ID")
resource_group = os.getenv("AZURE_AI_RESOURCE_GROUP")
project_name = os.getenv("AZURE_AI_PROJECT_NAME")

if not all([subscription_id, resource_group, project_name]):
    print("❌ Missing required environment variables (SUB, RG, PROJECT)")
    exit(1)

# Full Agents Endpoint Strategy
agents_endpoint = f"{ENDPOINT}/agents/v1.0/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{project_name}"
print(f"🔌 Connecting to Agents Endpoint: {agents_endpoint}")

try:
    project_client = AIProjectClient(
        endpoint=agents_endpoint,
        credential=credential,
        subscription_id=subscription_id,
        resource_group=resource_group,
        project_name=project_name,
    )
    print("✅ Client initialized")
except Exception as e:
    print(f"❌ Client init error: {e}")
    exit(1)

def create_or_update_agent(name, model, instructions, tools=None):
    """
    Helper to create or update an agent. 
    """
    print(f"\n🤖 Provisioning Agent: {name}...")
    try:
        agent = project_client.agents.create_agent(
            model=model,
            name=name,
            instructions=instructions,
            tools=tools if tools else []
        )
        print(f"   ✅ Created Agent ID: {agent.id}")
        return agent
    except Exception as e:
        print(f"   ❌ Error creating agent {name}: {e}")
        return None

def main():
    # ================================================================
    # 2. Create Agents (Idempotent)
    # ================================================================

    # Load existing agent IDs
    existing_ids = {}
    # Fix: Look for agent_ids.json in the same directory as this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    agent_ids_path = os.path.join(script_dir, "agent_ids.json")
    
    if os.path.exists(agent_ids_path):
        try:
            with open(agent_ids_path, "r") as f:
                existing_ids = json.load(f)
            print(f"📋 Loaded existing agent IDs from {agent_ids_path}")
        except Exception as e:
            print(f"⚠️ Could not load agent_ids.json: {e}")
    else:
        print(f"⚠️ agent_ids.json not found at {agent_ids_path}. Creating new agents.")

    class AgentRef:
        def __init__(self, id, name):
            self.id = id
            self.name = name

    def get_or_create(key, name, model, instructions, tools=None):
        if key in existing_ids:
            print(f"⏩ Skipping {name} (already exists: {existing_ids[key]})")
            return AgentRef(existing_ids[key], name)
        else:
            return create_or_update_agent(name, model, instructions, tools)

    # -------------------------
    # Intent Agent
    # -------------------------
    intent_agent = get_or_create(
        "intent_id",
        "IntentAgent",
        "gpt-4o",
        (
            "Clasifica la intención del usuario para solicitudes de RRHH. "
            "Identifica si es: certificado, vacaciones, beneficios, nómina, políticas "
            "o si requiere escalamiento humano (casos sensibles). "
            "Devuelve: intent, confidence, missing_fields."
        )
    )

    if not intent_agent:
        print("Stopping due to error.")
        return

    intent_tool = ConnectedAgentTool(
        id=intent_agent.id,
        name=intent_agent.name,
        description="Clasifica la intención del ticket de RRHH."
    )

    # -------------------------
    # Administrative Agent (Runbooks)
    # -------------------------
    admin_agent = get_or_create(
        "admin_id",
        "AdministrativeAgent",
        "gpt-4o",
        (
            "Eres un agente administrativo encargado de ejecutar tareas transaccionales de RRHH. "
            "Puedes generar certificados, revisar vacaciones, solicitar vacaciones, consultar nómina y beneficios. "
            "Si faltan datos para ejecutar un runbook, pide aclaraciones."
        )
    )

    admin_tool_connected = ConnectedAgentTool(
        id=admin_agent.id,
        name=admin_agent.name,
        description="Ejecuta tareas administrativas de RRHH (certificados, vacaciones, nómina)."
    )

    # -------------------------
    # Policy Agent (RAG)
    # -------------------------
    policy_agent = get_or_create(
        "policy_id",
        "PolicyAgent",
        "gpt-4o",
        (
            "Eres experto en políticas de RRHH. "
            "Usa el sistema de RAG para responder preguntas usando documentos internos. "
            "Si no está en las políticas, indica que debe contactar RRHH."
        )
    )

    policy_tool = ConnectedAgentTool(
        id=policy_agent.id,
        name=policy_agent.name,
        description="Responde consultas sobre políticas internas de RRHH usando RAG."
    )

    # -------------------------
    # Proxy Agent (Human Escalation)
    # -------------------------
    proxy_agent = get_or_create(
        "proxy_id",
        "ProxyAgent",
        "gpt-4o",
        (
            "Eres el agente de escalamiento. "
            "Recibes solicitudes que requieren intervención humana: conflictos laborales, quejas, temas sensibles. "
            "Tu trabajo es derivar el caso a un agente humano y registrar los detalles."
        )
    )

    proxy_tool = ConnectedAgentTool(
        id=proxy_agent.id,
        name=proxy_agent.name,
        description="Gestiona escalamiento humano en casos complejos."
    )

    # ================================================================
    # 3. Create Orchestrator Agent
    # ================================================================
    
    # Prepare tools for Orchestrator
    final_tools = []
    try:
        if hasattr(intent_tool, 'definitions'):
            final_tools.extend(intent_tool.definitions)
        else:
            final_tools.append(intent_tool)
            
        if hasattr(admin_tool_connected, 'definitions'):
            final_tools.extend(admin_tool_connected.definitions)
        else:
            final_tools.append(admin_tool_connected)

        if hasattr(policy_tool, 'definitions'):
            final_tools.extend(policy_tool.definitions)
        else:
            final_tools.append(policy_tool)

        if hasattr(proxy_tool, 'definitions'):
            final_tools.extend(proxy_tool.definitions)
        else:
            final_tools.append(proxy_tool)
            
    except Exception as e:
        print(f"⚠️ Warning preparing tools: {e}")

    orchestrator_agent = get_or_create(
        "orchestrator_id",
        "OrchestratorAgent",
        "gpt-4o",
        (
            "Eres el agente orquestador del Service Desk de RRHH. "
            "Tu responsabilidad es: "
            "1) Usar el IntentAgent para identificar la intención del usuario. "
            "2) Si la intención es transaccional: usar AdministrativeAgent. "
            "3) Si la intención es de políticas: usar PolicyAgent. "
            "4) Si es sensible o complejo: usar ProxyAgent. "
            "Siempre explica los pasos realizados hacia el usuario."
        ),
        tools=final_tools
    )

    # -------------------------
    # Conversational Agent (Front Desk)
    # -------------------------
    conversational_agent = get_or_create(
        "conversational_id",
        "ConversationalAgent",
        "gpt-4o",
        (
            "Eres 'Clara', la asistente virtual de Recursos Humanos de la empresa. "
            "Tu personalidad es profesional, empática, paciente y eficiente. "
            "Tu objetivo es ayudar a los empleados con sus consultas de RRHH de manera natural, como si fueras una persona real. "
            "\n\n"
            "REGLAS DE COMPORTAMIENTO:\n"
            "1. Mantén siempre tu rol. Si te preguntan sobre temas ajenos a RRHH (deportes, cocina, código, etc.), responde amablemente que solo puedes asistir con temas laborales y de la empresa.\n"
            "2. Sé conversacional. Saluda, despídete y usa un tono cercano pero respetuoso.\n"
            "3. NO inventes información. Si no sabes algo, ofrece crear un caso para que un humano lo revise.\n"
            "4. DETECCIÓN DE CASOS: Tu trabajo principal es identificar cuando un usuario necesita una gestión formal.\n"
            "   - Si el usuario solo saluda o charla, responde normalmente.\n"
            "   - Si el usuario pide algo que requiere acción (certificado, vacaciones, nómina, duda de política), DEBES incluir un bloque JSON oculto al final de tu respuesta.\n"
            "\n"
            "FORMATO DE RESPUESTA PARA CASOS:\n"
            "Responde al usuario con texto normal, y AL FINAL, añade este bloque JSON (y nada más después del bloque):\n"
            "```json\n"
            "{\n"
            "  \"requires_case\": true,\n"
            "  \"case_type\": \"<tipo_de_caso>\",\n"
            "  \"summary\": \"<resumen_breve>\"\n"
            "}\n"
            "```\n"
            "Tipos de caso válidos: 'generate_certificate', 'check_vacation_balance', 'request_vacation', 'get_payroll_details', 'general_inquiry' (para dudas de políticas).\n"
        )
    )

    # Save updated IDs
    if orchestrator_agent and conversational_agent:
        print(f"\n✅ Agents Status:")
        print(f"   Orchestrator ID: {orchestrator_agent.id}")
        print(f"   Conversational ID: {conversational_agent.id}")
        
        new_ids = {
            "orchestrator_id": orchestrator_agent.id,
            "intent_id": intent_agent.id,
            "admin_id": admin_agent.id,
            "policy_id": policy_agent.id,
            "proxy_id": proxy_agent.id,
            "conversational_id": conversational_agent.id
        }
        
        with open("agent_ids.json", "w") as f:
            json.dump(new_ids, f, indent=2)
            print("   Saved/Updated agent IDs to agent_ids.json")

if __name__ == "__main__":
    main()
