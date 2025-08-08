import express from 'express';
import { blockchainService } from '../services/blockchainService';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const blockchainStatus = await blockchainService.getBlockchainStatus();
    
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
  } catch (error) {
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

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const blockchainStatus = await blockchainService.getBlockchainStatus();
    
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
  } catch (error) {
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

export default router; 