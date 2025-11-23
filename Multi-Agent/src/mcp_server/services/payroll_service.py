"""
Payroll MCP tools service.
"""

from typing import Any, Dict
from azure.cosmos import CosmosClient
from config.settings import config
from core.factory import Domain, MCPToolBase
from utils.formatters import format_error_response, format_success_response


class PayrollService(MCPToolBase):
    """Specialist for payroll and salary inquiries."""

    def __init__(self):
        super().__init__(Domain.PAYROLL)
        self.container = None
        if config.cosmos_endpoint and config.cosmos_key:
            try:
                client = CosmosClient(config.cosmos_endpoint, credential=config.cosmos_key)
                database = client.get_database_client(config.cosmos_database_name)
                self.container = database.get_container_client("employees")
            except Exception as e:
                print(f"⚠️ Failed to initialize Cosmos DB Client: {e}")

    def register_tools(self, mcp) -> None:
        """Register Payroll tools with the MCP server."""

        @mcp.tool(tags={self.domain.value})
        async def get_payroll_details(
            employee_id: str, period: str = "Current"
        ) -> str:
            """Retrieve payroll summary for an employee securely."""
            if not self.container:
                return format_error_response("Database connection unavailable", "getting payroll details")

            try:
                # Query Cosmos DB for employee
                # Note: In a real app, we'd query by a secure user ID from the context, 
                # but here we simulate looking up by the provided ID.
                query = "SELECT * FROM c WHERE c.id = @id"
                params = [{"name": "@id", "value": employee_id}]
                
                items = list(self.container.query_items(
                    query=query,
                    parameters=params,
                    enable_cross_partition_query=True
                ))
                
                if not items:
                    return format_error_response(f"Employee {employee_id} not found", "getting payroll details")
                
                employee = items[0]
                payroll_info = employee.get("payroll_info", {})
                
                details = {
                    "employee_id": employee_id,
                    "name": employee.get("name"),
                    "period": period,
                    "salary": payroll_info.get("salary", "N/A"),
                    "last_payment_date": payroll_info.get("last_payment_date", "N/A"),
                    "status": "Processed"
                }
                summary = f"Retrieved payroll details for {employee.get('name')} ({employee_id}). Salary: {details['salary']}."

                return format_success_response(
                    action="Get Payroll Details", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="getting payroll details"
                )

        @mcp.tool(tags={self.domain.value})
        async def explain_deduction(deduction_code: str) -> str:
            """Explain a specific deduction code on the payslip."""
            try:
                # Mock knowledge base
                explanations = {
                    "D001": "Health Insurance Premium",
                    "D002": "401k Contribution",
                    "D003": "State Tax"
                }
                explanation = explanations.get(deduction_code, "Unknown deduction code")
                
                details = {
                    "code": deduction_code,
                    "explanation": explanation
                }
                summary = f"Explanation for deduction {deduction_code}: {explanation}"

                return format_success_response(
                    action="Explain Deduction", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="explaining deduction"
                )

    @property
    def tool_count(self) -> int:
        """Return the number of tools provided by this service."""
        return 2
