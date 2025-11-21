import pytest
import asyncio
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/mcp_server')))
from mcp_server.services.hr_service import HRService

@pytest.mark.asyncio
async def test_generate_certificate():
    service = HRService()
    # We need to mock the mcp object and tool decorator since we are testing the class methods directly
    # However, the methods are decorated, so we might need to access them differently or mock the decorator.
    # Actually, the methods are defined inside register_tools, which makes them hard to test directly without instantiating the service and calling register_tools with a mock mcp.
    
    # Let's try a different approach. We can inspect the service to see if we can access the inner functions, 
    # or we can refactor the service to have methods on the class that are then decorated.
    # Given the current structure, we have to mock the mcp object passed to register_tools.
    
    class MockMCP:
        def __init__(self):
            self.tools = {}
        
        def tool(self, tags=None):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator

    mock_mcp = MockMCP()
    service.register_tools(mock_mcp)
    
    # Now we can call the registered tools
    result = await mock_mcp.tools['generate_certificate'](employee_id="123", type="Laboral")
    assert "Successfully generated Laboral certificate" in result
    assert "https://hr-portal.internal/certs/123/Laboral.pdf" in result

@pytest.mark.asyncio
async def test_check_vacation_balance():
    service = HRService()
    class MockMCP:
        def __init__(self):
            self.tools = {}
        def tool(self, tags=None):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator

    mock_mcp = MockMCP()
    service.register_tools(mock_mcp)
    
    result = await mock_mcp.tools['check_vacation_balance'](employee_id="123")
    assert "10" in result # Available days
    assert "vacation days available" in result

@pytest.mark.asyncio
async def test_request_vacation():
    service = HRService()
    class MockMCP:
        def __init__(self):
            self.tools = {}
        def tool(self, tags=None):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator

    mock_mcp = MockMCP()
    service.register_tools(mock_mcp)
    
    result = await mock_mcp.tools['request_vacation'](employee_id="123", start_date="2024-06-01", end_date="2024-06-05")
    assert "Vacation request submitted" in result
    assert "Submitted for Approval" in result

@pytest.mark.asyncio
async def test_get_payroll_details():
    service = HRService()
    class MockMCP:
        def __init__(self):
            self.tools = {}
        def tool(self, tags=None):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator

    mock_mcp = MockMCP()
    service.register_tools(mock_mcp)
    
    result = await mock_mcp.tools['get_payroll_details'](employee_id="123")
    assert "Retrieved payroll details" in result
    assert "$3,850.00" in result

@pytest.mark.asyncio
async def test_get_benefits_summary():
    service = HRService()
    class MockMCP:
        def __init__(self):
            self.tools = {}
        def tool(self, tags=None):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator

    mock_mcp = MockMCP()
    service.register_tools(mock_mcp)
    
    result = await mock_mcp.tools['get_benefits_summary'](employee_id="123")
    assert "Retrieved active benefits summary" in result
    assert "Health Insurance" in result
