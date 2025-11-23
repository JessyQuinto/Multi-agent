from fastmcp import FastMCP
from core.factory import MCPToolBase, Domain
from config.settings import config
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient

class PolicyService(MCPToolBase):
    """Service for handling internal HR policy inquiries."""

    def __init__(self):
        super().__init__(Domain.POLICIES)
        self.search_client = None
        if config.azure_search_endpoint and config.azure_search_key:
            try:
                self.search_client = SearchClient(
                    endpoint=config.azure_search_endpoint,
                    index_name="policies-index",
                    credential=AzureKeyCredential(config.azure_search_key)
                )
            except Exception as e:
                print(f"⚠️ Failed to initialize Azure Search Client: {e}")

    def register_tools(self, mcp: FastMCP) -> None:
        """Register policy tools with the MCP server."""

        @mcp.tool(tags=[self.domain.value])
        async def search_policies(query: str) -> str:
            """
            Search the employee handbook and internal policies for a given query.
            Use this tool when the user asks about rules, code of conduct, dress code, remote work policy, etc.
            """
            if not self.search_client:
                return "Policy search is currently unavailable (configuration missing)."

            try:
                # Perform vector/keyword search (hybrid is best, but simple search for now)
                results = self.search_client.search(search_text=query, top=3)
                
                formatted_results = []
                for result in results:
                    title = result.get("title", "Unknown Policy")
                    content = result.get("content", "")
                    formatted_results.append(f"**Source: {title}**\n{content}")
                
                if not formatted_results:
                    return "I couldn't find a specific policy matching your query in the handbook."
                
                return "\n\n---\n\n".join(formatted_results)
                
            except Exception as e:
                return f"Error searching policies: {str(e)}"

    @property
    def tool_count(self) -> int:
        return 1
