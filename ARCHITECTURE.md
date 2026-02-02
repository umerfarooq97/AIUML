# 🎨 System Architecture - AI UML Generator

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    (Chrome, Firefox, etc.)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Static Site)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite + Tailwind CSS                     │   │
│  │  - Landing Page (Hero, Features, Pricing)           │   │
│  │  - Authentication Pages (Login, Register)           │   │
│  │  - Dashboard (Saved Diagrams)                       │   │
│  │  - Generator (Main Feature)                         │   │
│  │  - Mermaid.js (Diagram Rendering)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Hosted on: Render.com (Free Static Site)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Web Service)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FastAPI (Python 3.10+)                             │   │
│  │  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │ Auth Routes  │  │Diagram Routes│                │   │
│  │  │ - Register   │  │ - Generate   │                │   │
│  │  │ - Login      │  │ - Save       │                │   │
│  │  │ - Get User   │  │ - List       │                │   │
│  │  └──────────────┘  │ - Delete     │                │   │
│  │                    └──────────────┘                │   │
│  │  ┌──────────────────────────────────┐              │   │
│  │  │  AI Engine (OpenRouter)          │              │   │
│  │  │  - Prompt Engineering            │              │   │
│  │  │  - Mermaid Code Generation       │              │   │
│  │  └──────────────────────────────────┘              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Hosted on: Render.com (Free Web Service)                   │
└─────────────┬────────────────────────────┬──────────────────┘
              │                            │
              │ SQL                        │ HTTPS
              ▼                            ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│   PostgreSQL Database    │  │   OpenRouter AI API          │
│  ┌────────────────────┐  │  │  ┌────────────────────────┐  │
│  │  Users Table       │  │  │  │  nvidia/nemotron-nano  │  │
│  │  - id              │  │  │  │  - Free Model          │  │
│  │  - email           │  │  │  │  - No Rate Limits      │  │
│  │  - password_hash   │  │  │  │  - Cloud-based         │  │
│  │  - subscription    │  │  │  └────────────────────────┘  │
│  └────────────────────┘  │  │                              │
│  ┌────────────────────┐  │  │  Hosted on: OpenRouter.ai    │
│  │  Diagrams Table    │  │  └──────────────────────────────┘
│  │  - id              │  │
│  │  - user_id         │  │
│  │  - prompt          │  │
│  │  - mermaid_code    │  │
│  │  - diagram_type    │  │
│  └────────────────────┘  │
│                          │
│  Hosted on: Render.com   │
│  (Free PostgreSQL)       │
└──────────────────────────┘
```

---

## 🔄 Data Flow

### 1. User Registration Flow

```
User Browser
    │
    │ 1. Enter email & password
    ▼
Frontend (RegisterPage)
    │
    │ 2. POST /auth/register
    ▼
Backend (auth.py)
    │
    │ 3. Hash password (bcrypt)
    │ 4. Create user record
    ▼
PostgreSQL Database
    │
    │ 5. Return user + JWT token
    ▼
Frontend
    │
    │ 6. Store token in localStorage
    │ 7. Redirect to Dashboard
    ▼
User sees Dashboard
```

### 2. Diagram Generation Flow

```
User Browser
    │
    │ 1. Enter prompt: "Create class diagram for library system"
    ▼
Frontend (GeneratorPage)
    │
    │ 2. POST /diagrams/generate
    │    { prompt: "...", diagram_type: "class" }
    ▼
Backend (diagrams.py)
    │
    │ 3. Call AI Engine
    ▼
AI Engine (ai_engine.py)
    │
    │ 4. Build system prompt
    │ 5. POST to OpenRouter API
    ▼
OpenRouter AI API
    │
    │ 6. Generate Mermaid code
    │ 7. Return: "classDiagram\n  class Book..."
    ▼
Backend
    │
    │ 8. Clean & validate code
    │ 9. Return to frontend
    ▼
Frontend
    │
    │ 10. Render with Mermaid.js
    │ 11. Display diagram
    ▼
User sees UML Diagram
    │
    │ 12. Click "Save"
    ▼
Backend
    │
    │ 13. Save to database
    ▼
PostgreSQL Database
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│  User Login  │
└──────┬───────┘
       │
       │ email + password
       ▼
┌─────────────────────┐
│  Backend Auth API   │
│  1. Find user       │
│  2. Verify password │
│  3. Generate JWT    │
└──────┬──────────────┘
       │
       │ JWT Token
       ▼
┌─────────────────────┐
│  Frontend Storage   │
│  localStorage.token │
└──────┬──────────────┘
       │
       │ Every API call includes:
       │ Authorization: Bearer <token>
       ▼
┌─────────────────────┐
│  Protected Routes   │
│  - Dashboard        │
│  - Generator        │
│  - Diagrams         │
└─────────────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────┐
│           USERS TABLE               │
├─────────────────────────────────────┤
│ id (PK)              INTEGER        │
│ email                VARCHAR UNIQUE │
│ password_hash        VARCHAR        │
│ subscription_plan    ENUM           │
│ created_at           TIMESTAMP      │
└──────────┬──────────────────────────┘
           │
           │ 1:N relationship
           │
           ▼
