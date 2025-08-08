import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();


import fs from 'fs';
import path from 'path';

// Utility to load contract address and ABI from deployed-contract.json
function loadContractConfig() {
  // Try both dev and prod paths
  const paths = [
    path.join(__dirname, '../../deployed-contract.json'),
    path.join(__dirname, '../../../AgroTrust/deployed-contract.json'),
  ];
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {}
  }
  throw new Error('Could not load deployed-contract.json');
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  public contract: any;
  private contractWithSigner: any;
  private isConnected: boolean = false;

  constructor() {
    try {
      // Initialize provider with proper error handling
      const blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://localhost:8545';
      this.provider = new ethers.JsonRpcProvider(blockchainUrl);
      
      // Initialize signer
      const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      this.signer = new ethers.Wallet(privateKey, this.provider);
      
      // Load contract config
      const config = loadContractConfig();
      this.contract = new ethers.Contract(config.address, config.abi, this.provider);
      this.contractWithSigner = this.contract.connect(this.signer);
      
      console.log('BlockchainService initialized successfully');
      console.log('Provider URL:', blockchainUrl);
      console.log('Contract Address:', config.address);
      console.log('Signer Address:', this.signer.address);
      
    } catch (error) {
      console.error('Error initializing BlockchainService:', error);
      throw new Error(`Failed to initialize blockchain service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test provider connection
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      // Test contract connection
      const owner = await this.contract.owner();
      
      this.isConnected = true;
      console.log('Blockchain connection test successful');
      console.log('Network:', network.name);
      console.log('Block Number:', blockNumber);
      console.log('Contract Owner:', owner);
      
      return true;
    } catch (error) {
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
        networkName: Number(network.chainId) === 31337 ? 'Hardhat Local' : network.name,
        chainId: Number(network.chainId),
        currentBlock: blockNumber,
        contractOwner: ownerAddress,
        contractAddress: await this.contract.getAddress(),
        signerAddress: signerAddress,
        isAuthorized: isAuthorized
      };
    } catch (error) {
      console.error("Blockchain connection error:", error);
      return {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBatchInfo(batchId: string) {
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
    } catch (error) {
      console.error('Error getting batch info:', error);
      throw new Error(`Failed to get batch info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Setter functions with proper error handling
  async createBatch(batchId: string, cropName: string, variety: string, location: string, harvestDate: number) {
    try {
      const tx = await this.contractWithSigner.createBatch(batchId, cropName, variety, location, harvestDate);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error creating batch:', error);
      throw new Error(`Failed to create batch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addFarmerInfo(batchId: string, farmerName: string, farmLocation: string, contact: string, farmerId: string) {
    try {
      const tx = await this.contractWithSigner.addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding farmer info:', error);
      throw new Error(`Failed to add farmer info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addCultivationDetails(batchId: string, soilType: string, irrigationType: string, pesticideUsed: string, sowingDate: number, area: number) {
    try {
      const tx = await this.contractWithSigner.addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding cultivation details:', error);
      throw new Error(`Failed to add cultivation details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addProcessingInfo(batchId: string, processorName: string, method: string, processingDate: number, processingUnitId: string) {
    try {
      const tx = await this.contractWithSigner.addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding processing info:', error);
      throw new Error(`Failed to add processing info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addLabResult(batchId: string, labName: string, result: string, testDate: number, reportHash: string) {
    try {
      const tx = await this.contractWithSigner.addLabResult(batchId, labName, result, testDate, reportHash);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding lab result:', error);
      throw new Error(`Failed to add lab result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addCertificate(batchId: string, issuedBy: string, certificateType: string, issueDate: number, certificateId: string) {
    try {
      const tx = await this.contractWithSigner.addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding certificate:', error);
      throw new Error(`Failed to add certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addTransferRecord(batchId: string, from: string, to: string, purpose: string) {
    try {
      const tx = await this.contractWithSigner.addTransferRecord(batchId, from, to, purpose);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding transfer record:', error);
      throw new Error(`Failed to add transfer record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addTraceData(batchId: string, notes: string, qrCodeHash: string) {
    try {
      const tx = await this.contractWithSigner.addTraceData(batchId, notes, qrCodeHash);
      const receipt = await tx.wait();
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding trace data:', error);
      throw new Error(`Failed to add trace data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const blockchainService = new BlockchainService(); 