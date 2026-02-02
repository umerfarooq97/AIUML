# Deploying to Railway

This guide outlines how to deploy the AI UML Generator (Frontend + Backend) to Railway.

## Prerequisites

1.  **GitHub Account**: Ensure your code is pushed to a GitHub repository (monorepo with `backend` and `frontend` folders).
2.  **Railway Account**: Sign up at [railway.app](https://railway.app/).
3.  **ApiFreeLLM Key**: Have your API key ready (`apf_...`).

## Step 1: Deploy Backend

1.  Click **New Project** -> **Deploy from GitHub repo**.
2.  Select your repository.
3.  Click **Add Variables** (or Configure) before deploying.
4.  **Important**: We need to configure this to run the `backend` folder.
    *   In the Service Settings, find **Root Directory**. Set it to `/backend`.
5.  **Environment Variables**:
    Add the following variables:
    *   `PORT`: `8000` (Optional, Railway sets one automatically, but good to be explicit)
    *   `SECRET_KEY`: Generate a random string (e.g., `openssl rand -hex 32`).
    *   `OPENROUTER_API_KEY`: `apf_zin300gyvbjym6fzif6nnimo` (Your Key)
    *   `OPENROUTER_MODEL`: `apifreellm`
    *   `OPENROUTER_API_URL`: `https://apifreellm.com/api/v1/chat`
    *   `CORS_ORIGINS`: `*` (Or the URL of your frontend once deployed, e.g. `https://my-frontend.up.railway.app`)

6.  **Database**:
    *   Right click on the canvas (or click "New") -> **Database** -> **PostgreSQL**.
    *   Wait for it to initialize.
    *   Railway automatically injects `DATABASE_URL` into your backend service if they are in the same project. If not, copy the `DATABASE_URL` from Postgres service and add it to Backend variables.

7.  **Build & Deploy**: Railway uses the `Procfile` we created (`web: uvicorn app.main:app...`) or detects Python requirements. It should deploy successfully.
8.  **Copy URL**: Once deployed, note the **Public URL** (Networking section), e.g., `https://backend-production.up.railway.app`.

## Step 2: Deploy Frontend

1.  In the same project, click **New** -> **GitHub Repo**.
2.  Select the **SAME** repository again.
3.  **Settings**:
    *   **Root Directory**: `/frontend`
4.  **Build Command**: Railway usually detects Vite. If not, set:
    *   Build Command: `npm run build`
    *   Start Command: `npx serve -s dist -l $PORT`
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste the **Backend Public URL** from Step 1 (e.g., `https://backend-production.up.railway.app`).
    *   *Note: No trailing slash recommended.*

6.  **Deploy**: The frontend will build (using the `VITE_API_URL` to hardcode the backend link) and then serve the static files.

## Step 3: Final Configuration

1.  **CORS**: Go back to your **Backend Service** variables.
    *   Update `CORS_ORIGINS` to match your **Frontend Public URL** (e.g., `https://frontend-production.up.railway.app`).
    *   Redeploy Backend.

2.  **Admin User**:
    *   You need to create an admin user in the production database.
    *   Use Railway CLI or the "Query" tab in Postgres service, but the easiest way is via the deployed API docs (`/docs`) or running a script locally pointing to the remote DB.
    *   **Alternative**: Connect to the remote DB using a tool like DBeaver (using info from Railway "Connect" tab) and manually insert a user or update `is_admin = true`.

## Troubleshooting

*   **Build Fails**: Check `requirements.txt` (Backend) or `package.json` (Frontend) for missing dependencies.
*   **Frontend can't connect**: Check browser console network tab. If requests go to `localhost`, `VITE_API_URL` wasn't set during build. You must set the var and **Redeploy** (Rebuild) the frontend.
*   **Database Error**: Ensure `DATABASE_URL` is correct properly linked.

