# AgroTrust Local Setup Guide

## 🎯 Complete Setup Instructions

This guide will help you set up the entire AgroTrust system locally with MetaMask integration.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MetaMask** browser extension
- **Git** (for cloning the repository)

## 🚀 Step-by-Step Setup

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd AgroTrust
```

### Step 2: Install Dependencies

#### Smart Contract Dependencies
```bash
cd AgroTrust
npm install
```

#### Backend Dependencies
```bash
cd ../backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Start the Blockchain Network

Open a new terminal and run:
```bash
cd AgroTrust
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

**⚠️ Keep this terminal running!**


### Step 4: Deploy the Smart Contract

Open a **second terminal window** and run:
```bash
cd AgroTrust
npm run deploy:local
```

This will deploy the contract and automatically generate/update `deployed-contract.json` with the correct contract address and ABI. **All scripts, frontend, and backend now use this file as the single source of truth.**

**If you redeploy the contract, always use the latest `deployed-contract.json`!**

---

### Step 5: Populate Sample Data (Optional)

To add demo batches and data to the blockchain, run:
```bash
npm run populate
```

---

### Step 6: Start Backend API

Open a new terminal and run:
```bash
cd backend
npm start
```

---

### Step 7: Start Frontend

Open a new terminal and run:
```bash
cd frontend
npm run dev
```

---

## 🔗 How Contract Address & ABI Are Managed

- The file `AgroTrust/deployed-contract.json` is the **only** place the contract address and ABI are stored.
- The backend and frontend both read this file at runtime (no more hardcoded addresses or ABIs).
- If you redeploy the contract, this file will update automatically. **Restart the backend and frontend after redeploying!**

---

## 🛠️ Troubleshooting

- **MetaMask connection errors:** Make sure your MetaMask is on the correct local network (http://127.0.0.1:8545/).
- **Contract connection errors:** Ensure the blockchain node is running and `deployed-contract.json` is up to date.
- **Batch not found:** Run `npm run populate` to add sample data.

---

## 📝 Notes

- All contract interactions (frontend, backend, scripts) are now fully consistent and use the same contract instance.
- If you encounter any issues, check that all services are using the latest `deployed-contract.json`.
cd AgroTrust
npm run deploy:local
```

**Expected Output:**
```
Deploying AgroTrust contract...
AgroTrust deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Owner is authorized: true
Deployment completed successfully!
```

### Step 5: Populate Sample Data

In the same terminal, run:
```bash
npm run populate
```

**Expected Output:**
```
=== Adding Turmeric Data ===
✓ Batch created
✓ Farmer info added
✓ Cultivation details added
✓ Processing info added
✓ Lab result added
✓ Certificate added
✓ Transfer record added
✓ Trace data added

=== Adding Clove Data ===
✓ Batch created
✓ Farmer info added
✓ Cultivation details added
✓ Processing info added
✓ Lab result added
✓ Certificate added
✓ Transfer record added
✓ Trace data added

=== Data Population Complete ===
✓ Turmeric batch ID: ERD-TUR-2025-001
✓ Clove batch ID: KC-CLOVE-2025-001
```

### Step 6: Verify Data (Optional)

In the same terminal, run:
```bash
npm run verify
```

**Expected Output:**
```
=== Checking Erode Turmeric (Erode Manjal) ===
✓ Batch exists: true
✓ Crop: Turmeric
✓ Variety: Erode Manjal
✓ Location: Erode, Tamil Nadu
✅ Erode Turmeric (Erode Manjal) data is complete and accessible!

=== Checking Kanyakumari Clove ===
✓ Batch exists: true
✓ Crop: Clove
✓ Variety: Kanyakumari Clove
✓ Location: Kanyakumari, Tamil Nadu
✅ Kanyakumari Clove data is complete and accessible!
```

### Step 7: Configure MetaMask

1. **Install MetaMask** (if not already installed)
   - Go to https://metamask.io/
   - Install the browser extension

2. **Add Local Network**:
   - Open MetaMask
   - Click on the network dropdown (usually shows "Ethereum Mainnet")
   - Click "Add Network"
   - Fill in the details:
     - **Network Name**: `Hardhat Local`
     - **RPC URL**: `http://localhost:8545`
     - **Chain ID**: `31337`
     - **Currency Symbol**: `ETH`
   - Click "Save"

