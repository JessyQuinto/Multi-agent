import logging
import os
from typing import Optional, Dict, Any
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

logger = logging.getLogger(__name__)

class ConversationalAgent:
    """
    User-facing conversational AI agent.
    Responsibilities:
    1. Engage in natural conversation with users
    2. Determine if input is a simple question or requires case creation
    3. Answer simple questions directly
    4. Route complex requests to DispatcherService for case processing
    """

    def __init__(self):
        self.project_client: Optional[AIProjectClient] = None
        self.conversational_agent_id: Optional[str] = None
        self.thread_cache: Dict[str, str] = {}  # user_id -> thread_id
        self._initialize_client()

    def _initialize_client(self):
        try:
            # Load agent IDs from file
            import json
            agent_ids_path = os.path.join(os.path.dirname(__file__), "..", "agent_ids.json")
            
            print(f"DEBUG: Attempting to load agent IDs from {agent_ids_path}")
            if os.path.exists(agent_ids_path):
                with open(agent_ids_path, "r") as f:
                    agent_ids = json.load(f)
                    self.conversational_agent_id = agent_ids.get("conversational_id")
                    print(f"DEBUG: Loaded conversational_agent_id: {self.conversational_agent_id}")
            else:
                print("DEBUG: agent_ids.json not found!")
            
            endpoint = os.getenv("AZURE_AI_AGENT_ENDPOINT")
            subscription_id = os.getenv("AZURE_AI_SUBSCRIPTION_ID")
            resource_group = os.getenv("AZURE_AI_RESOURCE_GROUP")
            project_name = os.getenv("AZURE_AI_PROJECT_NAME")
            
            if endpoint and subscription_id and resource_group and project_name:
                # Construct full agents endpoint
                agents_endpoint = f"{endpoint}/agents/v1.0/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{project_name}"
                
                self.project_client = AIProjectClient(
                    endpoint=agents_endpoint,
                    credential=DefaultAzureCredential(),
                )
                logger.info(f"ConversationalAgent initialized with agent ID: {self.conversational_agent_id}")
            else:
                logger.warning("Azure AI configuration incomplete. Running in mock mode.")
                print("DEBUG: Missing Azure env vars")
                
        except Exception as e:
            logger.error(f"Failed to initialize ConversationalAgent: {e}")
            print(f"DEBUG: Init exception: {e}")

    async def chat(self, user_id: str, message: str) -> Dict[str, Any]:
        """
        Main entry point for user conversation.
        Returns a dict with:
        - response: The agent's text response
        - requires_case: Boolean indicating if DispatcherService should be called
        - case_type: Optional type of case if requires_case is True
        """
        
        if not self.project_client or not self.conversational_agent_id:
            # Mock mode - simple heuristic
            return {
                "response": f"DEBUG MODE: Client or Agent ID missing. Client: {self.project_client}, ID: {self.conversational_agent_id}",
                "requires_case": False,
                "case_type": None
            }
        
        try:
            # Get or create thread for this user
            thread_id = await self._get_or_create_thread(user_id)
            
            # Add user message to thread
            self.project_client.agents.messages.create(
                thread_id=thread_id,
                role="user",
                content=message,
            )
            
            # Run the conversational agent
            run = self.project_client.agents.runs.create_and_process(
                thread_id=thread_id,
                agent_id=self.conversational_agent_id
            )
            
            # Extract response
            if run.status == "completed":
                messages = self.project_client.agents.messages.list(thread_id=thread_id)
                
                # Get the last assistant message
                for msg in messages:
                    if msg.role == "assistant":
                        full_response = ""
                        for content_item in msg.content:
                            if hasattr(content_item, 'text'):
                                full_response += content_item.text.value
                        
                        # Parse JSON block for case detection
                        import re
                        json_match = re.search(r"```json\s*({.*?})\s*```", full_response, re.DOTALL)
                        
                        requires_case = False
                        case_type = None
                        clean_response = full_response
                        
                        if json_match:
                            try:
                                json_str = json_match.group(1)
                                case_data = json.loads(json_str)
                                requires_case = case_data.get("requires_case", False)
                                case_type = case_data.get("case_type")
                                # Remove the JSON block from the response shown to user
                                clean_response = full_response.replace(json_match.group(0), "").strip()
                            except Exception as e:
                                logger.error(f"Failed to parse JSON from agent response: {e}")
                        
                        return {
                            "response": clean_response,
                            "requires_case": requires_case,
                            "case_type": case_type
                        }
            
            return {
                "response": f"DEBUG ERROR: Run status is {run.status}. Details: {run.last_error if hasattr(run, 'last_error') else 'None'}",
                "requires_case": False,
                "case_type": None
            }
            
        except Exception as e:
            logger.error(f"Error in conversational agent (falling back to mock): {e}")
            # Return the actual error for debugging
            return {
                "response": f"DEBUG EXCEPTION: {str(e)}",
                "requires_case": False,
                "case_type": None
            }

    async def _get_or_create_thread(self, user_id: str) -> str:
        """Get existing thread or create new one for user."""
        if user_id in self.thread_cache:
            return self.thread_cache[user_id]
        
        try:
            thread = self.project_client.agents.threads.create()
            self.thread_cache[user_id] = thread.id
            return thread.id
        except Exception as e:
            logger.error(f"Error creating thread: {e}")
            # Return a mock thread ID
            import uuid
            thread_id = str(uuid.uuid4())
            self.thread_cache[user_id] = thread_id
            return thread_id

    def _mock_chat(self, message: str) -> Dict[str, Any]:
        """Mock conversation when Azure is not available."""
        message_lower = message.lower()
        
        # Check if it's a case-worthy request
        case_keywords = ["certificado", "constancia", "vacaciones", "nomina", "pago", "solicitud", "necesito"]
        requires_case = any(keyword in message_lower for keyword in case_keywords)
        
        if requires_case:
            return {
                "response": "Entiendo que necesitas ayuda con esto. Voy a crear un caso para procesarlo correctamente.",
                "requires_case": True,
                "case_type": "general_inquiry"
            }
        else:
            # Simple greeting or question
            if any(word in message_lower for word in ["hola", "buenos", "buenas", "hey"]):
                response = "¡Hola! Soy Clara, tu asistente de Recursos Humanos. ¿En qué puedo ayudarte hoy?"
            elif "?" in message:
                response = "Esa es una buena pregunta. ¿Podrías darme más detalles para ayudarte mejor?"
            else:
                response = "Estoy aquí para ayudarte con tus consultas de Recursos Humanos. ¿Hay algo específico en lo que pueda asistirte?"
            
            return {
                "response": response,
                "requires_case": False,
                "case_type": None
            }
