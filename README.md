# AgroTrust - Blockchain-Based GI Product Traceability System

A comprehensive blockchain-based system for verifying authenticity of GI (Geographical Indication) tagged products with complete traceability from farm to consumer.

## 🏗️ System Architecture

```
AgroTrust/
├── AgroTrust/          # Smart Contract (Hardhat)
│   ├── contracts/      # Solidity smart contracts
│   ├── scripts/        # Deployment and interaction scripts
│   └── test/          # Smart contract tests
├── backend/            # Node.js/Express API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Blockchain service
│   │   └── middleware/ # Error handling
│   └── package.json
└── frontend/           # React Application with MetaMask
    ├── src/
    │   ├── pages/      # React components
    │   ├── components/ # Reusable components
    │   └── services/   # MetaMask integration
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm
- MetaMask browser extension
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd AgroTrust
```

### 2. Install Dependencies
```bash
# Install smart contract dependencies
cd AgroTrust
npm install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start the System

#### Step 1: Start Blockchain Network
```bash
cd AgroTrust
npm run node
```
**Keep this terminal running!**

#### Step 2: Deploy Smart Contract
```bash
# In a new terminal
cd AgroTrust
npm run deploy:local
```

#### Step 3: Populate Sample Data
```bash
# In the same terminal
npm run populate
```

#### Step 4: Start Backend (Optional)
```bash
# In a new terminal
cd backend
npm run dev
```

#### Step 5: Start Frontend
```bash
# In a new terminal
cd frontend
npm run dev
```

### 4. Configure MetaMask

1. **Install MetaMask** if not already installed
2. **Add Local Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
3. **Import Account**:
   - Use private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH for testing

## 🎯 Features

### ✅ Smart Contract Features
- Complete data structures for GI products
- Access control and validation
- Event emission for transparency
- All setter and getter functions

### ✅ Frontend Features
- **MetaMask Integration**: Direct blockchain interaction
- **Batch Lookup**: Search existing batches
- **Real-time Data**: Live blockchain data fetching
- **Professional UI**: Government-grade interface
- **Mobile Responsive**: Works on all devices

### ✅ Pre-populated Data
- **Erode Turmeric (ERD-TUR-2025-001)**: Complete traceability data
- **Kanyakumari Clove (KC-CLOVE-2025-001)**: Complete traceability data

### ✅ Backend Features (Optional)
- RESTful API endpoints
- Blockchain service integration
- Health monitoring
- Error handling

## 🔍 How to Use

### 1. Batch Lookup
1. Go to http://localhost:3000
2. Click "Batch Lookup"
3. Connect MetaMask when prompted
4. Search for existing batches:
   - `ERD-TUR-2025-001` (Erode Turmeric)
   - `KC-CLOVE-2025-001` (Kanyakumari Clove)
5. View complete traceability information

### 2. Add New Batches
1. Go to http://localhost:3000
2. Click "Add Data"
3. Fill out the batch information
4. Connect MetaMask to submit transactions
5. View transaction confirmation

### 3. QR Code Scanning
1. Go to http://localhost:3000
2. Click "QR Scanner"
3. Enter batch ID or scan QR code
4. View traceability information

## 📊 Available Data

### Erode Turmeric (ERD-TUR-2025-001)
- **Crop**: Turmeric
- **Variety**: Erode Manjal
- **Location**: Erode, Tamil Nadu
- **Farmer**: Dhanasekaran V
- **Soil Type**: Red Soil
- **Irrigation**: Drip Irrigation
- **Processor**: Erode Processing Unit
- **Lab Result**: Curcumin content: 3.5%, Moisture: 9%
- **Certificate**: GI Certificate from Erode Turmeric Merchants Association

### Kanyakumari Clove (KC-CLOVE-2025-001)
- **Crop**: Clove
- **Variety**: Kanyakumari Clove
- **Location**: Kanyakumari, Tamil Nadu
- **Farmer**: Chinnachenna Naicker
- **Soil Type**: Laterite Soil
- **Irrigation**: Rain-fed
- **Processor**: Kanyakumari Processing Unit
- **Lab Result**: Eugenol content: 85%, Moisture: 9%
- **Certificate**: GI Certificate from Spices Board India

## 🔧 Troubleshooting

### MetaMask Connection Issues
1. **Ensure MetaMask is installed**
2. **Check network configuration**:
   - Network: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
3. **Verify account import**:
   - Use the provided private key
   - Account should have ETH balance

### Blockchain Connection Issues
1. **Check Hardhat node**:
   ```bash
   cd AgroTrust
   npm run node
   ```
2. **Verify contract deployment**:
   ```bash
   npm run deploy:local
   ```
3. **Check data population**:
   ```bash
   npm run populate
   npm run verify
   ```

### Frontend Issues
1. **Check MetaMask connection**
2. **Verify network selection**
3. **Check browser console for errors**
4. **Ensure all dependencies are installed**

### Backend Issues (Optional)
1. **Check if backend is running**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Verify environment variables**
3. **Check blockchain connection**

## 🛠️ Development

### Smart Contract Development
```bash
cd AgroTrust
npm run compile
npm run test
npm run deploy:local
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

## 📁 Project Structure

```
AgroTrust/
├── contracts/
│   └── AgroTrust.sol          # Main smart contract
├── scripts/
│   ├── deploy.ts              # Contract deployment
│   ├── populateData.ts        # Sample data population
│   └── verifyData.ts          # Data verification
├── test/
│   └── AgroTrust.test.ts      # Smart contract tests
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── batchRoutes.ts # API endpoints
│   │   ├── services/
│   │   │   └── blockchainService.ts # Blockchain integration
│   │   └── index.ts           # Server setup
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── BatchLookup.tsx    # Batch search
    │   │   ├── BatchDetails.tsx   # Batch details
    │   │   └── AddData.tsx        # Data addition
    │   ├── services/
    │   │   └── metamaskService.ts # MetaMask integration
    │   └── App.tsx
    └── package.json
```

## 🔒 Security Features

- **Access Control**: Only authorized users can modify data
- **Immutable Records**: All data stored on blockchain
- **Transaction Verification**: All changes are verifiable
- **Event Logging**: Complete audit trail

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001 (optional)
- **Blockchain**: http://localhost:8545
- **Health Check**: http://localhost:3001/api/health

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Verify all services are running
3. Check browser console for errors
4. Ensure MetaMask is properly configured

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Hardhat node shows "Started HTTP and WebSocket JSON-RPC server"
2. ✅ Contract deployment shows "Deployment completed successfully"
3. ✅ Data population shows all ✅ marks
4. ✅ Frontend loads without errors
5. ✅ MetaMask connects successfully
6. ✅ Batch lookup shows real blockchain data

---

**🎯 The system is now fully functional with MetaMask integration, real blockchain data, and complete traceability features!** 