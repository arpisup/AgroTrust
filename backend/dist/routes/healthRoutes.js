"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blockchainService_1 = require("../services/blockchainService");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const blockchainStatus = await blockchainService_1.blockchainService.getBlockchainStatus();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            services: {
                api: 'healthy',
                blockchain: blockchainStatus
            }
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Blockchain connection failed',
            services: {
                api: 'healthy',
                blockchain: 'unhealthy'
            }
        });
    }
});
router.get('/detailed', async (req, res) => {
    try {
        const blockchainStatus = await blockchainService_1.blockchainService.getBlockchainStatus();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            services: {
                api: {
                    status: 'healthy',
                    port: process.env.PORT || 3001
                },
                blockchain: blockchainStatus
            }
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Blockchain connection failed',
            services: {
                api: {
                    status: 'healthy',
                    port: process.env.PORT || 3001
                },
                blockchain: {
                    status: 'unhealthy',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map