# AgroTrust Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet
- Some test ETH for gas fees

### Local Development Deployment

1. **Start local Hardhat network**
   ```bash
   npm run node
   ```

2. **Deploy to local network**
   ```bash
   npm run deploy:local
   ```

3. **Interact with the contract**
   ```bash
   # Update the contract address in scripts/interact.ts first
   npm run interact:local
   ```

## 🌐 Production Deployment

### 1. Configure Networks

Add network configurations to `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Private key of the account that will deploy the contract
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
MAINNET_URL=https://mainnet.infura.io/v3/your_project_id

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. Deploy to Testnet (Sepolia)

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia
```

### 4. Deploy to Mainnet

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.ts --network mainnet
```

### 5. Verify Contract

After deployment, verify your contract on Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 📋 Deployment Checklist

- [ ] **Environment Setup**
  - [ ] Node.js and npm installed
  - [ ] Hardhat project configured
  - [ ] Environment variables set

- [ ] **Network Configuration**
  - [ ] RPC URLs configured
  - [ ] Private key secured
  - [ ] Gas settings optimized

- [ ] **Pre-deployment**
  - [ ] Tests passing (`npm test`)
  - [ ] Contract compiled (`npm run compile`)
  - [ ] Gas estimation checked

- [ ] **Deployment**
  - [ ] Contract deployed successfully
  - [ ] Contract address recorded
  - [ ] Transaction hash saved

- [ ] **Post-deployment**
  - [ ] Contract verified on Etherscan
  - [ ] Initial setup completed
  - [ ] Access control configured

## 🔧 Configuration Examples

### Gas Optimization

For mainnet deployment, consider gas optimization:

```typescript
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 21,
  },
};
```

### Multi-signature Deployment

For production deployments, consider using a multi-signature wallet:

1. Deploy from a temporary account
2. Transfer ownership to multi-signature wallet
3. Configure authorized users through the multi-signature wallet

## 🛡️ Security Considerations

### Before Deployment

1. **Audit the Contract**
   - Review all functions and modifiers
   - Check access control mechanisms
   - Verify data validation

2. **Test Thoroughly**
   - Run all test cases
   - Test edge cases
   - Perform integration testing

3. **Secure Private Keys**
   - Use hardware wallets for production
   - Never commit private keys to version control
   - Use environment variables

### After Deployment

1. **Monitor the Contract**
   - Track all transactions
   - Monitor for suspicious activity
   - Set up alerts for critical functions

2. **Access Control**
   - Configure authorized users carefully
   - Regularly review access permissions
   - Implement role-based access control

## 📊 Deployment Costs

### Estimated Gas Costs (approximate)

- **Contract Deployment**: ~2,000,000 gas
- **Batch Creation**: ~100,000 gas
- **Add Farmer Info**: ~80,000 gas
- **Add Cultivation Details**: ~90,000 gas
- **Add Processing Info**: ~85,000 gas
- **Add Lab Results**: ~75,000 gas
- **Add Certificate**: ~70,000 gas
- **Add Transfer Record**: ~60,000 gas
- **Add Trace Data**: ~65,000 gas

### Cost Estimation

```bash
# Estimate deployment cost
npx hardhat run scripts/deploy.ts --network sepolia --dry-run
```

## 🔍 Troubleshooting

### Common Issues

1. **Insufficient Gas**
   - Increase gas limit in deployment script
   - Check current gas prices

2. **Network Connection Issues**
   - Verify RPC URL is correct
   - Check network status

3. **Contract Verification Fails**
   - Ensure compiler settings match
   - Check constructor arguments

4. **Permission Denied**
   - Verify private key is correct
   - Check account has sufficient balance

### Debug Commands

```bash
# Check network status
npx hardhat console --network sepolia

# Verify contract bytecode
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Check gas usage
REPORT_GAS=true npm test
```

## 📞 Support

For deployment issues:
1. Check the [Hardhat documentation](https://hardhat.org/docs)
2. Review error logs carefully
3. Test on local network first
4. Contact the development team

---

**Remember: Always test on testnet before mainnet deployment!** 