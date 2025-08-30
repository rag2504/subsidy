# Subsidy Management System

A production-ready full-stack React application with integrated Express server, featuring React Router 6 SPA mode, TypeScript, and modern tooling.

## 🚀 Quick Start

### Development (Combined)
```bash
# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev
```

### Development (Separate)
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

## 📁 Project Structure

```
├── client/                   # React SPA frontend (Vercel deployment)
│   ├── pages/               # Route components
│   ├── components/          # UI components
│   ├── lib/                 # Utilities and auth
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Frontend build config
├── server/                  # Express API backend (Render deployment)
│   ├── routes/              # API handlers
│   ├── middleware/          # Auth middleware
│   ├── package.json         # Backend dependencies
│   └── vite.config.ts       # Backend build config
├── shared/                  # Types used by both client & server
├── vercel.json             # Vercel deployment config
├── render.yaml             # Render deployment config
└── deploy.sh               # Deployment helper script
```

## 🛠 Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite + TailwindCSS
- **Backend**: Express + TypeScript + MongoDB
- **UI**: Radix UI + TailwindCSS + Lucide React icons
- **Package Manager**: PNPM
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🌐 Deployment

This project is configured for separate deployment:

- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment

```bash
# Build and deploy frontend
./deploy.sh frontend --deploy

# Build and deploy backend
./deploy.sh backend --deploy

# Build and deploy both
./deploy.sh all --deploy
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure your environment variables:

```bash
cp env.example .env
```

Required variables for backend:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Your Vercel frontend URL (for CORS)

### API Proxy

The frontend automatically proxies API requests to the backend using Vercel's rewrite rules. Update the backend URL in `vercel.json` after deployment.

## 📚 Available Scripts

### Root Level
- `pnpm dev` - Start combined development server
- `pnpm build` - Build both frontend and backend
- `pnpm start` - Start production server (combined)

### Frontend (client/)
- `pnpm dev` - Start frontend development server
- `pnpm build` - Build frontend for production
- `pnpm preview` - Preview production build

### Backend (server/)
- `pnpm dev` - Start backend development server
- `pnpm build` - Build backend for production
- `pnpm start` - Start production backend server

## 🔐 Authentication

The system uses JWT-based authentication with OTP verification:

1. Request OTP: `POST /api/auth/request-otp`
2. Verify OTP: `POST /api/auth/verify-otp`
3. Get user info: `GET /api/auth/me`

## 🎯 User Roles

- **Gov**: Government administrators
- **Producer**: Project producers
- **Auditor**: Project auditors
- **Bank**: Banking operations

## 📖 API Documentation

### Public Endpoints
- `GET /api/ping` - Health check
- `GET /api/gov/programs` - List programs
- `GET /api/gov/milestones` - List milestones

### Protected Endpoints
All other endpoints require authentication and appropriate role permissions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
