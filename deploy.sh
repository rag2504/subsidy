#!/bin/bash

# Deployment script for separate frontend/backend deployment

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to build frontend
build_frontend() {
    echo "📦 Building frontend..."
    cd client
    pnpm install
    pnpm build
    cd ..
    echo "✅ Frontend build complete"
}

# Function to build backend
build_backend() {
    echo "🔧 Building backend..."
    cd server
    pnpm install
    pnpm build
    cd ..
    echo "✅ Backend build complete"
}

# Function to deploy frontend (Vercel)
deploy_frontend() {
    echo "🌐 Deploying frontend to Vercel..."
    cd client
    vercel --prod
    cd ..
    echo "✅ Frontend deployment initiated"
}

# Function to deploy backend (Render)
deploy_backend() {
    echo "⚙️  Backend deployment on Render..."
    echo "Please deploy manually to Render using the following settings:"
    echo "  - Build Command: cd server && pnpm install && pnpm build"
    echo "  - Start Command: cd server && pnpm start"
    echo "  - Environment: Node"
    echo ""
    echo "Don't forget to set all required environment variables!"
}

# Main script
case "$1" in
    "frontend")
        build_frontend
        if [ "$2" = "--deploy" ]; then
            deploy_frontend
        fi
        ;;
    "backend")
        build_backend
        if [ "$2" = "--deploy" ]; then
            deploy_backend
        fi
        ;;
    "all")
        build_frontend
        build_backend
        if [ "$2" = "--deploy" ]; then
            deploy_frontend
            deploy_backend
        fi
        ;;
    *)
        echo "Usage: $0 {frontend|backend|all} [--deploy]"
        echo ""
        echo "Commands:"
        echo "  frontend     Build frontend only"
        echo "  backend      Build backend only"
        echo "  all          Build both frontend and backend"
        echo ""
        echo "Options:"
        echo "  --deploy     Also deploy after building"
        echo ""
        echo "Examples:"
        echo "  $0 frontend --deploy    # Build and deploy frontend"
        echo "  $0 backend              # Build backend only"
        echo "  $0 all --deploy         # Build and deploy both"
        exit 1
        ;;
esac

echo "🎉 Deployment process complete!"
