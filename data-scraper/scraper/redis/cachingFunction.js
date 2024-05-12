import { promisify } from 'util';
import { redisClient } from "./config.js";

//export const getCachedData = async (redisKey) => {
//    return await redisClient.get(redisKey, (error, data) => {
//        if (error) console.log(error);
//    
//        if (data != null){
//            return JSON.parse(data);
//        } else {
//            return null;
//        }
//    });
//};

const asyncGet = promisify(redisClient.get).bind(redisClient);

export const getCachedData = async (redisKey) => {
    try {
        const data = await asyncGet(redisKey);
        return data !== null ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error fetching cached data:', error);
        return null;
    }
};
