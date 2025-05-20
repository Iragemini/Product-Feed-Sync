import { createClient } from "redis";
import config from '../../config/config.js';

const { redis: { client: { host, port } } } = config;

const redisClient = await createClient({
  url: `redis://${host}:${port}`
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default redisClient;
