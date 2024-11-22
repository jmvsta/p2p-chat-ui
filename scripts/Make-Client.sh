#!/bin/bash

# Input parameters
Port=$1
ClientPath=$2
UIPath=$3
OutputPath=$4

# Navigate to the UIPath
cd "$UIPath" || { echo "UIPath not found: $UIPath"; exit 1; }

# Run npm build
npm run build:cli"$Port"
if [ $? -ne 0 ]; then
    echo "npm build failed"
    exit 1
fi

# Copy the built files
mkdir -p "$ClientPath/static/js" "$ClientPath/static/html"
cp "$UIPath/dist/main.js" "$ClientPath/static/js/" || { echo "Failed to copy main.js"; exit 1; }
cp "$UIPath/dist/index.html" "$ClientPath/static/html/" || { echo "Failed to copy index.html"; exit 1; }

# Navigate to the ClientPath
cd "$ClientPath" || { echo "ClientPath not found: $ClientPath"; exit 1; }

# Build the Go executable
go build
if [ $? -ne 0 ]; then
    echo "Go build failed"
    exit 1
fi

# Copy the Go executable to the output path
OutputDir="$OutputPath/cli$Port"
mkdir -p "$OutputDir"
cp "$ClientPath/avdol-client" "$OutputDir/" || { echo "Failed to copy avdol-client"; exit 1; }

# Navigate to the output directory
cd "$OutputDir" || { echo "Output directory not found: $OutputDir"; exit 1; }

# Set environment variables
export AVDOL_CLIENT_API_PORT="$Port"
export AVDOL_CLIENT_LOCAL_DB="avdol$Port.locdb"
export AVDOL_CLIENT_LOG_PREFIX="dmvstv_v-local"
export AVDOL_SRV_PRIV_KEY="id_rsa_avdol"
export AVDOL_SRV_ADMIN_PORT="8082"
export AVDOL_SRV_ADMIN_TOKEN="admin"
export AVDOL_SRV_TCP_PORT="8084"

# Run the client executable
./avdol-client
if [ $? -ne 0 ]; then
    echo "Failed to run avdol-client"
    exit
