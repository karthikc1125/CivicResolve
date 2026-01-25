#!/bin/bash
# Application startup script for Render deployment

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Install Node.js dependencies
cd frontend && npm ci --production=false && npm run build && cd ..

# Set Python path and start Flask backend
export PYTHONPATH="$PROJECT_ROOT:$PYTHONPATH"
cd "$PROJECT_ROOT"
gunicorn backend.app:app --bind 0.0.0.0:${PORT:-5000} --workers 2 --timeout 120 --chdir "$PROJECT_ROOT"
