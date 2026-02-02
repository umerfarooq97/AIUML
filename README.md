# 🧠 AI UML Generator - SaaS MVP

Convert natural language prompts into professional UML diagrams using AI.

## 🎯 Features

- **AI-Powered Generation**: Uses OpenRouter free AI API to convert prompts to UML
- **Multiple Diagram Types**: Class, Sequence, Use Case, Activity diagrams
- **User Authentication**: JWT-based secure authentication
- **Save & Export**: Save diagrams to database, export as PNG/SVG
- **Responsive UI**: Beautiful, modern interface with dark mode
- **Free Hosting**: Optimized for Render.com deployment

## 🏗 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database
- **OpenRouter API** - Free AI model (nvidia/nemotron-nano-12b-v2-vl:free)
- **JWT** - Secure authentication

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Mermaid.js** - Diagram rendering
- **Axios** - HTTP client

## 📁 Project Structure

```
umldiagram/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Authentication logic
│   │   ├── ai_engine.py         # OpenRouter AI integration
│   │   └── routes/
│   │       ├── auth.py          # Auth endpoints
│   │       └── diagrams.py      # Diagram endpoints
│   ├── requirements.txt
│   └── .env                     # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── context/             # React context
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
└── render.yaml                  # Render deployment config
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (or use Render's free database)
- OpenRouter API Key (already included in .env)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Environment variables are already configured in .env
# Database will be created automatically on first run

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🗄 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email
- `password_hash` - Hashed password
- `subscription_plan` - free/pro
- `created_at` - Timestamp

### Diagrams Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Diagram title
- `prompt` - Original user prompt
- `mermaid_code` - Generated Mermaid syntax
- `diagram_type` - class/sequence/usecase/activity
- `created_at` - Timestamp

## 🤖 AI Integration (OpenRouter)

This project uses **OpenRouter** with a **100% FREE** AI model:

- **Model**: nvidia/nemotron-nano-12b-v2-vl:free
- **API**: https://openrouter.ai/api/v1/chat/completions
- **Cost**: Completely free, no credit card required
- **No Installation**: Cloud-based, works anywhere

The AI engine uses carefully crafted prompts to ensure quality UML generation for different diagram types.

## 🎨 UI Pages

1. **Landing Page** - Hero, features, pricing, demo
2. **Login/Signup** - Authentication forms
3. **Dashboard** - User's saved diagrams
4. **Generator** - Main diagram creation interface with live preview

## 🔐 Authentication Flow

1. User registers with email/password
2. Password is hashed with bcrypt
3. JWT token issued on login
4. Token stored in localStorage
5. Protected routes require valid token

## 💰 Monetization

### Free Plan
- 5 diagrams per day
- All diagram types
- Save diagrams
- Watermarked exports

### Pro Plan ($5/month)
- Unlimited diagrams
- All diagram types
- No watermark
- Export to PNG/PDF/SVG
- Priority support

## 🚀 Deployment (Render.com)

### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub
2. Create new Blueprint on Render
3. Connect your repository
4. Render will automatically deploy both frontend and backend
5. Done! 🎉

### Option 2: Manual Deployment

#### Backend Deployment

1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see below)
6. Deploy!

#### Frontend Deployment

1. Create Static Site on Render
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`
4. Deploy!

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/umldb
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=nvidia/nemotron-nano-12b-v2-vl:free
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 📈 SEO Strategy

Target keywords:
- AI UML generator
- Generate UML diagram online
- UML diagram from text
- Free UML generator
- Class diagram generator
- Sequence diagram tool

## 🛠 Development Roadmap

### Phase 1 (MVP) ✅
- User authentication
- AI diagram generation with OpenRouter
- Save/load diagrams
- Export to SVG
- Beautiful modern UI

### Phase 2
- Pro subscription with Stripe
- Export to PNG/PDF
- Share diagram links
- Rate limiting for free users

### Phase 3
- VS Code extension
- GitHub integration
- Team collaboration
- Diagram templates

## 💡 Why This Stack?

✅ **100% Free to Deploy**: Render.com free tier + OpenRouter free API
✅ **No Local Setup**: AI runs in the cloud, not on your machine
✅ **Production Ready**: FastAPI + React is industry standard
✅ **Portfolio Worthy**: Modern, professional tech stack
✅ **Scalable**: Easy to add features and monetization

## 🤝 Contributing

This is a portfolio/FYP project. Feel free to fork and customize!

## 📄 License

MIT License - Free to use for personal and commercial projects

## 🙏 Acknowledgments

- OpenRouter for free AI API access
- Mermaid.js for diagram rendering
- Render.com for free hosting

---

Built with ❤️ for software engineers, students, and developers

**Perfect for**: Final Year Projects, Portfolio, Freelancing, SaaS Learning
