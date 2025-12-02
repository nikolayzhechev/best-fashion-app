import { keys } from '../environment/keys';

import redis, { RedisClientType, createClient } from 'redis';
export const DEFAULT_EXPIRATION = 3600;

export const redisClient: RedisClientType = createClient({
   socket: {
      host: keys.redisHost,
      port: keys.redisPort,
      // disableOfflineQueue: true
   }
});

redisClient.on("error", (error: any) => console.error("Redis client error:", error));
redisClient.on("connect", () => console.log("Redis client connected."));
redisClient.on("ready", () => console.log('Redis client ready to use.'));
redisClient.on("end", () => console.log('Redis client disconnected.'));

async function verifyConnection(): Promise<void> {
   if (!redisClient.isOpen) {
      try {
         await redisClient.connect();
      } catch (error: any) {
         console.log(error.error)
      }
   }
};

(async (): Promise<void> => {
   await verifyConnection();
})();