3. **Import Test Account**:
   - In MetaMask, click on the account icon
   - Click "Import Account"
   - Enter the private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"
   - This account will have 10,000 ETH for testing

### Step 8: Start the Backend (Optional)

Open a third terminal and run:
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 AgroTrust Backend Server running on port 3001
📊 Health check: http://localhost:3001/api/health
🔗 API Base URL: http://localhost:3001/api
```

### Step 9: Start the Frontend

Open a fourth terminal and run:
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🎯 Testing the System

### 1. Test MetaMask Connection

1. Go to http://localhost:3000
2. Click "Batch Lookup"
3. Click "Connect MetaMask"
4. Approve the connection in MetaMask
5. You should see "Connected" with your account address

### 2. Test Batch Lookup

1. In the Batch Lookup page, you'll see two available batches
2. Click on either batch or enter the batch ID manually:
   - `ERD-TUR-2025-001` for Erode Turmeric
   - `KC-CLOVE-2025-001` for Kanyakumari Clove
3. Click "Lookup Batch"
4. You should see complete blockchain data

### 3. Test Backend Health (Optional)

If you started the backend, visit:
- http://localhost:3001/api/health

**Expected Response:**
```json
{
  "status": "healthy",
  "services": {
    "api": "healthy",
    "blockchain": {
      "status": "connected",
      "networkName": "hardhat",
      "chainId": 31337
    }
  }
}
```

## 🔧 Troubleshooting

### Issue: "MetaMask is not installed"
**Solution**: Install MetaMask browser extension from https://metamask.io/

### Issue: "MetaMask connection failed"
**Solution**:
1. Check if MetaMask is unlocked
2. Verify you're on the correct network (Hardhat Local)
3. Ensure the account is imported with the correct private key

### Issue: "Batch not found"
**Solution**:
1. Ensure the Hardhat node is running
2. Run `npm run populate` to add the data
3. Run `npm run verify` to confirm data exists

### Issue: "Cannot connect to network"
**Solution**:
1. Check if Hardhat node is running on port 8545
2. Verify MetaMask network configuration
3. Ensure RPC URL is correct: `http://localhost:8545`

### Issue: "Transaction failed"
**Solution**:
1. Check if the account has ETH balance
2. Verify you're on the correct network
3. Check if the contract is deployed

### Issue: Frontend shows loading indefinitely
**Solution**:
1. Check browser console for errors
2. Verify MetaMask is connected
3. Ensure all dependencies are installed

## 📊 Expected Results

When everything is working correctly, you should see:

### MetaMask Connection
- ✅ MetaMask connects successfully
- ✅ Account address is displayed
- ✅ Network shows "Hardhat Local"

### Batch Lookup
- ✅ Available batches are displayed
- ✅ Clicking on batches shows complete data
- ✅ Manual batch ID entry works
- ✅ All data fields are populated

### Data Verification
- ✅ `npm run verify` shows all ✅ marks
- ✅ Backend health check shows "healthy"
- ✅ Frontend loads without errors

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ **Hardhat node** shows "Started HTTP and WebSocket JSON-RPC server"
2. ✅ **Contract deployment** shows "Deployment completed successfully"
3. ✅ **Data population** shows all ✅ marks
4. ✅ **MetaMask** connects to Hardhat Local network
5. ✅ **Frontend** loads at http://localhost:3000
6. ✅ **Batch lookup** shows real blockchain data
7. ✅ **Backend** (optional) shows healthy status

## 🚀 Next Steps

Once the system is running:

1. **Explore the Interface**: Try all the features
2. **Add New Batches**: Use the "Add Data" form
3. **Test QR Codes**: Generate and scan QR codes
4. **Monitor Transactions**: Check MetaMask for transaction history
5. **Explore API**: Use the backend endpoints for integration

## 📞 Getting Help

If you encounter issues:

1. **Check all terminals** are running the correct services
2. **Verify MetaMask configuration** is correct
3. **Check browser console** for error messages
4. **Ensure all ports** are available (3000, 3001, 8545)
5. **Verify Node.js version** is 16 or higher

---

**🎯 Your AgroTrust system is now fully operational with MetaMask integration and real blockchain data!** 