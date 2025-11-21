
import random
from fastmcp import FastMCP
from core.factory import MCPToolBase, Domain

class TicketService(MCPToolBase):
    """Service for handling ticket generation and escalation."""

    def __init__(self):
        super().__init__(Domain.TICKETS)

    def register_tools(self, mcp: FastMCP) -> None:
        """Register ticket tools with the MCP server."""

        @mcp.tool(tags=[self.domain.value])
        async def create_ticket(category: str, description: str, priority: str = "Normal") -> str:
            """
            Create a support ticket or escalate an issue to a human HR representative.
            Use this tool when the user wants to file a complaint, report an issue, or when the request is too complex for automation.
            """
            ticket_id = f"HR-{random.randint(1000, 9999)}"
            return f"Ticket **{ticket_id}** has been created successfully.\n\n**Details:**\n- **Category:** {category}\n- **Priority:** {priority}\n- **Description:** {description}\n\nA human HR representative will review this case and contact you shortly."

        @mcp.tool(tags=[self.domain.value])
        async def check_ticket_status(ticket_id: str) -> str:
            """Check the status of an existing support ticket."""
            # Simulated status check
            statuses = ["Open", "In Progress", "Resolved", "Pending Employee Action"]
            status = random.choice(statuses)
            return f"Ticket **{ticket_id}** is currently: **{status}**."

    @property
    def tool_count(self) -> int:
        return 2
