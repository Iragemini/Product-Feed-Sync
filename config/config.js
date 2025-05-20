import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);

export default {
  server: {
    port: isNaN(PORT) ? 4000 : PORT,
  },
  feedUrl: 'https://cevoid-dev-storage.b-cdn.net/cevoid-product-feed.xml',
  redis: {
    client: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || '127.0.0.1',
    },
  },
  db: {
    postgres: {
      port: isNaN(DB_PORT) ? 5432 : DB_PORT,
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'feed',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
  },
};
