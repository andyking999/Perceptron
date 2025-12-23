# Multi-stage Dockerfile for Perceptron
# This allows running both Python and Node.js implementations

FROM python:3.11-slim as python-base

WORKDIR /app
COPY perceptron.py .

FROM node:20-slim as node-base

WORKDIR /app
COPY perceptron.js .

# Final stage - includes both Python and Node.js
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy both implementations
COPY perceptron.py .
COPY perceptron.js .

# Default command runs Python version
CMD ["python", "perceptron.py"]
