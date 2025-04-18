#!bin/bash

PORT=$1

# Set default port if not provided
if [ -z "$PORT" ]; then
    PORT=8000
fi

poetry run uvicorn api.main:app --reload --port $PORT