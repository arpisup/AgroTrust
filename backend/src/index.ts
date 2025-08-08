import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import batchRoutes from './routes/batchRoutes';
import healthRoutes from './routes/healthRoutes';
import { blockchainService } from './services/blockchainService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const blockchainStatus = await blockchainService.getBlockchainStatus();
    
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
  } catch (error) {
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

// Test blockchain connection endpoint
app.get('/api/test/blockchain', async (req, res) => {
  try {
    const isConnected = await blockchainService.testConnection();
    res.json({
      success: true,
      connected: isConnected,
      message: isConnected ? 'Blockchain connection successful' : 'Blockchain connection failed'
    });
  } catch (error) {
    console.error('Blockchain test error:', error);
    res.status(500).json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API routes
app.use('/api/batches', batchRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AgroTrust GI Product Verification API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/health'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgroTrust Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

export default app; 