"""
Tests for HR Runbooks (Service Desk Transformation).
"""

import pytest
from src.mcp_server.services.hr_service import HRService
from src.mcp_server.core.factory import Domain


class TestHRRunbooks:
    """Test cases for HR Service Desk runbooks."""

    @pytest.mark.asyncio
    async def test_generate_certificate(self, hr_service, mock_mcp_server):
        """Test labor certificate generation."""
        hr_service.register_tools(mock_mcp_server)
        
        tool = next(t["func"] for t in mock_mcp_server.tools if t["func"].__name__ == "generate_certificate")
        result = await tool("EMP123", "Laboral")
        
        assert "EMP123" in result
        assert "Laboral" in result
        assert "Generate Certificate" in result
        assert "https://hr-portal.internal/certs/EMP123/Laboral.pdf" in result

    @pytest.mark.asyncio
    async def test_check_vacation_balance(self, hr_service, mock_mcp_server):
        """Test vacation balance check."""
        hr_service.register_tools(mock_mcp_server)
        
        tool = next(t["func"] for t in mock_mcp_server.tools if t["func"].__name__ == "check_vacation_balance")
        result = await tool("EMP123")
        
        assert "EMP123" in result
        assert "10" in result  # Available days from mock
        assert "Check Vacation Balance" in result

    @pytest.mark.asyncio
    async def test_request_vacation(self, hr_service, mock_mcp_server):
        """Test vacation request."""
        hr_service.register_tools(mock_mcp_server)
        
        tool = next(t["func"] for t in mock_mcp_server.tools if t["func"].__name__ == "request_vacation")
        result = await tool("EMP123", "2024-12-01", "2024-12-15")
        
        assert "EMP123" in result
        assert "December 01, 2024" in result
        assert "December 15, 2024" in result
        assert "Submitted for Approval" in result

    @pytest.mark.asyncio
    async def test_get_payroll_details(self, hr_service, mock_mcp_server):
        """Test payroll details retrieval."""
        hr_service.register_tools(mock_mcp_server)
        
        tool = next(t["func"] for t in mock_mcp_server.tools if t["func"].__name__ == "get_payroll_details")
        result = await tool("EMP123")
        
        assert "EMP123" in result
        assert "$5,000.00" in result
        assert "Get Payroll Details" in result

    @pytest.mark.asyncio
    async def test_get_benefits_summary(self, hr_service, mock_mcp_server):
        """Test benefits summary retrieval."""
        hr_service.register_tools(mock_mcp_server)
        
        tool = next(t["func"] for t in mock_mcp_server.tools if t["func"].__name__ == "get_benefits_summary")
        result = await tool("EMP123")
        
        assert "EMP123" in result
        assert "Health Insurance (Premium)" in result
        assert "Get Benefits Summary" in result
