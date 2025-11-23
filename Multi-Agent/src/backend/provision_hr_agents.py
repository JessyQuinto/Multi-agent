import os
import asyncio
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
# Based on the user's JSON output for "agentsEndpointUri"
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
    Note: The SDK currently supports create. For update, we might need to list and check.
    For simplicity, this script creates new agents. 
    In a real scenario, you'd check if it exists first.
    """
    print(f"\n🤖 Provisioning Agent: {name}...")
    try:
        # Check if agent exists (naive check by listing - optional optimization)
        # For now, we just create.
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
    # 2. Create Agents
    # ================================================================

    # -------------------------
    # Intent Agent
    # -------------------------
    intent_agent = create_or_update_agent(
        name="IntentAgent",
        model="gpt-4o", # Using gpt-4o as standard
        instructions=(
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
    admin_agent = create_or_update_agent(
        name="AdministrativeAgent",
        model="gpt-4o",
        instructions=(
            "Eres un agente administrativo encargado de ejecutar tareas transaccionales de RRHH. "
            "Puedes generar certificados, revisar vacaciones, solicitar vacaciones, consultar nómina y beneficios. "
            "Si faltan datos para ejecutar un runbook, pide aclaraciones."
        )
    )

    # Define tools for Admin Agent (these will be connected to MCP/Functions later)
    # For now, we define them as definitions for the Orchestrator to know about
    admin_tools_definitions = []
    
    # Note: In the user's example, they added ConnectedAgentTool for the admin agent itself
    # But typically the Admin Agent *has* tools (functions).
    # The Orchestrator uses the Admin Agent as a tool.
    
    admin_tool_connected = ConnectedAgentTool(
        id=admin_agent.id,
        name="AdministrativeAgent",
        description="Ejecuta tareas administrativas de RRHH (certificados, vacaciones, nómina)."
    )

    # -------------------------
    # Policy Agent (RAG)
    # -------------------------
    policy_agent = create_or_update_agent(
        name="PolicyAgent",
        model="gpt-4o",
        instructions=(
            "Eres experto en políticas de RRHH. "
            "Usa el sistema de RAG para responder preguntas usando documentos internos. "
            "Si no está en las políticas, indica que debe contactar RRHH."
        )
        # Note: We would attach Azure AI Search tool here if we had the vector store ID ready
    )

    policy_tool = ConnectedAgentTool(
        id=policy_agent.id,
        name=policy_agent.name,
        description="Responde consultas sobre políticas internas de RRHH usando RAG."
    )

    # -------------------------
    # Proxy Agent (Human Escalation)
    # -------------------------
    proxy_agent = create_or_update_agent(
        name="ProxyAgent",
        model="gpt-4o",
        instructions=(
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
    # The Orchestrator uses the other agents as tools
    
    orchestrator_tools = [
        intent_tool,
        admin_tool_connected,
        policy_tool,
        proxy_tool
    ]
    
    # We need to extract definitions correctly. 
    # In the user's code: tools=[*intent_tool.definitions, ...]
    # But ConnectedAgentTool might not have .definitions property directly in all SDK versions.
    # Let's check the SDK usage. The user code says: *intent_tool.definitions
    # Assuming ConnectedAgentTool has a definitions property that returns a list of ToolDefinition
    
    # However, to be safe and simple, let's try to pass the tool objects if the SDK supports it,
    # or inspect what definitions returns.
    # For this script, I will assume the user's snippet is correct for their SDK version.
    
    # Wait, ConnectedAgentTool is a wrapper. 
    # Let's try to construct the tools list for the orchestrator.
    
    final_tools = []
    try:
        if hasattr(intent_tool, 'definitions'):
            final_tools.extend(intent_tool.definitions)
        else:
            # Fallback or different SDK version
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

    orchestrator_agent = create_or_update_agent(
        name="OrchestratorAgent",
        model="gpt-4o",
        instructions=(
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

    if orchestrator_agent:
        print(f"\n✅ Orchestrator Agent Successfully Created!")
        print(f"   ID: {orchestrator_agent.id}")
        print(f"   Name: {orchestrator_agent.name}")
        
        # Save these IDs to a file or .env for the backend to use
        with open("agent_ids.json", "w") as f:
            import json
            ids = {
                "orchestrator_id": orchestrator_agent.id,
                "intent_id": intent_agent.id,
                "admin_id": admin_agent.id,
                "policy_id": policy_agent.id,
                "proxy_id": proxy_agent.id
            }
            json.dump(ids, f, indent=2)
            print("   Saved agent IDs to agent_ids.json")

if __name__ == "__main__":
    main()
