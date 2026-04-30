#!/bin/bash
# Quick Start Script for smart-agri
# Run this after setting up your .env files

echo "================================"
echo "Smart-Agri Quick Start"
echo "================================"
echo ""

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Run this script from the smart-agri root directory"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js not installed"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Check if backend/.env is configured
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found"
    echo "Copy backend/.env.example to backend/.env and fill in values"
    exit 1
fi

if grep -q "your-supabase-url-here" "backend/.env"; then
    echo "⚠️  WARNING: backend/.env still has placeholder values!"
    echo "Please fill in your Supabase credentials"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "=== Installing Dependencies ==="
echo ""

# Install frontend dependencies
echo "📦 Frontend dependencies..."
if npm install > /dev/null 2>&1; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Backend dependencies..."
if cd backend && npm install > /dev/null 2>&1; then
    echo "✓ Backend dependencies installed"
    cd ..
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "=== Ready to Start! ==="
echo ""
echo "In Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "In Terminal 2 (Frontend):"
echo "  npm start"
echo ""
echo "Then:"
echo "  Press 'i' for iOS simulator"
echo "  Press 'a' for Android emulator"
echo "  Or scan QR code with Expo app on your phone"
echo ""
echo "✓ Setup complete!"
