"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const blockchainService_1 = require("../services/blockchainService");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
});
const router = express_1.default.Router();
router.get('/test/connection', async (req, res, next) => {
    try {
        const status = await blockchainService_1.blockchainService.getBlockchainStatus();
        const testBatches = ['ERD-TUR-2025-001', 'KC-CLOVE-2025-001'];
        const batchResults = [];
        for (const batchId of testBatches) {
            try {
                const exists = await blockchainService_1.blockchainService.contract.checkBatchExists(batchId);
                batchResults.push({
                    batchId,
                    exists: exists
                });
            }
            catch (error) {
                batchResults.push({
                    batchId,
                    exists: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return res.json({
            success: true,
            data: {
                blockchainStatus: status,
                batchTests: batchResults
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/list/all', async (req, res, next) => {
    try {
        const knownBatches = [
            {
                batchId: 'ERD-TUR-2025-001',
                cropName: 'Turmeric',
                variety: 'Erode Manjal',
                location: 'Erode, Tamil Nadu',
                description: 'Premium quality turmeric with high curcumin content'
            },
            {
                batchId: 'KC-CLOVE-2025-001',
                cropName: 'Clove',
                variety: 'Kanyakumari Clove',
                location: 'Kanyakumari, Tamil Nadu',
                description: 'Premium clove with high eugenol content'
            }
        ];
        const verifiedBatches = [];
        for (const batch of knownBatches) {
            try {
                const exists = await blockchainService_1.blockchainService.contract.checkBatchExists(batch.batchId);
                if (exists) {
                    verifiedBatches.push(batch);
                }
            }
            catch (error) {
                console.error(`Error checking batch ${batch.batchId}:`, error);
            }
        }
        return res.json({
            success: true,
            data: {
                batches: verifiedBatches,
                total: verifiedBatches.length
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:batchId', async (req, res, next) => {
    try {
        const { batchId } = req.params;
        if (!batchId || batchId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Batch ID is required'
            });
        }
        const batchInfo = await blockchainService_1.blockchainService.getBatchInfo(batchId.trim());
        if (!batchInfo) {
            return res.status(404).json({
                success: false,
                error: 'Batch not found'
            });
        }
        return res.json({
            success: true,
            data: batchInfo
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:batchId/exists', async (req, res, next) => {
    try {
        const { batchId } = req.params;
        if (!batchId || batchId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Batch ID is required'
            });
        }
        const exists = await blockchainService_1.blockchainService.contract.checkBatchExists(batchId.trim());
        return res.json({
            success: true,
            data: {
                batchId: batchId.trim(),
                exists
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:batchId/summary', async (req, res, next) => {
    try {
        const { batchId } = req.params;
        if (!batchId || batchId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Batch ID is required'
            });
        }
        const exists = await blockchainService_1.blockchainService.contract.checkBatchExists(batchId.trim());
        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Batch not found'
            });
        }
        const batch = await blockchainService_1.blockchainService.contract.batches(batchId.trim());
        const farmer = await blockchainService_1.blockchainService.contract.farmerData(batchId.trim());
        return res.json({
            success: true,
            data: {
                batchId: batchId.trim(),
                crop: `${batch.cropName} - ${batch.variety}`,
                location: batch.location,
                harvestDate: Number(batch.harvestDate),
                farmer: farmer.farmerName,
                farmLocation: farmer.farmLocation
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:batchId/transfers', async (req, res, next) => {
    try {
        const { batchId } = req.params;
        if (!batchId || batchId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Batch ID is required'
            });
        }
        const exists = await blockchainService_1.blockchainService.contract.checkBatchExists(batchId.trim());
        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Batch not found'
            });
        }
        const transferCount = await blockchainService_1.blockchainService.contract.getTransferRecordCount(batchId.trim());
        const transfers = [];
        for (let i = 0; i < transferCount; i++) {
            const transfer = await blockchainService_1.blockchainService.contract.transferLogs(batchId.trim(), i);
            transfers.push({
                index: i,
                from: transfer.from,
                to: transfer.to,
                purpose: transfer.purpose,
                transferDate: Number(transfer.transferDate)
            });
        }
        return res.json({
            success: true,
            data: {
                batchId: batchId.trim(),
                transferCount: Number(transferCount),
                transfers
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-batch', async (req, res, next) => {
    try {
        const { batchId, cropName, variety, location, harvestDate } = req.body;
        if (!batchId || !cropName || !variety || !location || !harvestDate) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const harvestTimestamp = typeof harvestDate === 'string'
            ? Math.floor(new Date(harvestDate).getTime() / 1000)
            : harvestDate;
        const result = await blockchainService_1.blockchainService.createBatch(batchId.trim(), cropName.trim(), variety.trim(), location.trim(), harvestTimestamp);
        return res.json({
            success: true,
            message: 'Batch data added successfully to blockchain',
            data: {
                batchId,
                cropName,
                variety,
                location,
                harvestDate: harvestTimestamp,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-farmer', async (req, res, next) => {
    try {
        const { batchId, farmerName, farmLocation, contact, farmerId } = req.body;
        if (!batchId || !farmerName || !farmLocation || !contact || !farmerId) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const result = await blockchainService_1.blockchainService.addFarmerInfo(batchId.trim(), farmerName.trim(), farmLocation.trim(), contact.trim(), farmerId.trim());
        return res.json({
            success: true,
            message: 'Farmer data added successfully to blockchain',
            data: {
                batchId,
                farmerName,
                farmLocation,
                contact,
                farmerId,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-transfer', async (req, res, next) => {
    try {
        const { batchId, from, to, purpose, transferDate } = req.body;
        if (!batchId || !from || !to || !purpose || !transferDate) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const transferTimestamp = typeof transferDate === 'string'
            ? Math.floor(new Date(transferDate).getTime() / 1000)
            : transferDate;
        const result = await blockchainService_1.blockchainService.addTransferRecord(batchId.trim(), from.trim(), to.trim(), purpose.trim());
        return res.json({
            success: true,
            message: 'Transfer record added successfully to blockchain',
            data: {
                batchId,
                from,
                to,
                purpose,
                transferDate: transferTimestamp,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-cultivation', async (req, res, next) => {
    try {
        const { batchId, soilType, irrigationType, pesticideUsed, sowingDate, area } = req.body;
        if (!batchId || !soilType || !irrigationType || !pesticideUsed || !sowingDate || !area) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const sowingTimestamp = typeof sowingDate === 'string'
            ? Math.floor(new Date(sowingDate).getTime() / 1000)
            : sowingDate;
        const result = await blockchainService_1.blockchainService.addCultivationDetails(batchId.trim(), soilType.trim(), irrigationType.trim(), pesticideUsed.trim(), sowingTimestamp, Number(area));
        return res.json({
            success: true,
            message: 'Cultivation details added successfully to blockchain',
            data: {
                batchId,
                soilType,
                irrigationType,
                pesticideUsed,
                sowingDate: sowingTimestamp,
                area: Number(area),
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-processing', async (req, res, next) => {
    try {
        const { batchId, processorName, method, processingDate, processingUnitId } = req.body;
        if (!batchId || !processorName || !method || !processingDate || !processingUnitId) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const processingTimestamp = typeof processingDate === 'string'
            ? Math.floor(new Date(processingDate).getTime() / 1000)
            : processingDate;
        const result = await blockchainService_1.blockchainService.addProcessingInfo(batchId.trim(), processorName.trim(), method.trim(), processingTimestamp, processingUnitId.trim());
        return res.json({
            success: true,
            message: 'Processing info added successfully to blockchain',
            data: {
                batchId,
                processorName,
                method,
                processingDate: processingTimestamp,
                processingUnitId,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-lab-result', async (req, res, next) => {
    try {
        const { batchId, labName, result, testDate, reportHash } = req.body;
        if (!batchId || !labName || !result || !testDate || !reportHash) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const testTimestamp = typeof testDate === 'string'
            ? Math.floor(new Date(testDate).getTime() / 1000)
            : testDate;
        const resultData = await blockchainService_1.blockchainService.addLabResult(batchId.trim(), labName.trim(), result.trim(), testTimestamp, reportHash.trim());
        return res.json({
            success: true,
            message: 'Lab result added successfully to blockchain',
            data: {
                batchId,
                labName,
                result,
                testDate: testTimestamp,
                reportHash,
                transactionHash: resultData.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-certificate', async (req, res, next) => {
    try {
        const { batchId, issuedBy, certificateType, issueDate, certificateId } = req.body;
        if (!batchId || !issuedBy || !certificateType || !issueDate || !certificateId) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const issueTimestamp = typeof issueDate === 'string'
            ? Math.floor(new Date(issueDate).getTime() / 1000)
            : issueDate;
        const result = await blockchainService_1.blockchainService.addCertificate(batchId.trim(), issuedBy.trim(), certificateType.trim(), issueTimestamp, certificateId.trim());
        return res.json({
            success: true,
            message: 'Certificate added successfully to blockchain',
            data: {
                batchId,
                issuedBy,
                certificateType,
                issueDate: issueTimestamp,
                certificateId,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/add-trace-data', async (req, res, next) => {
    try {
        const { batchId, notes, qrCodeHash } = req.body;
        if (!batchId || !notes || !qrCodeHash) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const result = await blockchainService_1.blockchainService.addTraceData(batchId.trim(), notes.trim(), qrCodeHash.trim());
        return res.json({
            success: true,
            message: 'Trace data added successfully to blockchain',
            data: {
                batchId,
                notes,
                qrCodeHash,
                transactionHash: result.transactionHash
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/upload-csv', upload.single('csvFile'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No CSV file uploaded'
            });
        }
        const csvContent = req.file.buffer.toString('utf-8');
        const lines = csvContent.split('\n').filter((line) => line.trim());
        if (lines.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'CSV file must contain at least a header and one data row'
            });
        }
        const headers = lines[0].split(',').map((h) => h.trim());
        const requiredHeaders = ['batchId', 'cropName', 'variety', 'location', 'harvestDate'];
        for (const header of requiredHeaders) {
            if (!headers.includes(header)) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required column: ${header}`
                });
            }
        }
        const results = [];
        const errors = [];
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = lines[i].split(',').map((v) => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                const harvestTimestamp = Math.floor(new Date(row.harvestDate).getTime() / 1000);
                const result = await blockchainService_1.blockchainService.createBatch(row.batchId, row.cropName, row.variety, row.location, harvestTimestamp);
                results.push({
                    batchId: row.batchId,
                    success: true,
                    transactionHash: result.transactionHash
                });
            }
            catch (error) {
                errors.push({
                    row: i + 1,
                    batchId: lines[i].split(',')[0] || 'Unknown',
                    error: error.message
                });
            }
        }
        return res.json({
            success: true,
            message: `CSV upload completed. ${results.length} batches added successfully.`,
            data: {
                totalRows: lines.length - 1,
                successful: results.length,
                failed: errors.length,
                results,
                errors
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        return res.json({
            success: true,
            data: {
                batches: [
                    { batchId: 'Clove_001', cropName: 'clove', variety: 'Erode Manjal' },
                    { batchId: 'TURMERIC2025_002', cropName: 'Turmeric', variety: 'Erode Manjal' },
                    { batchId: 'DARJEELING2025_001', cropName: 'Tea', variety: 'Darjeeling Black' }
                ],
                total: 3
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
//# sourceMappingURL=batchRoutes.js.map