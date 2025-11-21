"""
Certificates MCP tools service.
"""

from typing import Any, Dict

from core.factory import Domain, MCPToolBase
from utils.date_utils import format_date_for_user
from utils.formatters import format_error_response, format_success_response


class CertificatesService(MCPToolBase):
    """Specialist for generating official HR certificates."""

    def __init__(self):
        super().__init__(Domain.CERTIFICATES)

    def register_tools(self, mcp) -> None:
        """Register Certificate tools with the MCP server."""

        @mcp.tool(tags={self.domain.value})
        async def generate_certificate(
            employee_id: str, type: str = "Laboral"
        ) -> str:
            """Generate a labor or income certificate for an employee."""
            try:
                # Mock data generation
                details = {
                    "employee_id": employee_id,
                    "certificate_type": type,
                    "generated_date": "2024-05-20",
                    "valid_until": "2024-06-20",
                    "status": "Generated",
                    "download_link": f"https://hr-portal.internal/certs/{employee_id}/{type}.pdf"
                }
                summary = f"Successfully generated {type} certificate for employee {employee_id}."

                return format_success_response(
                    action="Generate Certificate", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="generating certificate"
                )

        @mcp.tool(tags={self.domain.value})
        async def get_certificate_history(employee_id: str) -> str:
            """Retrieve history of generated certificates."""
            try:
                details = {
                    "employee_id": employee_id,
                    "history": [
                        {"type": "Laboral", "date": "2024-01-15"},
                        {"type": "Income", "date": "2023-11-20"}
                    ]
                }
                summary = f"Retrieved certificate history for {employee_id}."
                return format_success_response(
                    action="Get Certificate History", details=details, summary=summary
                )
            except Exception as e:
                return format_error_response(
                    error_message=str(e), context="getting certificate history"
                )

    @property
    def tool_count(self) -> int:
        """Return the number of tools provided by this service."""
        return 2
