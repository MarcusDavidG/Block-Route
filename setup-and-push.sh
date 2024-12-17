#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Git repository and pushing changes...${NC}"

# Initialize git repository
git init
git remote add origin https://github.com/MarcusDavidG/Block-Route.git

# Create and switch to frontend-integration branch
echo -e "\n${GREEN}Setting up frontend-integration branch...${NC}"
git checkout -b frontend-integration

# Frontend Integration Changes
echo -e "\n${GREEN}Pushing frontend integration changes...${NC}"
git add .
git commit -m "feat: complete frontend integration with Lisk Sepolia testnet

- Add CreateShipment form with proper validation
- Update chain configuration for Lisk Sepolia
- Fix contract interaction in useBlockRoute hook
- Add comprehensive documentation
- Improve error handling and user feedback"

git push -u origin frontend-integration

# Create and switch to contracts-integration branch
echo -e "\n${GREEN}Setting up contracts-integration branch...${NC}"
git checkout -b contracts-integration

# Contracts Integration Changes
echo -e "\n${GREEN}Pushing contract integration changes...${NC}"
git add .
git commit -m "feat: complete smart contract integration

- Update contract deployment scripts for Lisk Sepolia
- Add technical documentation
- Update README with setup instructions
- Add comprehensive testing guide"

git push -u origin contracts-integration

echo -e "\n${GREEN}All changes have been pushed successfully!${NC}"
echo -e "${BLUE}Please create pull requests for both branches on GitHub:${NC}"
echo -e "1. frontend-integration -> main"
echo -e "2. contracts-integration -> main"
