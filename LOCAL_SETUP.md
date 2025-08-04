# AgroTrust Local Setup Guide

## 🚀 Quick Start - Run AgroTrust Locally

This guide will walk you through setting up and running the AgroTrust blockchain system locally on your machine. No frontend or backend required - everything runs through the command line!

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 🛠️ Installation

### 1. Navigate to Project Directory
```bash
cd AgroTrust
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Compile Smart Contracts
```bash
npm run compile
```

## 🏃‍♂️ Running the System Locally

### Step 1: Start Local Blockchain Network

Open a **new terminal window** and run:
```bash
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
...
```

**Keep this terminal running!** This is your local blockchain network.

### Step 2: Deploy the Smart Contract

Open a **second terminal window** and run:
```bash
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

**Note the contract address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Step 3: Run the Complete Demo

In the same terminal, run:
```bash
npm run interact:local
```

**Expected Output:**
```
Interacting with AgroTrust contract...

1. Creating new batch...
✓ Batch created: TURMERIC2025_002

2. Adding farmer information...
✓ Farmer information added

3. Adding cultivation details...
✓ Cultivation details added

4. Adding processing information...
✓ Processing information added

5. Adding lab test results...
✓ Lab results added

6. Adding GI certificate...
✓ GI certificate added

7. Adding transfer records...
✓ Transfer records added

8. Adding trace data...
✓ Trace data added

9. Retrieving complete product information...

=== COMPLETE PRODUCT TRACEABILITY REPORT ===
Batch ID: TURMERIC2025_002
Crop: Turmeric - Erode Manjal
Location: Erode, Tamil Nadu
Harvest Date: [Current Date]

Farmer: Ravi Kumar
Farm Location: Bhavani, Erode District
Contact: +91-9876543210
Farmer ID: FARMER001

Cultivation Area: 15000 sq meters
Soil Type: Red Loamy Soil
Irrigation: Drip Irrigation
Pesticide: Organic Neem Spray

Processor: Erode Traditional Processing Unit
Method: Traditional Sun Drying
Processing Date: [Current Date]

Lab: Food Safety and Standards Authority of India
Result: Passed - Curcumin content: 5.2%, Moisture: 8.5%, All parameters within GI standards
Test Date: [Current Date]

Certificate: Erode Turmeric GI Certificate
Issued By: Geographical Indications Registry, Chennai
Certificate ID: GI_ERODE_TURMERIC_2025_001

Transfer History:
  1. Farmer Ravi Kumar → Erode Processing Unit (Harvest to Processing)
     Date: [Current Date]
  2. Erode Processing Unit → Chennai Distribution Center (Processing to Distribution)
     Date: [Current Date]

Trace Notes: Product ready for retail distribution. QR code generated for consumer verification.
QR Code Hash: QrCodeHash123456789abcdef

=== END OF REPORT ===

✓ All operations completed successfully!
```

## 🎯 What Just Happened?

### ✅ **Complete GI Product Lifecycle Tracked:**

1. **Batch Creation**: `TURMERIC2025_002` - Erode Turmeric from Tamil Nadu
2. **Farmer Information**: Ravi Kumar from Bhavani, Erode District
3. **Cultivation Details**: 15,000 sq meters, Red Loamy Soil, Drip Irrigation, Organic Neem
4. **Processing**: Traditional Sun Drying at Erode Processing Unit
5. **Lab Testing**: FSSAI certification with quality parameters
6. **GI Certificate**: Official GI certificate from Chennai Registry
7. **Transfer History**: Complete audit trail from farm to distribution
8. **Trace Data**: QR code for consumer verification

### 🔍 **Key Features Demonstrated:**

- **Immutable Records**: All data is permanently stored on the blockchain
- **Complete Traceability**: From farm to consumer
- **Quality Assurance**: Lab results and certifications
- **Transfer Tracking**: Every handoff recorded with timestamps
- **Consumer Verification**: QR code system for end-user verification

## 🛠️ Advanced Usage

### Interactive Console (Optional)

You can interact with the contract manually using the Hardhat console:

```bash
npx hardhat console --network localhost
```

**Example console commands:**
```javascript
// Get the contract
const AgroTrust = await ethers.getContractFactory("AgroTrust");
const agroTrust = AgroTrust.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

// Check if a batch exists
await agroTrust.checkBatchExists("TURMERIC2025_002");

// Get batch information
const batch = await agroTrust.getBatch("TURMERIC2025_002");
console.log(batch);

// Get farmer information
const farmer = await agroTrust.getFarmerInfo("TURMERIC2025_002");
console.log(farmer);
```

### Run Tests

To verify everything is working correctly:
```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas
```

### Create Multiple Batches

To create another batch, edit `scripts/interact.ts` and change the batch ID:
```typescript
const batchId = "DARJEELING2025_001"; // Change this
```

Then run:
```bash
npm run interact:local
```

## 🔧 Troubleshooting

### Common Issues

1. **"Batch already exists" error**
   - Solution: Change the batch ID in `scripts/interact.ts`

2. **"Cannot find module" errors**
   - Solution: Run `npm install` again

3. **Port 8545 already in use**
   - Solution: Kill any existing Hardhat processes or change the port

4. **BigInt conversion errors**
   - Solution: The script has been fixed to handle BigInt properly

### Reset Everything

To start fresh:
```bash
# Stop the Hardhat node (Ctrl+C)
# Clear cache
npm run clean

# Recompile
npm run compile

# Start over from Step 1
```

## 📊 Understanding the System

### What's Happening Behind the Scenes:

- **Smart Contract**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Blockchain**: Local Hardhat network with 20 test accounts
- **Gas Usage**: Each operation costs gas (free on local network)
- **Events**: All operations emit blockchain events for transparency

### Key Components:

1. **AgroTrust.sol**: Main smart contract with all business logic
2. **deploy.ts**: Script to deploy the contract
3. **interact.ts**: Script to demonstrate the complete workflow
4. **test/AgroTrust.ts**: Comprehensive test suite

### Data Flow:
```
1. Batch Creation → 2. Farmer Info → 3. Cultivation → 4. Processing
                                                    ↓
8. Trace Data ← 7. Transfer Records ← 6. Certificates ← 5. Lab Results
```

## 🚀 Next Steps

### Try These Experiments:

1. **Create another GI product** (Darjeeling Tea, Basmati Rice, etc.)
2. **Query existing data** using the contract functions
3. **Test access control** by trying operations with different accounts
4. **Deploy to testnet** (Sepolia) for real blockchain testing

### Production Deployment:

When ready for production:
1. Configure networks in `hardhat.config.ts`
2. Set up environment variables
3. Deploy to testnet: `npx hardhat run scripts/deploy.ts --network sepolia`
4. Deploy to mainnet: `npx hardhat run scripts/deploy.ts --network mainnet`

## 📞 Support

If you encounter any issues:
1. Check the error messages carefully
2. Ensure all prerequisites are installed
3. Try the troubleshooting steps above
4. Check the main README.md for more details

---

## 🎉 Congratulations!

You've successfully set up and run the AgroTrust blockchain system locally! The system demonstrates how blockchain technology can provide complete transparency and authenticity verification for Geographical Indication (GI) tagged agricultural products.

**Key Achievements:**
- ✅ Local blockchain network running
- ✅ Smart contract deployed and functional
- ✅ Complete GI product lifecycle tracked
- ✅ All data immutable and verifiable
- ✅ Ready for further development and testing

The system is now ready for you to explore, modify, and extend as needed! 🌾✨ 