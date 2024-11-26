#!/bin/bash

# Install root dependencies
npm install

# Install and build client
cd client
npm install --include=dev
npm run build

# Install and build server
cd ../server
npm install --include=dev
npm run build

cd ..