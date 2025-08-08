const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 AgroTrust Contract Setup');
console.log('==========================');

console.log('\n1. Make sure Hardhat network is running in another terminal:');
console.log('   npx hardhat node');
console.log('\n2. Deploy the contract:');
console.log('   npx hardhat run scripts/deploy.ts --network localhost');
console.log('\n3. Copy the contract address from the output');
console.log('\n4. Update the address in:');
console.log('   - frontend/src/services/metamaskService.ts');
console.log('   - backend/src/services/blockchainService.ts');
console.log('\n5. Populate the data:');
console.log('   npx hardhat run scripts/populateData.ts --network localhost');

console.log('\n📝 Current contract address being used:');
console.log('   0x5FbDB2315678afecb367f032d93F642f64180aa3');
console.log('\n⚠️  This is a default address - you need to deploy to get the real one!'); 