# Docker & Render Deployment Guide

## Project Setup Complete ✅

Your Node.js/Express service provider backend is now configured for Docker deployment on Render.

---

## Files Created

1. **Dockerfile** - Multi-stage build for optimized production image
2. **docker-compose.yml** - Local development with PostgreSQL
3. **.dockerignore** - Excludes unnecessary files from Docker image
4. **render.yaml** - Render deployment configuration
5. **src/config/config.js** - Environment-based database configuration
6. **.env.example** - Template for environment variables

---

## Step 1: Local Testing with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git repository initialized

### Test Locally

```bash
# Copy and configure environment variables
cp .env.example .env

# Update .env with your local database credentials (optional, uses defaults)
# Edit .env if needed

# Build and run with Docker Compose
docker-compose up --build

# The app will start on http://localhost:3000
# The database will be available on localhost:5432
```

### Stop the services
```bash
docker-compose down
```

---

## Step 2: Prepare for Render Deployment

### 2.1 Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Docker setup for Render"
git remote add origin https://github.com/YOUR_USERNAME/service-provider-system.git
git push -u origin main
```

### 2.2 Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com)
2. Sign up/Log in
3. Click "New +" → "PostgreSQL"
4. Configure:
   - **Name**: `service-provider-db`
   - **Database**: `service_provider`
   - **User**: Choose a secure username
   - **Region**: Select closest to your location
   - **Version**: 15 (or latest)
5. Click "Create Database"
6. Save the connection string (you'll need it in Step 3)

---

## Step 3: Deploy Web Service on Render

### 3.1 Create Web Service

1. Click "New +" → "Web Service"
2. Select "Deploy existing repository"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `service-provider-server`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose Starter (free tier available)

### 3.2 Set Environment Variables

Click "Environment" and add the following variables (from your PostgreSQL database):

```
NODE_ENV=production
PORT=3000
DB_HOST=<postgres-host-from-render>
DB_PORT=5432
DB_USER=<postgres_username>
DB_PASSWORD=<postgres_password>
DB_NAME=service_provider
JWT_SECRET=<generate-a-secure-random-string>
CORS_ORIGIN=https://<your-service-name>.onrender.com
```

**How to get PostgreSQL credentials:**
- Open your PostgreSQL database on Render
- Look for "Connections" section
- Copy the hostname, username, etc.

### 3.3 Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for deployment to complete (check logs for any errors)
4. Your API will be available at: `https://<your-service-name>.onrender.com`

---

## Step 4: Run Database Migrations (if applicable)

You may need to run migrations on the Render database. Options:

### Option A: Add migration command to Dockerfile

Update your Dockerfile to run migrations:

```dockerfile
# In the production stage, before CMD
RUN npm run migrate

CMD ["npm", "start"]
```

### Option B: Manual migration (SSH into Render)

1. In Render dashboard, click your service
2. Look for Shell or SSH option
3. Run: `npm run migrate`

### Option C: Use Sequelize-CLI

Add to package.json if not present:

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "migrate": "sequelize-cli db:migrate",
  "migrate:undo": "sequelize-cli db:migrate:undo:all"
}
```

---

## Step 5: Verify Deployment

Test your API:

```bash
# Health check (adjust endpoint as needed)
curl https://<your-service-name>.onrender.com/api/users

# Or test with postman/insomnia
```

Check logs:
- Open your service in Render dashboard
- Click "Logs" to view application output
- Look for `Server running on port 3000`

---

## Important Security Notes

⚠️ **BEFORE DEPLOYING:**

1. **Never commit secrets** - Remove hardcoded passwords from config.json ✅ (Already done)
2. **Generate secure JWT_SECRET**: 
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Update config.json.json password fields** - Only use environment variables in production ✅
4. **Add credentials to .gitignore** - Already includes `.env` ✅

---

## Troubleshooting

### Build fails with "npm ERR!"
- Check `package.json` syntax
- Ensure all dependencies are listed
- Check Render build logs for specific errors

### Database connection failed
- Verify DB_HOST, DB_USER, DB_PASSWORD in Environment variables
- Check PostgreSQL is running on Render
- Ensure IP whitelist allows Render servers

### Application crashes after deploy
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set correctly
- Check database migrations ran successfully

### Port issues
- Render assigns PORT via environment variable
- Ensure your app.js uses `process.env.PORT`
- Current setup: `const PORT = process.env.PORT;` ✅

---

## Local Development

For local development with auto-reload:

```bash
npm install --save-dev nodemon

# Update package.json (already done):
"dev": "nodemon src/app.js"

# Run with Docker Compose
docker-compose up --build

# Or without Docker
npm run dev
```

---

## Useful Render Commands

View logs:
```bash
# In Render dashboard: Service → Logs
```

Restart service:
```
# Render dashboard: Service → Manual Deploy or Auto-Deploy on push
```

---

## Next Steps

1. ✅ Test locally: `docker-compose up`
2. ✅ Push to GitHub
3. ✅ Create PostgreSQL on Render
4. ✅ Create Web Service on Render
5. ✅ Set environment variables
6. ✅ Deploy and verify

Your application is now ready for production deployment! 🚀