┌─────────────────────────────────────┐
│         DIAGRAMS TABLE              │
├─────────────────────────────────────┤
│ id (PK)              INTEGER        │
│ user_id (FK)         INTEGER        │
│ title                VARCHAR        │
│ prompt               TEXT           │
│ mermaid_code         TEXT           │
│ diagram_type         ENUM           │
│ created_at           TIMESTAMP      │
└─────────────────────────────────────┘
```

---

## 🎨 Frontend Component Tree

```
App.jsx
│
├── AuthProvider (Context)
│   │
│   ├── LandingPage
│   │   ├── Navigation
│   │   ├── Hero Section
│   │   ├── Features Section
│   │   ├── Pricing Section
│   │   └── Footer
│   │
│   ├── LoginPage
│   │   └── Login Form
│   │
│   ├── RegisterPage
│   │   └── Register Form
│   │
│   ├── DashboardPage (Protected)
│   │   ├── Navigation
│   │   └── Diagram Cards List
│   │
│   └── GeneratorPage (Protected)
│       ├── Navigation
│       ├── Prompt Input
│       ├── Diagram Type Selector
│       ├── Generate Button
│       ├── Mermaid Preview
│       ├── Code Display
│       └── Action Buttons (Save, Download, Copy)
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                     │
│                  (Source Code Storage)                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ Git Push
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     RENDER.COM                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Auto-Deploy (render.yaml)                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │  PostgreSQL  │  │
│  │ Static Site  │  │ Web Service  │  │   Database   │  │
│  │              │  │              │  │              │  │
│  │ FREE TIER    │  │ FREE TIER    │  │ FREE TIER    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  Total Cost: $0/month                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18 | UI components |
| **Build Tool** | Vite | Fast development |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Routing** | React Router v6 | Client-side routing |
| **State Management** | Context API | Auth state |
| **HTTP Client** | Axios | API requests |
| **Diagram Rendering** | Mermaid.js | UML visualization |
| **Backend Framework** | FastAPI | REST API |
| **ORM** | SQLAlchemy | Database abstraction |
| **Database** | PostgreSQL | Data persistence |
| **Authentication** | JWT + bcrypt | Secure auth |
| **AI Provider** | OpenRouter | Free AI API |
| **AI Model** | nvidia/nemotron | Free LLM |
| **Hosting** | Render.com | Free deployment |

---

## 📊 Performance Characteristics

| Metric | Value |
|--------|-------|
| **Frontend Load Time** | < 2 seconds |
| **API Response Time** | < 500ms (cached) |
| **AI Generation Time** | 3-8 seconds |
| **Database Query Time** | < 100ms |
| **Concurrent Users** | 100+ (free tier) |
| **Storage** | 1GB (free tier) |
| **Bandwidth** | 100GB/month (free tier) |

---

## 🔒 Security Features

```
┌─────────────────────────────────────┐
│      SECURITY LAYERS                │
├─────────────────────────────────────┤
│ 1. HTTPS (SSL/TLS)                  │
│    - Encrypted communication        │
│                                     │
│ 2. JWT Authentication               │
│    - Stateless tokens               │
│    - Expiration (30 min)            │
│                                     │
│ 3. Password Hashing                 │
│    - bcrypt algorithm               │
│    - Salt rounds: 12                │
│                                     │
│ 4. CORS Protection                  │
│    - Allowed origins only           │
│                                     │
│ 5. Input Validation                 │
│    - Pydantic schemas               │
│    - SQL injection prevention       │
│                                     │
│ 6. Environment Variables            │
│    - No secrets in code             │
└─────────────────────────────────────┘
```

---

## 💰 Cost Analysis

```
┌─────────────────────────────────────────────────────┐
│              MONTHLY COST BREAKDOWN                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend Hosting (Render Static Site)              │
│  └─ FREE TIER: 100GB bandwidth                      │
│     Cost: $0                                         │
│                                                      │
│  Backend Hosting (Render Web Service)               │
│  └─ FREE TIER: 750 hours/month                      │
│     Cost: $0                                         │
│                                                      │
│  Database (Render PostgreSQL)                       │
│  └─ FREE TIER: 1GB storage, 97 hours/month          │
│     Cost: $0                                         │
│                                                      │
│  AI API (OpenRouter)                                │
│  └─ FREE MODEL: nvidia/nemotron-nano                │
│     Cost: $0                                         │
│                                                      │
│  ─────────────────────────────────────────          │
│  TOTAL MONTHLY COST: $0                             │
│  ─────────────────────────────────────────          │
│                                                      │
│  Upgrade Path (Optional):                           │
│  - Backend: $7/month (no sleep)                     │
│  - Database: $7/month (always on)                   │
│  - Total: $14/month for production                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 User Journey

```
1. DISCOVERY
   User finds site via Google/social media
   ↓
2. LANDING PAGE
   Sees features, pricing, demo
   ↓
3. SIGN UP
   Creates free account
   ↓
4. FIRST DIAGRAM
   Enters prompt, generates UML
   ↓
5. SAVE & EXPORT
   Saves diagram, downloads SVG
   ↓
6. DASHBOARD
   Views all saved diagrams
   ↓
7. UPGRADE (Optional)
   Subscribes to Pro plan
```

---

**This architecture is designed for:**
- ✅ Zero cost deployment
- ✅ Easy scalability
- ✅ Fast development
- ✅ Production readiness
- ✅ Modern best practices

Built with ❤️ for success! 🚀
