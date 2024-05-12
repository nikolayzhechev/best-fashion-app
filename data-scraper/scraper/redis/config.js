import { keys } from '../environment/keys.js';

export const DEFAULT_EXPIRATION = 3600;

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const redis = require('redis');

export const redisClient = redis.createClient({
   host: keys.redisHost,
   port: keys.redisPort
});

redisClient.on("error", (error) => console.error("Redis client error:", error));