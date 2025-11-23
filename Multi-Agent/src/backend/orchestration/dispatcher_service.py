import logging
import uuid
import json
from typing import List, Dict, Any
from common.services.case_service import CaseService
from common.models.messages_kernel import TeamConfiguration

logger = logging.getLogger(__name__)

class DispatcherService:
    """
    The 'Front Desk' of the HR Service Desk.
    Responsible for:
    1. Analyzing user input to detect multiple intents.
    2. Creating separate 'Cases' (Tickets) for each intent.
    3. Routing cases to the Orchestrator.
    """

    def __init__(self, case_service: CaseService):
        self.case_service = case_service

    async def process_user_input(self, user_id: str, user_input: str) -> List[Dict[str, Any]]:
        """
        Process raw user input, split into cases, and return the created cases.
        """
        logger.info(f"Dispatcher received input from {user_id}: {user_input}")

        # 1. Analyze Intents (Mocked for now, will use IntentAgent later)
        # In a real scenario, we would call the IntentAgent here to get a structured JSON back.
        # For now, we'll do a simple heuristic or just assume 1 case if simple.
        
        intents = self._mock_intent_analysis(user_input)
        
        created_cases = []
        
        # 2. Create a Case for each intent
        for intent in intents:
            case_id = str(uuid.uuid4())
            case_data = {
                "case_id": case_id,
                "user_id": user_id,
                "intent": intent["intent_type"],
                "description": intent["description"],
                "status": "open",
                "thread_id": None # Will be set when connected to Azure AI Foundry
            }
            
            # Persist case
            await self.case_service.create_case(case_data)
            created_cases.append(case_data)
            logger.info(f"Created Case {case_id} for intent: {intent['intent_type']}")

        return created_cases

    def _mock_intent_analysis(self, text: str) -> List[Dict[str, Any]]:
        """
        Simple heuristic to simulate multi-intent detection until we have the AI Agent.
        """
        text_lower = text.lower()
        intents = []

        # Check for Certificate intent
        if "certificado" in text_lower or "constancia" in text_lower:
            intents.append({
                "intent_type": "generate_certificate",
                "description": "Solicitud de certificado laboral/constancia"
            })

        # Check for Vacation intent
        if "vacaciones" in text_lower or "saldo" in text_lower:
            intents.append({
                "intent_type": "check_vacation_balance",
                "description": "Consulta de saldo o solicitud de vacaciones"
            })
            
        # Check for Payroll intent
        if "nomina" in text_lower or "pago" in text_lower:
            intents.append({
                "intent_type": "get_payroll_details",
                "description": "Consulta de detalles de nómina"
            })

        # Default fallback if no specific keyword found
        if not intents:
            intents.append({
                "intent_type": "general_inquiry",
                "description": text
            })

        return intents
