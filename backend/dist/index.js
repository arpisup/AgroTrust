"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const batchRoutes_1 = __importDefault(require("./routes/batchRoutes"));
const blockchainService_1 = require("./services/blockchainService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use((0, morgan_1.default)('combined'));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});
app.get('/api/health', async (req, res) => {
    try {
        const blockchainStatus = await blockchainService_1.blockchainService.getBlockchainStatus();
        const isHealthy = blockchainStatus.status === 'connected';
        res.json({
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                api: 'healthy',
                blockchain: blockchainStatus
            },
            ...(isHealthy ? {} : { error: 'Blockchain connection failed' })
        });
    }
    catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            services: {
                api: 'unhealthy',
                blockchain: {
                    status: 'unknown',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            }
        });
    }
});
app.get('/api/test/blockchain', async (req, res) => {
    try {
        const isConnected = await blockchainService_1.blockchainService.testConnection();
        res.json({
            success: true,
            connected: isConnected,
            message: isConnected ? 'Blockchain connection successful' : 'Blockchain connection failed'
        });
    }
    catch (error) {
        console.error('Blockchain test error:', error);
        res.status(500).json({
            success: false,
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.use('/api/batches', batchRoutes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'AgroTrust GI Product Verification API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api/health'
    });
});
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 AgroTrust Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map