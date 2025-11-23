import logging
import os
import asyncio
from typing import Optional, Any, Dict
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from common.config.app_config import config

logger = logging.getLogger(__name__)

class AzureAIOrchestrator:
    """
    Orchestrator that uses Azure AI Foundry Agents.
    """

    def __init__(self):
        self.project_client: Optional[AIProjectClient] = None
        self.orchestrator_agent_id: Optional[str] = None
        self._initialize_client()

    def _initialize_client(self):
        try:
            endpoint = os.getenv("AZURE_AI_AGENT_ENDPOINT")
            if endpoint:
                self.project_client = AIProjectClient(
                    endpoint=endpoint,
                    credential=DefaultAzureCredential(),
                )
                # Load agent IDs from file or env
                # For now, we assume it's passed or loaded
                self.orchestrator_agent_id = os.getenv("ORCHESTRATOR_AGENT_ID")
                logger.info("Azure AI Project Client initialized.")
            else:
                logger.warning("AZURE_AI_AGENT_ENDPOINT not set. Orchestrator running in offline mode.")
        except Exception as e:
            logger.error(f"Failed to initialize Azure AI Project Client: {e}")

    async def create_thread(self) -> Optional[str]:
        """Create a new conversation thread."""
        if not self.project_client:
            return str(uuid.uuid4()) # Mock ID
        
        try:
            thread = self.project_client.agents.threads.create()
            return thread.id
        except Exception as e:
            logger.error(f"Error creating thread: {e}")
            return None

    async def send_message(self, thread_id: str, content: str) -> str:
        """
        Send a message to the thread and run the orchestrator.
        Returns the final response text.
        """
        if not self.project_client or not self.orchestrator_agent_id:
            return f"[MOCK RESPONSE] I received your message: '{content}'. (Azure connection pending)"

        try:
            # 1. Add user message
            self.project_client.agents.messages.create(
                thread_id=thread_id,
                role="user",
                content=content,
            )

            # 2. Run Orchestrator
            run = self.project_client.agents.runs.create_and_process(
                thread_id=thread_id,
                agent_id=self.orchestrator_agent_id
            )

            # 3. Poll for completion (simplified)
            # In a real app, we'd handle 'requires_action' for tool calls here.
            # This is a basic blocking implementation.
            
            if run.status == "completed":
                messages = self.project_client.agents.messages.list(thread_id=thread_id)
                # Get last assistant message
                for msg in messages:
                    if msg.role == "assistant":
                        # Extract text
                        text = ""
                        for content_item in msg.content:
                            if hasattr(content_item, 'text'):
                                text += content_item.text.value
                        return text
            
            return f"Run finished with status: {run.status}"

        except Exception as e:
            logger.error(f"Error in orchestration run: {e}")
            return f"Error processing request: {e}"
