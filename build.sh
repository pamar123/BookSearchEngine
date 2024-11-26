#!/bin/bash

# Install dependencies
npm install

# Build client
cd client
npm install --include=dev
npm run build

# Build server
cd ../server
npm install --include=dev
npm run build

# Create a directory for client build in server
mkdir -p dist/client

# Copy client build to server's dist directory
cp -r ../client/dist/* dist/client/

cd ..