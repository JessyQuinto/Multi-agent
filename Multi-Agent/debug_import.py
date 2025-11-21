import sys
import os
sys.path.append(os.path.abspath('src'))
sys.path.append(os.path.abspath('src/mcp_server'))
try:
    from mcp_server.services.hr_service import HRService
    print("Import successful")
except Exception as e:
    import traceback
    traceback.print_exc()
