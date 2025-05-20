import ProductsStorage from './storage/productsStorage.js';
import ProductsDatabase from './database/productsDatabase.js';
import ProductsService from './service/product.js';
import redisClient from './storage/client.js';
import config from '../config/config.js';

const productsStorage = new ProductsStorage(redisClient);
const dbClient = new ProductsDatabase(config.db.postgres);
const productsService = new ProductsService({
    storage: productsStorage,
    dbClient,
}, config);

export {
    productsService,
    dbClient,
    redisClient,
};
