# 🤖 GitHub Copilot Instructions

## Project Context

You are working on **AI UML Generator**, a SaaS web application that generates UML diagrams from natural language using AI.

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with bcrypt password hashing
- **AI**: OpenRouter API (nvidia/nemotron-nano-12b-v2-vl:free model)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State**: React Context API for auth
- **HTTP**: Axios with interceptors
- **Diagrams**: Mermaid.js for rendering

---

## Code Style Guidelines

### Python (Backend)

```python
# Use type hints
def generate_diagram(prompt: str, diagram_type: Optional[str] = None) -> Dict[str, str]:
    pass

# Use docstrings
"""
Generate UML diagram from prompt
    
Args:
    prompt: User's description
    diagram_type: Optional diagram type
    
Returns:
    Dict with mermaid_code and diagram_type
"""

# Use Pydantic for validation
class DiagramCreate(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=2000)
    diagram_type: Optional[DiagramType] = None
```

### JavaScript/React (Frontend)

```javascript
// Use functional components with hooks
const ComponentName = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>...</div>;
};

// Use Tailwind CSS classes
<button className="btn-primary">Click Me</button>

// Use async/await for API calls
const handleSubmit = async () => {
  try {
    const result = await diagramAPI.generate(prompt);
  } catch (error) {
    setError(error.message);
  }
};
```

---

## Project Structure

```
backend/app/
├── main.py          # FastAPI app, CORS, routes
├── database.py      # SQLAlchemy setup, session management
├── models.py        # User, Diagram models
├── schemas.py       # Pydantic request/response schemas
├── auth.py          # JWT, password hashing, auth dependencies
├── ai_engine.py     # OpenRouter API integration
└── routes/
    ├── auth.py      # /auth/register, /auth/login, /auth/me
    └── diagrams.py  # /diagrams/generate, /diagrams/save, /diagrams/

frontend/src/
├── pages/           # Full page components
├── components/      # Reusable UI components
├── context/         # React context providers
├── services/        # API client functions
└── App.jsx          # Main app with routing
```

---

## Common Tasks

### Adding a New Backend Endpoint

```python
# In backend/app/routes/diagrams.py

@router.post("/new-endpoint", response_model=ResponseSchema)
def new_endpoint(
    data: RequestSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Implementation
    return result
```

### Adding a New Frontend Page

```javascript
// In frontend/src/pages/NewPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NewPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      {/* Content */}
    </div>
  );
};

export default NewPage;
```

### Making API Calls

```javascript
// In frontend/src/services/api.js

export const newAPI = {
  method: async (param) => {
    const response = await api.post('/endpoint', { param });
    return response.data;
  },
};
```

---

## Design System

### Colors

```javascript
// Primary: Blue
primary-50 to primary-900

// Dark: Slate
dark-50 to dark-900

// Use in Tailwind:
className="bg-primary-600 text-white"
className="bg-dark-800 text-dark-50"
```

### Components

```javascript
// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-outline">Outline Button</button>

// Inputs
<input className="input-field" />

// Cards
<div className="card">Content</div>
<div className="card-hover">Hoverable Card</div>
```

---

## Database Models

### User Model
```python
id: int
email: str (unique)
password_hash: str
subscription_plan: SubscriptionPlan (enum: free/pro)
created_at: datetime
```

### Diagram Model
```python
id: int
user_id: int (foreign key)
title: str
prompt: str
mermaid_code: str
diagram_type: DiagramType (enum: class/sequence/usecase/activity)
created_at: datetime
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Diagrams
- `POST /diagrams/generate` - Generate diagram with AI
- `POST /diagrams/save` - Save diagram to database
- `GET /diagrams/` - List user's diagrams (paginated)
- `GET /diagrams/{id}` - Get specific diagram
- `DELETE /diagrams/{id}` - Delete diagram

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/umldb
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=nvidia/nemotron-nano-12b-v2-vl:free
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## Common Patterns

### Protected Route
```javascript
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

### Error Handling
```javascript
try {
  const result = await api.call();
  setSuccess('Success message');
} catch (error) {
  setError(error.response?.data?.detail || 'Error message');
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await api.call();
  } finally {
    setLoading(false);
  }
};

return (
  <button disabled={loading}>
    {loading ? 'Loading...' : 'Action'}
  </button>
);
```

---

## AI Integration

### Generating Diagrams

```python
# In backend/app/ai_engine.py

from .ai_engine import generate_diagram

result = generate_diagram(
    prompt="Create a class diagram for...",
    diagram_type="class"  # optional
)

# Returns:
{
    "mermaid_code": "classDiagram\n...",
    "diagram_type": "class",
    "success": True
}
```

### Rendering with Mermaid

```javascript
// In frontend

import mermaid from 'mermaid';

useEffect(() => {
  if (mermaidCode) {
    const element = document.getElementById('diagram');
    element.innerHTML = mermaidCode;
    mermaid.run({ nodes: [element] });
  }
}, [mermaidCode]);
```

---

## Testing

### Backend
```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Frontend
```bash
# Install testing library
npm install --save-dev @testing-library/react

# Run tests
npm test
```

---

## Deployment

### Render.com (Free)

1. Push to GitHub
2. Connect to Render
3. Use `render.yaml` for auto-deployment
4. Set environment variables
5. Deploy!

See `DEPLOYMENT.md` for detailed steps.

---

## Best Practices

1. **Always use type hints** in Python
2. **Always handle errors** in API calls
3. **Always show loading states** for async operations
4. **Always validate user input** with Pydantic
5. **Always use environment variables** for secrets
6. **Always use Tailwind classes** (no inline styles)
7. **Always add docstrings** to functions
8. **Always use async/await** for API calls

---

## Quick Commands

### Backend
```bash
# Start server
uvicorn app.main:app --reload

# Create migration
alembic revision --autogenerate -m "message"

# Run migration
alembic upgrade head
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## When Adding Features

1. **Backend First**: Add endpoint in `routes/`
2. **Test**: Use `/docs` to test endpoint
3. **Frontend API**: Add method in `services/api.js`
4. **Frontend UI**: Create/update component
5. **Test**: Test in browser
6. **Commit**: Commit with clear message

---

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Mermaid Docs: https://mermaid.js.org
- OpenRouter Docs: https://openrouter.ai/docs

---

**Remember**: This is a production-ready SaaS application. Write code like you're building for real users!

Happy coding! 🚀
