import { ethers } from 'ethers';


// Utility to load contract address and ABI from deployed-contract.json
async function loadContractConfig() {
  // Try all likely paths for dev and production
  const paths = [
    '/deployed-contract.json', // root of dev server or production build
    'deployed-contract.json', // relative to current URL
    '/AgroTrust/deployed-contract.json', // monorepo or subdir
    'AgroTrust/deployed-contract.json',
    '../deployed-contract.json',
    '../AgroTrust/deployed-contract.json',
  ];
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {}
  }
  throw new Error('Could not load deployed-contract.json. Please ensure the file is present in the frontend public directory. If you redeployed the contract, copy the latest deployed-contract.json from AgroTrust/ to frontend/public/.');
}

class MetaMaskService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string | null = null;
  private contractAbi: any = null;

  async connect(): Promise<boolean> {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect MetaMask.');
      }

      // Load contract config
      const config = await loadContractConfig();
      this.contractAddress = config.address;
      this.contractAbi = config.abi;

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Create contract instance
      if (!this.contractAddress || !this.contractAbi) {
        throw new Error('Contract address or ABI missing.');
      }
      this.contract = new ethers.Contract(this.contractAddress, this.contractAbi, this.signer);

      console.log('MetaMask connected successfully');
      console.log('Connected account:', await this.signer.getAddress());
      return true;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.provider || !this.signer) {
        return false;
      }
      
      const address = await this.signer.getAddress();
      return address !== null;
    } catch (error) {
      return false;
    }
  }

  async getAccount(): Promise<string | null> {
    try {
      if (!this.signer) {
        return null;
      }
      return await this.signer.getAddress();
    } catch (error) {
      return null;
    }
  }

  async getNetwork(): Promise<any> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      return await this.provider.getNetwork();
    } catch (error) {
      throw error;
    }
  }

  async checkBatchExists(batchId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      // Use a more direct approach - try to get the batch and check if it has data
      try {
        const batch = await this.contract.batches(batchId);
        // Check if the batch has meaningful data (not just default values)
        return batch.exists && batch.cropName !== '';
      } catch (error) {
        console.log('Error checking batch existence:', error);
        return false;
      }
    } catch (error) {
      console.error('Error in checkBatchExists:', error);
      return false;
    }
  }

  async getBatchInfo(batchId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      // Get batch data with error handling for each call
      let batch, farmer, cultivation, processing, labResult, certificate, traceData;
      
      try {
        batch = await this.contract.batches(batchId);
        if (!batch.exists || batch.cropName === '') {
          return null;
        }
      } catch (error) {
        console.log('Batch does not exist:', batchId);
        return null;
      }

      // Get other data with individual error handling
      try {
        farmer = await this.contract.farmerData(batchId);
      } catch (error) {
        console.log('Farmer data not found for batch:', batchId);
        farmer = { farmerName: '', farmLocation: '', contact: '', farmerId: '', exists: false };
      }

      try {
        cultivation = await this.contract.cultivationDetails(batchId);
      } catch (error) {
        console.log('Cultivation data not found for batch:', batchId);
        cultivation = { soilType: '', irrigationType: '', pesticideUsed: '', sowingDate: 0, area: 0, exists: false };
      }

      try {
        processing = await this.contract.processingInfo(batchId);
      } catch (error) {
        console.log('Processing data not found for batch:', batchId);
        processing = { processorName: '', method: '', processingDate: 0, processingUnitId: '', exists: false };
      }

      try {
        labResult = await this.contract.labResults(batchId);
      } catch (error) {
        console.log('Lab result not found for batch:', batchId);
        labResult = { labName: '', result: '', testDate: 0, reportHash: '', exists: false };
      }

      try {
        certificate = await this.contract.certificates(batchId);
      } catch (error) {
        console.log('Certificate not found for batch:', batchId);
        certificate = { issuedBy: '', certificateType: '', issueDate: 0, certificateId: '', exists: false };
      }

      try {
        traceData = await this.contract.traceRecords(batchId);
      } catch (error) {
        console.log('Trace data not found for batch:', batchId);
        traceData = { notes: '', qrCodeHash: '', exists: false };
      }

      // Get transfer records
      let transfers: any[] = [];
      try {
        const transferCount = await this.contract.getTransferRecordCount(batchId);
        for (let i = 0; i < transferCount; i++) {
          try {
            const transfer = await this.contract.transferLogs(batchId, i);
            transfers.push({
              from: transfer.from,
              to: transfer.to,
              purpose: transfer.purpose,
              transferDate: Number(transfer.transferDate)
            });
          } catch (error) {
            console.log(`Transfer record ${i} not found for batch:`, batchId);
          }
        }
      } catch (error) {
        console.log('Transfer records not found for batch:', batchId);
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
      throw error;
    }
  }

  async createBatch(batchId: string, cropName: string, variety: string, location: string, harvestDate: number): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.createBatch(batchId, cropName, variety, location, harvestDate);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  }

  async addFarmerInfo(batchId: string, farmerName: string, farmLocation: string, contact: string, farmerId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding farmer info:', error);
      throw error;
    }
  }

  async addCultivationDetails(batchId: string, soilType: string, irrigationType: string, pesticideUsed: string, sowingDate: number, area: number): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding cultivation details:', error);
      throw error;
    }
  }

  async addProcessingInfo(batchId: string, processorName: string, method: string, processingDate: number, processingUnitId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding processing info:', error);
      throw error;
    }
  }

  async addLabResult(batchId: string, labName: string, result: string, testDate: number, reportHash: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addLabResult(batchId, labName, result, testDate, reportHash);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding lab result:', error);
      throw error;
    }
  }

  async addCertificate(batchId: string, issuedBy: string, certificateType: string, issueDate: number, certificateId: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding certificate:', error);
      throw error;
    }
  }

  async addTransferRecord(batchId: string, from: string, to: string, purpose: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addTransferRecord(batchId, from, to, purpose);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding transfer record:', error);
      throw error;
    }
  }

  async addTraceData(batchId: string, notes: string, qrCodeHash: string): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      const tx = await this.contract.addTraceData(batchId, notes, qrCodeHash);
      const receipt = await tx.wait();
      
      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      console.error('Error adding trace data:', error);
      throw error;
    }
  }

  async testContractConnection(): Promise<any> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please connect MetaMask first.');
      }

      // Test basic contract functions
      const owner = await this.contract.owner();
      console.log('Contract owner:', owner);

      // Test if we can read a batch that might exist
      try {
        const testBatch = await this.contract.batches('ERD-TUR-2025-001');
        console.log('Test batch data:', testBatch);
        return {
          success: true,
          owner: owner,
          testBatch: testBatch
        };
      } catch (error) {
        console.log('No test batch found, but contract is accessible');
        return {
          success: true,
          owner: owner,
          testBatch: null
        };
      }
    } catch (error) {
      console.error('Contract connection test failed:', error);
      throw error;
    }
  }
}

export const metamaskService = new MetaMaskService();

// Add MetaMask types to window object
declare global {
  interface Window {
    ethereum?: any;
  }
} 