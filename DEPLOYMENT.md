# Deployment Guide

This project is configured for separate deployment of frontend and backend:

- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Render

## Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `cd server && pnpm install && pnpm build`
     - **Start Command**: `cd server && pnpm start`
     - **Environment**: Node

2. **Set Environment Variables**
   Add these environment variables in your Render service:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CASHFREE_APP_ID=your_cashfree_app_id
   CASHFREE_SECRET_KEY=your_cashfree_secret_key
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

3. **Deploy**
   - Render will automatically build and deploy your backend
   - Note the URL provided by Render (e.g., `https://your-app.onrender.com`)

## Frontend Deployment (Vercel)

1. **Update Backend URL**
   - Edit `vercel.json` and replace `https://your-backend-url.onrender.com` with your actual Render backend URL

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set the following configuration:
     - **Framework Preset**: Vite
     - **Build Command**: `cd client && pnpm install && pnpm build`
     - **Output Directory**: `dist/spa`
     - **Install Command**: `pnpm install`

3. **Environment Variables (if needed)**
   Add any frontend-specific environment variables in Vercel dashboard.

## Development

### Local Development (Combined)
```bash
# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev
```

### Separate Development
```bash
# Backend only
cd server
pnpm install
pnpm dev

# Frontend only (in another terminal)
cd client
pnpm install
pnpm dev
```

## Important Notes

1. **CORS Configuration**: The backend is configured to accept requests from any origin in production. You may want to restrict this to your Vercel domain.

2. **API Proxy**: The frontend uses Vercel's rewrite rules to proxy API requests to the backend. This means all API calls from the frontend will be automatically forwarded to your Render backend.

3. **Environment Variables**: Make sure all required environment variables are set in your Render service.

4. **Database**: Ensure your MongoDB instance is accessible from Render's servers.

## Troubleshooting

### Backend Issues
- Check Render logs for build errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Frontend Issues
- Check Vercel build logs
- Verify the backend URL in `vercel.json` is correct
- Ensure all dependencies are properly installed

### CORS Issues
- The backend includes CORS middleware that allows all origins
- If you need to restrict origins, modify the CORS configuration in `server/index.ts`
