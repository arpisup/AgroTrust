declare class BlockchainService {
    private provider;
    private signer;
    contract: any;
    private contractWithSigner;
    private isConnected;
    constructor();
    testConnection(): Promise<boolean>;
    getBlockchainStatus(): Promise<{
        status: string;
        networkName: string;
        chainId: number;
        currentBlock: number;
        contractOwner: any;
        contractAddress: any;
        signerAddress: string;
        isAuthorized: any;
        error?: undefined;
    } | {
        status: string;
        error: string;
        networkName?: undefined;
        chainId?: undefined;
        currentBlock?: undefined;
        contractOwner?: undefined;
        contractAddress?: undefined;
        signerAddress?: undefined;
        isAuthorized?: undefined;
    }>;
    getBatchInfo(batchId: string): Promise<{
        batchId: string;
        batch: {
            cropName: any;
            variety: any;
            location: any;
            harvestDate: number;
            exists: any;
        };
        farmer: {
            farmerName: any;
            farmLocation: any;
            contact: any;
            farmerId: any;
            exists: any;
        };
        cultivation: {
            soilType: any;
            irrigationType: any;
            pesticideUsed: any;
            sowingDate: number;
            area: number;
            exists: any;
        };
        processing: {
            processorName: any;
            method: any;
            processingDate: number;
            processingUnitId: any;
            exists: any;
        };
        labResult: {
            labName: any;
            result: any;
            testDate: number;
            reportHash: any;
            exists: any;
        };
        certificate: {
            issuedBy: any;
            certificateType: any;
            issueDate: number;
            certificateId: any;
            exists: any;
        };
        transfers: {
            from: any;
            to: any;
            purpose: any;
            transferDate: number;
        }[];
        traceData: {
            notes: any;
            qrCodeHash: any;
            exists: any;
        };
    } | null>;
    createBatch(batchId: string, cropName: string, variety: string, location: string, harvestDate: number): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addFarmerInfo(batchId: string, farmerName: string, farmLocation: string, contact: string, farmerId: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addCultivationDetails(batchId: string, soilType: string, irrigationType: string, pesticideUsed: string, sowingDate: number, area: number): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addProcessingInfo(batchId: string, processorName: string, method: string, processingDate: number, processingUnitId: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addLabResult(batchId: string, labName: string, result: string, testDate: number, reportHash: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addCertificate(batchId: string, issuedBy: string, certificateType: string, issueDate: number, certificateId: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addTransferRecord(batchId: string, from: string, to: string, purpose: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
    addTraceData(batchId: string, notes: string, qrCodeHash: string): Promise<{
        success: boolean;
        transactionHash: any;
    }>;
}
export declare const blockchainService: BlockchainService;
export {};
//# sourceMappingURL=blockchainService.d.ts.map