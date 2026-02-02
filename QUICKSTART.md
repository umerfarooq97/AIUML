# 🚀 Quick Start Guide - AI UML Generator

## ⚡ Fastest Way to Get Started (5 Minutes)

### Step 1: Install Dependencies

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Setup Database

**Option A: Use SQLite (Easiest for testing)**

Edit `backend\.env` and change:
```
DATABASE_URL=sqlite:///./uml.db
```

**Option B: Use PostgreSQL (Production-like)**

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE umldb;
```
3. Keep the DATABASE_URL in `.env` as is

### Step 3: Start Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend

```powershell
# In a new terminal
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### Step 5: Open Browser

Go to: **http://localhost:5173**

## 🎯 First Time Usage

1. Click **"Get Started"** or **"Sign Up"**
2. Create an account with any email (e.g., `test@example.com`)
3. Login with your credentials
4. Click **"Create Diagram"** or **"New Diagram"**
5. Try this example prompt:

```
Create a class diagram for a library management system with Book, Member, Librarian, and Transaction classes. Books can be borrowed by members. Librarians manage the system.
```

6. Click **"Generate Diagram"**
7. Watch the AI create your UML diagram! 🎉

## 🐛 Troubleshooting

### Backend won't start?

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
**Fix**: Make sure virtual environment is activated:
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Error**: `Database connection failed`
**Fix**: Use SQLite instead (see Step 2, Option A)

### Frontend won't start?

**Error**: `npm: command not found`
**Fix**: Install Node.js from https://nodejs.org

**Error**: `Cannot find module`
**Fix**: Delete `node_modules` and reinstall:
```powershell
cd frontend
rm -r node_modules
npm install
```

### AI generation fails?

**Error**: `Failed to generate diagram`
**Fix**: Check your OpenRouter API key in `backend\.env`

The free API key is already included, but if it's not working:
1. Go to https://openrouter.ai
2. Sign up for free
3. Get your API key
4. Replace `OPENROUTER_API_KEY` in `backend\.env`

## 📝 Example Prompts to Try

### Class Diagram
```
Create a class diagram for an e-commerce system with User, Product, Order, Cart, and Payment classes
```

### Sequence Diagram
```
Show the sequence diagram for user authentication with User, LoginForm, AuthService, and Database
```

### Activity Diagram
```
Create an activity diagram for the online food ordering process from browsing menu to delivery
```

### Use Case Diagram
```
Create a use case diagram for an ATM system with Customer, Bank, and Admin actors
```

## 🎨 Features to Explore

- ✅ **Save Diagrams**: Click "Save" to store your diagrams
- ✅ **Dashboard**: View all your saved diagrams
- ✅ **Download**: Export diagrams as SVG
- ✅ **Copy Code**: Copy Mermaid code for documentation
- ✅ **Dark Mode**: Toggle in browser settings

## 🚀 Next Steps

1. **Customize the UI**: Edit files in `frontend/src/pages/`
2. **Add Features**: Modify `backend/app/routes/`
3. **Deploy**: Follow deployment guide in README.md
4. **Monetize**: Add Stripe integration for Pro plan

## 💡 Pro Tips

1. **Use specific prompts**: More details = better diagrams
2. **Specify diagram type**: Select type for better results
3. **Iterate**: Generate, refine prompt, regenerate
4. **Save often**: Don't lose your work!

## 📚 Learn More

- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Mermaid Docs: https://mermaid.js.org
- Tailwind CSS: https://tailwindcss.com

---

**Need Help?** Check the main README.md or create an issue on GitHub!

Happy Diagramming! 🎉
