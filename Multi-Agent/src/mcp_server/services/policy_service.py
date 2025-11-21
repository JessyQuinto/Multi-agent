
from fastmcp import FastMCP
from core.factory import MCPToolBase, Domain

class PolicyService(MCPToolBase):
    """Service for handling internal HR policy inquiries."""

    def __init__(self):
        super().__init__(Domain.POLICIES)

    def register_tools(self, mcp: FastMCP) -> None:
        """Register policy tools with the MCP server."""

        @mcp.tool(tags=[self.domain.value])
        async def search_policies(query: str) -> str:
            """
            Search the employee handbook and internal policies for a given query.
            Use this tool when the user asks about rules, code of conduct, dress code, remote work policy, etc.
            """
            # In a real implementation, this would query Azure AI Search or a Vector DB.
            # For this prototype, we return simulated policy content.
            policies = {
                "remote work": "Employees are allowed to work remotely up to 3 days a week with manager approval.",
                "dress code": "Our dress code is business casual. Jeans are allowed on Fridays.",
                "code of conduct": "We expect all employees to treat each other with respect and dignity.",
                "expense": "Expenses must be submitted within 30 days of the transaction with a valid receipt.",
                "maternity": "Maternity leave is 16 weeks fully paid.",
                "paternity": "Paternity leave is 8 weeks fully paid."
            }
            
            query_lower = query.lower()
            results = []
            for key, value in policies.items():
                if key in query_lower:
                    results.append(f"**Policy on {key.title()}:** {value}")
            
            if not results:
                return "I couldn't find a specific policy matching your query. Please check the Employee Handbook portal or ask a more general question."
            
            return "\n\n".join(results)

    @property
    def tool_count(self) -> int:
        return 1
