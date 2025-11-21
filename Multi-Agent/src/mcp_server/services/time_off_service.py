"""
Time Off MCP tools service.
"""

from typing import Any, Dict

from core.factory import Domain, MCPToolBase
from utils.date_utils import format_date_for_user
from utils.formatters import format_error_response, format_success_response


class TimeOffService(MCPToolBase):
    """Specialist for vacation and time off management."""

    def __init__(self):
        super().__init__(Domain.TIME_OFF)

    def register_tools(self, mcp) -> None:
        """Register Time Off tools with the MCP server."""

        @mcp.tool(tags={self.domain.value})
        async def check_vacation_balance(employee_id: str) -> str:
            """Check available vacation days for an employee."""
            try:
                # Mock data
                details = {
                    "employee_id": employee_id,
                    "total_days": 15,
                    "used_days": 5,
                    "available_days": 10,
                    "accrual_rate": "1.25 days/month"
                }
                summary = f"Employee {employee_id} has {details['available_days']} vacation days available."

                return format_success_response(
                    action="Check Vacation Balance", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="checking vacation balance"
                )

        @mcp.tool(tags={self.domain.value})
        async def request_vacation(
            employee_id: str, start_date: str, end_date: str
        ) -> str:
            """Submit a vacation request for an employee."""
            try:
                formatted_start = format_date_for_user(start_date)
                formatted_end = format_date_for_user(end_date)
                
                details = {
                    "employee_id": employee_id,
                    "start_date": formatted_start,
                    "end_date": formatted_end,
                    "status": "Submitted for Approval",
                    "approver": "Direct Manager"
                }
                summary = f"Vacation request submitted for {employee_id} from {formatted_start} to {formatted_end}."

                return format_success_response(
                    action="Request Vacation", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="requesting vacation"
                )

    @property
    def tool_count(self) -> int:
        """Return the number of tools provided by this service."""
        return 2
