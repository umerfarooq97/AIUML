# 🚀 Deployment Guide - Render.com

Complete guide to deploy your AI UML Generator to Render.com for **FREE**.

## 📋 Prerequisites

- GitHub account
- Render.com account (free)
- Your code pushed to GitHub

## 🎯 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - AI UML Generator"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-uml-generator.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Backend (Web Service)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

```
Name: ai-uml-generator-api
Environment: Python 3
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

4. **Add Environment Variables**:

Click "Advanced" → "Add Environment Variable"

```
SECRET_KEY = [Click "Generate" to auto-generate]
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
OPENROUTER_API_KEY = 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
OPENROUTER_MODEL = nvidia/nemotron-nano-12b-v2-vl:free
OPENROUTER_API_URL = https://openrouter.ai/api/v1/chat/completions
```

5. Select **"Free"** plan
6. Click **"Create Web Service"**

⏳ Wait 5-10 minutes for deployment...

### Step 4: Create Database

1. Click **"New +"** → **"PostgreSQL"**
2. Configure:

```
Name: ai-uml-db
Database: umldb
User: umluser
Region: Oregon (same as backend)
```

3. Select **"Free"** plan
4. Click **"Create Database"**

### Step 5: Connect Database to Backend

1. Go to your database → **"Info"** tab
2. Copy **"Internal Database URL"**
3. Go to your backend service → **"Environment"** tab
4. Add new environment variable:

```
DATABASE_URL = [paste the Internal Database URL]
```

5. Add one more variable:

```
CORS_ORIGINS = https://ai-uml-generator.onrender.com
```

6. Click **"Save Changes"**

Backend will automatically redeploy.

### Step 6: Deploy Frontend (Static Site)

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:

```
Name: ai-uml-generator
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

4. **Add Environment Variable**:

```
VITE_API_URL = https://ai-uml-generator-api.onrender.com
```

(Replace with YOUR backend URL from Step 3)

5. Select **"Free"** plan
6. Click **"Create Static Site"**

⏳ Wait 5-10 minutes for deployment...

### Step 7: Update CORS

1. Go to backend service → **"Environment"**
2. Update `CORS_ORIGINS`:

```
CORS_ORIGINS = https://ai-uml-generator.onrender.com
```

(Replace with YOUR frontend URL)

3. Save and wait for redeploy

## ✅ Verify Deployment

1. Open your frontend URL (e.g., `https://ai-uml-generator.onrender.com`)
2. Click **"Sign Up"**
3. Create an account
4. Generate a test diagram
5. Success! 🎉

## 🔧 Troubleshooting

### Backend shows "Application failed to respond"

**Fix**: Check logs in Render dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is correct
- Check that build completed successfully

### Frontend shows "Network Error"

**Fix**: CORS issue
- Verify `CORS_ORIGINS` in backend matches frontend URL
- Verify `VITE_API_URL` in frontend matches backend URL
- Both should use `https://` not `http://`

### Database connection fails

**Fix**: 
- Use **Internal Database URL** (not External)
- Ensure backend and database are in same region
- Check database is running (green status)

### AI generation fails

**Fix**:
- Verify `OPENROUTER_API_KEY` is set correctly
- Check backend logs for API errors
- Try regenerating with different prompt

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Backend Web Service | Free | $0/month |
| PostgreSQL Database | Free | $0/month |
| Frontend Static Site | Free | $0/month |
| OpenRouter AI API | Free | $0/month |
| **TOTAL** | | **$0/month** |

### Free Tier Limits

- **Backend**: 750 hours/month (always on)
- **Database**: 1GB storage, 97 hours/month
- **Frontend**: 100GB bandwidth/month
- **AI API**: Unlimited (free model)

**Note**: Free services sleep after 15 min of inactivity. First request may be slow.

## 🚀 Upgrade to Paid (Optional)

For production use, consider:

- **Backend**: $7/month (always on, no sleep)
- **Database**: $7/month (always on)
- **Total**: $14/month

## 📊 Monitoring

1. **Logs**: Click service → "Logs" tab
2. **Metrics**: Click service → "Metrics" tab
3. **Health**: Check `/health` endpoint

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Render automatically deploys! 🎉
```

## 🌐 Custom Domain (Optional)

1. Buy domain (e.g., Namecheap, GoDaddy)
2. In Render: Service → "Settings" → "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate auto-generated

## 📈 Next Steps

1. **Monitor Usage**: Check Render dashboard regularly
2. **Add Features**: Push updates to GitHub
3. **Get Feedback**: Share with users
4. **Monetize**: Add Stripe for Pro plan
5. **Scale**: Upgrade to paid plans when needed

## 🎓 Pro Tips

1. **Use Environment Groups**: Manage env vars across services
2. **Enable Auto-Deploy**: Automatic deploys on git push
3. **Set up Alerts**: Get notified of deployment failures
4. **Use Preview Environments**: Test before production
5. **Monitor Logs**: Catch errors early

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Create issue in your repo

---

**Congratulations!** 🎉 Your AI UML Generator is now live and accessible worldwide!

Share your URL and start getting users! 🚀
