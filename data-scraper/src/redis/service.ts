import { redisClient } from "./config";
import crypto from 'crypto';

export const getCachedData = async (redisKey: string): Promise<any[] | null> => {
    try {
        const data = await redisClient.get(redisKey);

        if (data !== null) {
            return JSON.parse(data);
        } else {
            return null;
        }
    } catch (error: any) {
        console.log(error);
        return null;
    }
};

export const makeCacheKey = (collection: string, siteName: string, type: string): string => {
    return `${collection}:${siteName}:${type}`;
};

export const makeHashCacheKey = (collection: string, siteName: string, type: string, query: object): any => {
    const normalized = JSON.stringify(sortObject(query));
    const hash = crypto.createHash('sha1').update(normalized).digest('hex');

    function sortObject(obj: any) {
        return Object.keys(obj).sort().reduce((o: any, k: any): object => {
            o[k] = obj[k];
            return o;
        }, {});
    }

    return `${collection}:${siteName}:${type}:${hash}`;
};