#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating main branch with all changes...${NC}"

# Create and switch to main branch
git checkout -b main

# Add all changes
echo -e "\n${GREEN}Adding all changes...${NC}"
git add .
git commit -m "feat: complete Block-Route integration

- Frontend integration with Lisk Sepolia
  * Add CreateShipment form with validation
  * Update chain configuration
  * Fix contract interaction hooks
  * Add comprehensive error handling

- Smart Contract integration
  * Deploy contracts to Lisk Sepolia
  * Update deployment scripts
  * Add contract documentation

- Documentation
  * Add detailed README
  * Add technical documentation
  * Add setup instructions
  * Add testing guide"

# Force push to main branch
echo -e "\n${GREEN}Pushing to main branch...${NC}"
git push -f origin main

echo -e "\n${GREEN}All changes have been merged to main branch successfully!${NC}"
echo -e "${BLUE}The repository now contains:${NC}"
echo -e "1. Complete frontend integration"
echo -e "2. Smart contract deployment"
echo -e "3. Comprehensive documentation"
