"""
Payroll MCP tools service.
"""

from typing import Any, Dict

from core.factory import Domain, MCPToolBase
from utils.formatters import format_error_response, format_success_response


class PayrollService(MCPToolBase):
    """Specialist for payroll and salary inquiries."""

    def __init__(self):
        super().__init__(Domain.PAYROLL)

    def register_tools(self, mcp) -> None:
        """Register Payroll tools with the MCP server."""

        @mcp.tool(tags={self.domain.value})
        async def get_payroll_details(
            employee_id: str, period: str = "Current"
        ) -> str:
            """Retrieve payroll summary for an employee securely."""
            try:
                # Mock secure data retrieval
                details = {
                    "employee_id": employee_id,
                    "period": period,
                    "gross_pay": "$5,000.00",
                    "net_pay": "$3,850.00",
                    "payment_date": "2024-05-30",
                    "status": "Processed"
                }
                summary = f"Retrieved payroll details for {employee_id} for period {period}."

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
