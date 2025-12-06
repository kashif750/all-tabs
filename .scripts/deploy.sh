#!/bin/bash
set -e

echo "Deployment Tabs.haukinnova.com started..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

# loan nvm 
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# ensure node & npm are in path
export PATH="$NVM_DIR/versions/node/v24.11.1/bin:$PATH"

echo "Using Node:"
node -v
npm -v

echo "Installing Dependencies..."
npm install --yes

echo "Creating AllTabs Production Build..."
# For ReactJS VueJS and Nuxt JS
npm run build

# For NextJS
# npm run export

echo "Deployment Finished!"