"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainService = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONTRACT_ABI = [
    "function owner() public view returns (address)",
    "function batches(string) public view returns (string cropName, string variety, string location, uint256 harvestDate, bool exists)",
    "function farmerData(string) public view returns (string farmerName, string farmLocation, string contact, string farmerId, bool exists)",
    "function cultivationDetails(string) public view returns (string soilType, string irrigationType, string pesticideUsed, uint256 sowingDate, uint256 area, bool exists)",
    "function processingInfo(string) public view returns (string processorName, string method, uint256 processingDate, string processingUnitId, bool exists)",
    "function labResults(string) public view returns (string labName, string result, uint256 testDate, string reportHash, bool exists)",
    "function certificates(string) public view returns (string issuedBy, string certificateType, uint256 issueDate, string certificateId, bool exists)",
    "function transferLogs(string, uint256) public view returns (string from, string to, string purpose, uint256 transferDate)",
    "function traceRecords(string) public view returns (string notes, string qrCodeHash, bool exists)",
    "function checkBatchExists(string) public view returns (bool)",
    "function getTransferRecordCount(string) public view returns (uint256)",
    "function authorizedUsers(address) public view returns (bool)",
    "function createBatch(string _batchId, string _cropName, string _variety, string _location, uint256 _harvestDate)",
    "function addFarmerInfo(string _batchId, string _farmerName, string _farmLocation, string _contact, string _farmerId)",
    "function addCultivationDetails(string _batchId, string _soilType, string _irrigationType, string _pesticideUsed, uint256 _sowingDate, uint256 _area)",
    "function addProcessingInfo(string _batchId, string _processorName, string _method, uint256 _processingDate, string _processingUnitId)",
    "function addLabResult(string _batchId, string _labName, string _result, uint256 _testDate, string _reportHash)",
    "function addCertificate(string _batchId, string _issuedBy, string _certificateType, uint256 _issueDate, string _certificateId)",
    "function addTransferRecord(string _batchId, string _from, string _to, string _purpose)",
    "function addTraceData(string _batchId, string _notes, string _qrCodeHash)",
    "function authorizeUser(address _user)",
    "function revokeUser(address _user)"
];
class BlockchainService {
    constructor() {
        this.isConnected = false;
        try {
            const blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://localhost:8545';
            this.provider = new ethers_1.ethers.JsonRpcProvider(blockchainUrl);
            const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
            this.signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
            const contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            this.contract = new ethers_1.ethers.Contract(contractAddress, CONTRACT_ABI, this.provider);
            this.contractWithSigner = this.contract.connect(this.signer);
            console.log('BlockchainService initialized successfully');
            console.log('Provider URL:', blockchainUrl);
            console.log('Contract Address:', contractAddress);
            console.log('Signer Address:', this.signer.address);
        }
        catch (error) {
            console.error('Error initializing BlockchainService:', error);
            throw new Error(`Failed to initialize blockchain service: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async testConnection() {
        try {
            const network = await this.provider.getNetwork();
            const blockNumber = await this.provider.getBlockNumber();
            const owner = await this.contract.owner();
            this.isConnected = true;
            console.log('Blockchain connection test successful');
            console.log('Network:', network.name);
            console.log('Block Number:', blockNumber);
            console.log('Contract Owner:', owner);
            return true;
        }
        catch (error) {
            this.isConnected = false;
            console.error('Blockchain connection test failed:', error);
            return false;
        }
    }
    async getBlockchainStatus() {
        try {
            if (!this.isConnected) {
                const connected = await this.testConnection();
                if (!connected) {
                    throw new Error('Blockchain connection failed');
                }
            }
            const network = await this.provider.getNetwork();
            const blockNumber = await this.provider.getBlockNumber();
            const ownerAddress = await this.contract.owner();
            const signerAddress = await this.signer.getAddress();
            const isAuthorized = await this.contract.authorizedUsers(signerAddress);
            return {
                status: 'connected',
                networkName: network.name,
                chainId: Number(network.chainId),
                currentBlock: blockNumber,
                contractOwner: ownerAddress,
                contractAddress: await this.contract.getAddress(),
                signerAddress: signerAddress,
                isAuthorized: isAuthorized
            };
        }
        catch (error) {
            console.error("Blockchain connection error:", error);
            return {
                status: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async getBatchInfo(batchId) {
        try {
            if (!this.isConnected) {
                const connected = await this.testConnection();
                if (!connected) {
                    throw new Error('Blockchain not connected');
                }
            }
            const exists = await this.contract.checkBatchExists(batchId);
            if (!exists) {
                return null;
            }
            const batch = await this.contract.batches(batchId);
            const farmer = await this.contract.farmerData(batchId);
            const cultivation = await this.contract.cultivationDetails(batchId);
            const processing = await this.contract.processingInfo(batchId);
            const labResult = await this.contract.labResults(batchId);
            const certificate = await this.contract.certificates(batchId);
            const traceData = await this.contract.traceRecords(batchId);
            const transferCount = await this.contract.getTransferRecordCount(batchId);
            const transfers = [];
            for (let i = 0; i < transferCount; i++) {
                const transfer = await this.contract.transferLogs(batchId, i);
                transfers.push({
                    from: transfer.from,
                    to: transfer.to,
                    purpose: transfer.purpose,
                    transferDate: Number(transfer.transferDate)
                });
            }
            return {
                batchId,
                batch: {
                    cropName: batch.cropName,
                    variety: batch.variety,
                    location: batch.location,
                    harvestDate: Number(batch.harvestDate),
                    exists: batch.exists
                },
                farmer: {
                    farmerName: farmer.farmerName,
                    farmLocation: farmer.farmLocation,
                    contact: farmer.contact,
                    farmerId: farmer.farmerId,
                    exists: farmer.exists
                },
                cultivation: {
                    soilType: cultivation.soilType,
                    irrigationType: cultivation.irrigationType,
                    pesticideUsed: cultivation.pesticideUsed,
                    sowingDate: Number(cultivation.sowingDate),
                    area: Number(cultivation.area),
                    exists: cultivation.exists
                },
                processing: {
                    processorName: processing.processorName,
                    method: processing.method,
                    processingDate: Number(processing.processingDate),
                    processingUnitId: processing.processingUnitId,
                    exists: processing.exists
                },
                labResult: {
                    labName: labResult.labName,
                    result: labResult.result,
                    testDate: Number(labResult.testDate),
                    reportHash: labResult.reportHash,
                    exists: labResult.exists
                },
                certificate: {
                    issuedBy: certificate.issuedBy,
                    certificateType: certificate.certificateType,
                    issueDate: Number(certificate.issueDate),
                    certificateId: certificate.certificateId,
                    exists: certificate.exists
                },
                transfers,
                traceData: {
                    notes: traceData.notes,
                    qrCodeHash: traceData.qrCodeHash,
                    exists: traceData.exists
                }
            };
        }
        catch (error) {
            console.error('Error getting batch info:', error);
            throw new Error(`Failed to get batch info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createBatch(batchId, cropName, variety, location, harvestDate) {
        try {
            const tx = await this.contractWithSigner.createBatch(batchId, cropName, variety, location, harvestDate);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error creating batch:', error);
            throw new Error(`Failed to create batch: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId) {
        try {
            const tx = await this.contractWithSigner.addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding farmer info:', error);
            throw new Error(`Failed to add farmer info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area) {
        try {
            const tx = await this.contractWithSigner.addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding cultivation details:', error);
            throw new Error(`Failed to add cultivation details: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId) {
        try {
            const tx = await this.contractWithSigner.addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding processing info:', error);
            throw new Error(`Failed to add processing info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addLabResult(batchId, labName, result, testDate, reportHash) {
        try {
            const tx = await this.contractWithSigner.addLabResult(batchId, labName, result, testDate, reportHash);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding lab result:', error);
            throw new Error(`Failed to add lab result: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId) {
        try {
            const tx = await this.contractWithSigner.addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding certificate:', error);
            throw new Error(`Failed to add certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addTransferRecord(batchId, from, to, purpose) {
        try {
            const tx = await this.contractWithSigner.addTransferRecord(batchId, from, to, purpose);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding transfer record:', error);
            throw new Error(`Failed to add transfer record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addTraceData(batchId, notes, qrCodeHash) {
        try {
            const tx = await this.contractWithSigner.addTraceData(batchId, notes, qrCodeHash);
            const receipt = await tx.wait();
            return { success: true, transactionHash: receipt.hash };
        }
        catch (error) {
            console.error('Error adding trace data:', error);
            throw new Error(`Failed to add trace data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.blockchainService = new BlockchainService();
//# sourceMappingURL=blockchainService.js.map