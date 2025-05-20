import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import { productsService, dbClient, redisClient } from './src/dependencies.js';
import { productsRouter } from './src/routes/product.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { NOT_FOUND } from './src/constants.js';

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await shutdown();
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await shutdown();
});

const {
  server: { port },
} = config;

const app = express();

app.use(cors());

app.use(express.json());

app.use('/products', productsRouter({ productsService }));

app.use((req, res, next) => {
  res.status(NOT_FOUND).json({ message: 'Route not found' });
  next();
});

app.use(errorHandler);

const server = app.listen(port, async () => {
  console.log(`Server is running at the port ${port}...`);

  try {
    await productsService.fetchFeed();
    console.log('Data successfully extracted and saved.');
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const shutdown = async () => {
  console.log('Shutting down gracefully...');

  server.close(async () => {
    try {
      await dbClient.close();
      console.log('Database connection closed');

      await redisClient.close();
      console.log('Redis connection closed');

      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
