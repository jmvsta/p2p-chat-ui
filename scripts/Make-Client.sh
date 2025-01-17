#!/bin/bash

Port=$1
ClientPath=$2
UIPath=$3
OutputPath=$4
Debug=$5

if [ -z "$Port" ]  [ -z "$ClientPath" ]  [ -z "$UIPath" ]  [ -z "$OutputPath" ]; then
    echo "Usage: $0 <Port> <ClientPath> <UIPath> <OutputPath> [Debug]"
    exit 1
fi

cd "$UIPath"  exit 1

npm run build:cli$Port
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi

mkdir -p "$ClientPath/static/react/js"
cp "$UIPath/dist/main.js" "$ClientPath/static/react/js/"

if [ "$Debug" == "true" ]; then
    cp "$UIPath/dist/main.js.map" "$ClientPath/static/react/js/"
fi

mkdir -p "$ClientPath/static/react/html"
cp "$UIPath/dist/index.html" "$ClientPath/static/react/html/"

mkdir -p "$ClientPath/static/react/public"
cp "$UIPath/public/logo.jpg" "$ClientPath/static/react/public/"
cp "$UIPath/public/logo_1.jpg" "$ClientPath/static/react/public/"

cd "$ClientPath"  exit 1

go build
if [ $? -ne 0 ]; then
    echo "Go build failed"
    exit 1
fi

mkdir -p "$OutputPath/cli$Port"
cp "$ClientPath/avdol-client" "$OutputPath/cli$Port/"

cd "$OutputPath/cli$Port"  exit 1

export AVDOL_CLIENT_API_PORT="$Port"
export AVDOL_CLIENT_LOCAL_DB="avdol$Port.locdb"
export AVDOL_CLIENT_LOG_PREFIX="dmvstv_v-local"
export AVDOL_SRV_PRIV_KEY="id_rsa_avdol"
export AVDOL_SRV_ADMIN_PORT="8082"
export AVDOL_SRV_ADMIN_TOKEN="admin"
export AVDOL_SRV_TCP_PORT="8084"

./avdol-client