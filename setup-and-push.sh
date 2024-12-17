#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Git repository and pushing changes...${NC}"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/MarcusDavidG/Block-Route.git
fi

# Fetch all branches
echo -e "\n${GREEN}Fetching existing branches...${NC}"
git fetch origin

# Frontend Integration Branch
echo -e "\n${GREEN}Setting up frontend-integration branch...${NC}"
if git show-ref --verify --quiet refs/heads/frontend-integration; then
    git checkout frontend-integration
    git pull origin frontend-integration
else
    git checkout -b frontend-integration
fi

# Frontend Integration Changes
echo -e "\n${GREEN}Adding frontend integration changes...${NC}"
git add .
git commit -m "feat: complete frontend integration with Lisk Sepolia testnet

- Add CreateShipment form with proper validation
- Update chain configuration for Lisk Sepolia
- Fix contract interaction in useBlockRoute hook
- Add comprehensive documentation
- Improve error handling and user feedback"

git push -f origin frontend-integration

# Contracts Integration Branch
echo -e "\n${GREEN}Setting up contracts-integration branch...${NC}"
if git show-ref --verify --quiet refs/heads/contracts-integration; then
    git checkout contracts-integration
    git pull origin contracts-integration
else
    git checkout -b contracts-integration
fi

# Contracts Integration Changes
echo -e "\n${GREEN}Adding contract integration changes...${NC}"
git add .
git commit -m "feat: complete smart contract integration

- Update contract deployment scripts for Lisk Sepolia
- Add technical documentation
- Update README with setup instructions
- Add comprehensive testing guide"

git push -f origin contracts-integration

echo -e "\n${GREEN}All changes have been pushed successfully!${NC}"
echo -e "${BLUE}Please create pull requests for both branches on GitHub:${NC}"
echo -e "1. frontend-integration -> main"
echo -e "2. contracts-integration -> main"

# Return to frontend-integration branch
git checkout frontend-integration
