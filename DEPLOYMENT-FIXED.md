# 🚀 Fixed Deployment Guide for Subsidy Backend

## ✅ Issues Fixed

1. **CONTRACT_ADDRESS missing error** - Fixed by making web3/contract exports lazy
2. **Path-to-regexp error** - Fixed by simplifying vite config and creating standalone server
3. **Render not using production start command** - Fixed with smart start script
4. **Build configuration issues** - Fixed with proper vite configs

## 🏗️ Build Process

The build process now works as follows:

1. **Client Build**: Uses `vite.config.client.ts` (no server dependencies)
2. **Server Build**: Uses `vite.config.server.ts` (builds standalone server)
3. **Start Script**: Smart script that detects environment and starts appropriate server

## 📁 Key Files

### Build Configuration
- `vite.config.client.ts` - Client-only build (no server imports)
- `vite.config.server.ts` - Server build (standalone server)
- `package.json` - Updated scripts and dependencies

### Server Files
- `server/standalone-server.ts` - Simple, robust production server
- `server/web3/contract.ts` - Lazy-loaded blockchain integration
- `start.js` - Smart start script for all environments

### Deployment
- `render.yaml` - Render configuration with all environment variables

## 🔧 Environment Variables Required

Set these in your Render dashboard:

### Required
- `NODE_ENV=production`
- `PORT=10000`

### Blockchain (if using blockchain features)
- `CONTRACT_ADDRESS` - Your deployed contract address
- `CHAIN_RPC` - Blockchain RPC URL
- `GOV_PRIVATE_KEY` - Government wallet private key
- `AUDITOR_PRIVATE_KEY` - Auditor wallet private key

### Database
- `MONGODB_URI` - MongoDB connection string

### Authentication
- `JWT_SECRET` - Secret for JWT tokens

### Payment Gateway (if using Cashfree)
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`

### Email (if using SMTP)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### Frontend URL
- `FRONTEND_URL` - Your frontend domain

## 🚀 Deployment Steps

1. **Push to GitHub** - All fixes are in the codebase
2. **Connect to Render** - Link your GitHub repository
3. **Set Environment Variables** - Add all required variables in Render dashboard
4. **Deploy** - Render will use the render.yaml configuration

## 🔍 Troubleshooting

### If build fails:
- Check that all dependencies are installed
- Verify Node.js version (>=20.18.0)

### If server won't start:
- Check environment variables are set correctly
- Verify the standalone server was built (`dist/server/standalone.mjs`)

### If path-to-regexp error occurs:
- This should be fixed with the new standalone server
- Check that no URLs are being passed as route patterns

## 📊 Health Check

The server provides a health check endpoint:
- `GET /api/ping` - Returns server status and timestamp

## 🎯 Success Indicators

✅ Build completes without errors
✅ Server starts and responds to health check
✅ Frontend is served correctly
✅ API endpoints are accessible

## 🔄 Rollback Plan

If issues occur:
1. Check Render logs for specific errors
2. Verify environment variables are correct
3. Test locally with `NODE_ENV=production npm run dev`
4. If needed, revert to previous working commit

---

**The deployment should now work reliably on Render!** 🎉
