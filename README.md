# AgroTrust - Blockchain-based GI Product Verification System

## 🌾 Overview

AgroTrust is a blockchain-based system designed to verify the authenticity of Geographical Indication (GI) tagged agricultural products. This system provides end-to-end traceability for GI products from farm to consumer, ensuring transparency, authenticity, and trust in the agricultural supply chain.

## 🎯 Purpose

Geographical Indication (GI) tags are used to identify products that originate from a specific geographical location and possess qualities or reputation due to that origin. Examples include:
- **Erode Turmeric** (Tamil Nadu, India)
- **Darjeeling Tea** (West Bengal, India)
- **Basmati Rice** (India/Pakistan)
- **Champagne** (France)
- **Parmigiano Reggiano** (Italy)

AgroTrust addresses the challenges of:
- **Counterfeit GI products** in the market
- **Lack of transparency** in supply chains
- **Difficulty in verification** of product authenticity
- **Limited traceability** from farm to consumer

## 🏗️ Architecture

### Smart Contract Structure

The `AgroTrust` smart contract manages the following data structures:

1. **Batch Information** - Basic product details (crop, variety, location, harvest date)
2. **Farmer Information** - Details about the farmer and farm location
3. **Cultivation Details** - Agricultural practices, soil type, irrigation, pesticides
4. **Processing Information** - Post-harvest processing details
5. **Lab Results** - Quality testing and certification results
6. **Certificates** - GI certificates and compliance documents
7. **Transfer Records** - Complete ownership and location transfer history
8. **Trace Data** - QR codes and consumer-facing information

### Access Control

- **Owner**: Has full administrative privileges
- **Authorized Users**: Can add and modify data (farmers, processors, labs, etc.)
- **Public**: Can view all data for verification purposes

## 🚀 Features

### Core Functionality

- ✅ **Batch Creation**: Register new product batches with unique identifiers
- ✅ **Farmer Registration**: Record farmer and farm details
- ✅ **Cultivation Tracking**: Monitor agricultural practices and conditions
- ✅ **Processing Records**: Track post-harvest processing methods
- ✅ **Lab Testing**: Store quality test results and certifications
- ✅ **GI Certification**: Manage geographical indication certificates
- ✅ **Transfer History**: Complete audit trail of product movement
- ✅ **QR Code Integration**: Consumer-facing verification system
- ✅ **Access Control**: Role-based permissions for data management

### Security Features

- 🔒 **Immutable Records**: Once recorded, data cannot be altered
- 🔒 **Access Control**: Only authorized users can modify data
- 🔒 **Event Logging**: All changes are logged as blockchain events
- 🔒 **Batch Validation**: Prevents duplicate batch creation
- 🔒 **Existence Checks**: Ensures data integrity across operations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgroTrust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile contracts**
   ```bash
   npm run compile
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas
```

The test suite covers:
- Contract deployment and initialization
- Access control mechanisms
- Batch creation and management
- Data addition for all categories
- Transfer record tracking
- Complete workflow testing
- Error handling and edge cases

## 🚀 Deployment

### Local Development

1. **Start local blockchain**
   ```bash
   npm run node
   ```

2. **Deploy contract**
   ```bash
   # Using Hardhat script
   npm run deploy:local
   
   # Using Hardhat Ignition
   npm run deploy:ignition:local
   ```

### Production Deployment

1. **Configure networks** in `hardhat.config.ts`
2. **Set environment variables** for private keys and RPC URLs
3. **Deploy to target network**
   ```bash
   npm run deploy
   ```

## 💻 Usage

### Basic Workflow

1. **Create a Batch**
   ```solidity
   createBatch(batchId, cropName, variety, location, harvestDate)
   ```

2. **Add Farmer Information**
   ```solidity
   addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId)
   ```

3. **Record Cultivation Details**
   ```solidity
   addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area)
   ```

4. **Add Processing Information**
   ```solidity
   addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId)
   ```

5. **Store Lab Results**
   ```solidity
   addLabResult(batchId, labName, result, testDate, reportHash)
   ```

6. **Add GI Certificate**
   ```solidity
   addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId)
   ```

7. **Record Transfers**
   ```solidity
   addTransferRecord(batchId, from, to, purpose)
   ```

8. **Add Trace Data**
   ```solidity
   addTraceData(batchId, notes, qrCodeHash)
   ```

### Sample Interaction

Run the sample interaction script to see a complete workflow:

```bash
# Update the contract address in scripts/interact.ts first
npm run interact:local
```

This will demonstrate the complete lifecycle of an Erode Turmeric batch.

## 📊 Data Verification

### For Consumers

1. **Scan QR Code** on the product
2. **Enter Batch ID** on the verification portal
3. **View Complete Traceability Report** including:
   - Product origin and variety
   - Farmer and farm details
   - Cultivation practices
   - Processing methods
   - Lab test results
   - GI certification
   - Complete transfer history

### For Stakeholders

- **Farmers**: Verify their products are properly registered
- **Processors**: Track processing history and quality metrics
- **Retailers**: Ensure product authenticity before sale
- **Regulators**: Monitor compliance and certification status

## 🔧 Configuration

### Hardhat Configuration

The project uses Hardhat with the following features:
- **Solidity 0.8.20** with optimization enabled
- **TypeScript** support
- **Gas reporting** for optimization
- **Network configuration** for multiple environments

### Environment Variables

Create a `.env` file for sensitive data:
```env
PRIVATE_KEY=your_private_key_here
INFURA_URL=your_infura_url_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

## 📁 Project Structure

```
AgroTrust/
├── contracts/
│   └── AgroTrust.sol          # Main smart contract
├── scripts/
│   ├── deploy.ts              # Deployment script
│   └── interact.ts            # Sample interaction script
├── test/
│   └── AgroTrust.ts           # Comprehensive test suite
├── ignition/
│   └── modules/
│       └── AgroTrust.ts       # Hardhat Ignition deployment
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Mobile App**: Consumer-facing mobile application
- **IoT Integration**: Real-time sensor data from farms
- **AI/ML**: Predictive analytics for quality assessment
- **Multi-chain Support**: Integration with other blockchains
- **API Gateway**: RESTful API for external integrations
- **Dashboard**: Web-based management interface

## 📚 References

- [Geographical Indications in India](https://ipindia.gov.in/geographical-indications.htm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development](https://ethereum.org/developers/)

---

**Built with ❤️ for transparent and trustworthy agriculture**
