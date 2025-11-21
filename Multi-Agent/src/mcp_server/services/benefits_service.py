"""
Benefits MCP tools service.
"""

from typing import Any, Dict

from core.factory import Domain, MCPToolBase
from utils.formatters import format_error_response, format_success_response


class BenefitsService(MCPToolBase):
    """Specialist for employee benefits management."""

    def __init__(self):
        super().__init__(Domain.BENEFITS)

    def register_tools(self, mcp) -> None:
        """Register Benefits tools with the MCP server."""

        @mcp.tool(tags={self.domain.value})
        async def get_benefits_summary(employee_id: str) -> str:
            """List active benefits for an employee."""
            try:
                details = {
                    "employee_id": employee_id,
                    "active_benefits": [
                        "Health Insurance (Premium)",
                        "Dental Plan",
                        "401k Matching (5%)",
                        "Gym Membership Subsidy"
                    ],
                    "enrollment_status": "Active",
                    "next_open_enrollment": "Nov 2024"
                }
                summary = f"Retrieved active benefits summary for {employee_id}."

                return format_success_response(
                    action="Get Benefits Summary", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="getting benefits summary"
                )

        @mcp.tool(tags={self.domain.value})
        async def register_for_benefits(
            employee_name: str, benefits_package: str = "Standard"
        ) -> str:
            """Register a new employee for benefits."""
            try:
                details = {
                    "employee_name": employee_name,
                    "benefits_package": benefits_package,
                    "status": "Registered",
                }
                summary = f"Successfully registered {employee_name} for {benefits_package} benefits package."

                return format_success_response(
                    action="Benefits Registration", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="registering for benefits"
                )

    @property
    def tool_count(self) -> int:
        """Return the number of tools provided by this service."""
        return 2
