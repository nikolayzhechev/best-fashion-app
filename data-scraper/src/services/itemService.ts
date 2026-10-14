import { Db } from "mongodb";
import dbConfig from "../db/dbConfig.js";
import { redisClient, DEFAULT_EXPIRATION } from "../redis/config.js";
import { getCachedData, makeCacheKey } from "../redis/service.js";
import { IStores } from "../models/interfaces/IStores.js";
import { IQueries } from "../models/interfaces/IQueries.js";
import { IData } from "../models/interfaces/IData.js";
import { priceNormalization } from "../scrapers/normalizer.js";
import { IDbCollections } from "../models/interfaces/IDbCollections.js";

const db: Db = dbConfig.db;
const collections: IDbCollections = dbConfig.allCollections;
const dataCollection = db.collection(collections.data);

export async function getItems (siteName: string, gender?: string, category?: string): Promise<IData[] | null> {
    const filter: Partial<IData> = {site: siteName};

    if (gender) {
        filter.gender = gender;
    }

    if (category) {
        filter.category = category;
    }

    try {
        return await dataCollection.find<IData>(filter).toArray();
    } catch (err:any) {
        console.log(`Error while fetching items from db: ${err}`);
        return null;
    }
};

export async function getStore (siteName: string, type: string, queryData?: any): Promise<IStores | undefined> {
    const uniqueKey: string = makeCacheKey("Stores", siteName, type)
    const cachedData: IStores[] | null = await getCachedData(uniqueKey);

    if (cachedData === null){
        if (siteName === null){
            siteName = queryData.currentSite;
        }
        let items = await db.collection<IStores>(collections.stores)
            .find({ name: siteName }).toArray();
        
        await redisClient.set(uniqueKey, JSON.stringify(items));
        await redisClient.expire(uniqueKey, DEFAULT_EXPIRATION);

        for (const doc of items){
            return doc;
        };
    } else {
        return cachedData[0];
    }
};

export async function getQuery (siteName: string, type: string, queryData: any): Promise< IQueries | undefined> {
    const uniqueKey: string = makeCacheKey("Queries", siteName, type)
    const cachedData: IQueries[] | null = await getCachedData(uniqueKey);

    try {
        if (cachedData === null){
            if (siteName === null){
                siteName = queryData.currentSite;
            }
            let items = await db.collection<IQueries>(collections.queries)
                .find({ site: siteName }).toArray();
    
            await redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));
        
            for (const doc of items){
                return doc;
            }
        } else {
            return cachedData[0];
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

export async function getAllStores (collection: string, siteName?:string ): Promise<IStores[] | undefined> {
    let collectionToRetreive;
    let items: IStores[] | undefined = [];
    let dbInstance;

    const uniqueKey: string = makeCacheKey(collection, siteName ? siteName : "All", "Objects");
    const cachedData = await getCachedData(uniqueKey);

    try {
        if (cachedData === null){
            for(let [collKey, collName] of Object.entries(collections)){
                if (collName === collection){
                    collectionToRetreive = collName;
                }
            }
        
            if (collectionToRetreive !== undefined){
                dbInstance = dbConfig.db.collection<IStores>(collectionToRetreive);
            }
        
            if (siteName === null || siteName === undefined){
                items = await dbInstance?.find().toArray();
            } else {
                items = await dbInstance?.find({ site: siteName }).toArray();
            }
        
            await redisClient.set(uniqueKey, JSON.stringify(items));
            await redisClient.expire(uniqueKey, DEFAULT_EXPIRATION);

            return items;
        } else {
            return cachedData;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

export async function writeData (data: IData[] | undefined): Promise<void> {
    const itemsToInsert: IData[] = [];
        
    if (data) {
        for (const item of data) {
            const foundItem = await dataCollection
                .findOne({ "itemUrl": item.itemUrl });

            if (item.price) {
                item.price = priceNormalization(item.price);
            }

            if (!foundItem) {
                itemsToInsert.push(item);
                console.log(`Inserting item: ${item.itemUrl}`)
            }
        };

        if(itemsToInsert.length > 0){
            try {
                const res = await dataCollection.insertMany(itemsToInsert);
                console.log(`Docs inserted: ${res}`);    
            } catch (err: any) {
                console.log(`Failed to insert docs.\n${err}`);
            }
        }
    } else {
        console.log("Write to db: data is undefined.");
    };
};