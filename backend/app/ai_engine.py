import os
import requests
from typing import Dict, Optional
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIEngine:
    """
    AI Engine optimized for ApiFreeLLM.com
    Documentation:
    POST https://apifreellm.com/api/v1/chat
    Body: { "message": "string" }
    Response: { "success": true, "response": "string", ... }
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        # Default to correct endpoint if env is messed up, but pref from env
        self.api_url = os.getenv("OPENROUTER_API_URL", "https://apifreellm.com/api/v1/chat")
        
    def generate_uml(self, user_prompt: str, diagram_type: Optional[str] = None) -> Dict[str, str]:
        """
        Generate UML diagram using ApiFreeLLM with Retry Logic
        """
        import time
        
        if not self.api_key:
            return self._fallback_response(user_prompt, diagram_type, "Missing API Key")

        # Build prompt
        system_instruction = self._build_system_prompt(diagram_type)
        full_prompt = f"{system_instruction}\n\nUSER REQUEST:\n{user_prompt}"
        
        payload = { "message": full_prompt }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        max_retries = 2
        last_error = ""

        for attempt in range(max_retries):
            try:
                print(f"[AI] Request attempt {attempt+1} to {self.api_url}")
                
                response = requests.post(
                    self.api_url,
                    json=payload,
                    headers=headers,
                    timeout=120
                )
                
                if response.status_code == 429:
                    print(f"[AI] Rate limited (429). Waiting 6 seconds...")
                    time.sleep(6)
                    last_error = "Rate limit (429)"
                    continue
                
                if response.status_code != 200:
                    last_error = f"Status {response.status_code}"
                    print(f"[AI] Error: {response.text}")
                    continue
                
                # Success path
                result = response.json()
                if not result.get("success", True):
                    last_error = f"API success=false: {result}"
                    continue
                    
                content = result.get("response", "")
                if not content:
                     last_error = "Empty response"
                     continue

                mermaid_code = self._clean_mermaid_code(content)
                detected_type = self._detect_diagram_type(mermaid_code)
                print(f"[AI] Success!")
                
                return {
                    "mermaid_code": mermaid_code,
                    "diagram_type": diagram_type or detected_type,
                    "success": True
                }

            except requests.exceptions.Timeout:
                last_error = "Timeout"
            except Exception as e:
                last_error = str(e)
                print(f"[AI] Exception: {e}")
        
        # If loop finishes without return
        return self._fallback_response(user_prompt, diagram_type, last_error)

    def _fallback_response(self, user_prompt, diagram_type, error_msg):
        """Helper to return static fallback"""
        print(f"[AI] Triggering static fallback due to: {error_msg}")
        fallback_code = self._generate_static_fallback(user_prompt, diagram_type)
        return {
            "mermaid_code": fallback_code,
            "diagram_type": diagram_type or "class",
            "success": True,
            "note": f"Offline mode: {error_msg}"
        }

    def _generate_static_fallback(self, prompt: str, diagram_type: Optional[str] = None) -> str:
        """Generate a basic valid diagram based on keywords when AI fails"""
        diagram_type = diagram_type or "class"
        
        if diagram_type == "sequence":
            return """sequenceDiagram
    participant User
    participant System
    participant Database

    User->>System: Request Action
    System->>Database: Query Data
    Database-->>System: Return Data
    System-->>User: Show Results
    Note right of System: Offline generated (AI unavailable)"""
            
        elif diagram_type == "usecase":
            return """usecaseDiagram
    actor User
    actor Admin
    
    package System {
        usecase "Login" as UC1
        usecase "Perform Action" as UC2
        usecase "View Reports" as UC3
    }

    User --> UC1
    User --> UC2
    Admin --> UC1
    Admin --> UC3"""
            
        else: # Class default
            return """classDiagram
    class User {
        +Integer id
        +String username
        +login()
    }
    
    class System {
        +processRequest()
    }
    
    User --> System : interacts
    note "AI Service Unavailable\nShowing template diagram" """

    def _build_system_prompt(self, diagram_type: Optional[str] = None) -> str:
        """Build the system prompt for AI model"""
        base_prompt = """You are a UML diagram code generator. Output ONLY valid Mermaid syntax.

IMPORTANT INSTRUCTIONS:
1. DO NOT explain your thinking
2. DO NOT write any text before the code
3. DO NOT write any text after the code
4. DO NOT use markdown code blocks
5. Start IMMEDIATELY with the diagram keyword (classDiagram, sequenceDiagram, etc.)

Your ENTIRE response must be ONLY the Mermaid code.

CORRECT example:
classDiagram
    class User {
        +String name
    }
"""
        if diagram_type == "class":
            return base_prompt + "\nGenerate a Class Diagram."
        elif diagram_type == "sequence":
            return base_prompt + "\nGenerate a Sequence Diagram."
        elif diagram_type == "usecase":
            return base_prompt + "\nGenerate a Use Case Diagram."
        elif diagram_type == "activity":
            return base_prompt + "\nGenerate an Activity Diagram."
        else:
            return base_prompt + "\nDetermine the diagram type from the user prompt."

    def _clean_mermaid_code(self, code: str) -> str:
        """Clean up the AI output to extract only the mermaid code"""
        # Remove mermaid markdown blocks
        code = re.sub(r'```mermaid\s*', '', code)
        code = re.sub(r'```', '', code)
        
        # Simple extraction of diagram lines
        lines = code.split('\n')
        vm_code_lines = []
        started = False
        
        diagram_keywords = ['classDiagram', 'sequenceDiagram', 'erDiagram', 'flowchart', 'graph', 'gantt', 'pie', 'stateDiagram', 'journey', 'usecaseDiagram']
        
        for line in lines:
            stripped = line.strip()
            if not started:
                for kw in diagram_keywords:
                    # Check if line starts with keyword
                    if stripped.startswith(kw) or (kw == 'graph' and 'graph' in stripped): 
                        started = True
                        vm_code_lines.append(line)
                        break
            else:
                vm_code_lines.append(line)
        
        if vm_code_lines:
            return '\n'.join(vm_code_lines)
            
        return code.strip()

    def _detect_diagram_type(self, code: str) -> str:
        """Detect diagram type from code"""
        if "classDiagram" in code:
            return "class"
        elif "sequenceDiagram" in code:
            return "sequence"
        elif "usecase" in code or "usecaseDiagram" in code:
            return "usecase"
        elif "flowchart" in code or "graph" in code:
            return "activity"
        return "class" # Default
