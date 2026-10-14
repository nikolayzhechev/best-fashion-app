import { IStores } from "../models/interfaces/IStores.js";
import { IQueries } from "../models/interfaces/IQueries.js";
import dbConfig from "../db/dbConfig.js";
import { IDbCollections } from "../models/interfaces/IDbCollections.js";
import { Db } from "mongodb";
import { IData } from "../models/interfaces/IData.js";

const db: Db = dbConfig.db;
const collections: IDbCollections = dbConfig.allCollections;

export async function getStore (siteName: string): Promise<IStores | null> {
    try {
        return await db.collection<IStores>(collections.stores).findOne({ name: siteName });
    } catch (err: any) {
        console.log(`Error while fetching store from db: ${err}`);
        return null;
    }
};

export async function getCategories (siteName: string): Promise<IQueries | null> {
    try {
        return await db.collection<IQueries>(collections.queries).findOne({ site: siteName });
    } catch (err:any) {
        console.log(`Error while fetching categories from db: ${err}`);
        return null;
    }
};

export async function saveData (siteName: string, data: IData[]): Promise<void> {
    try {
        const inserted: number = (await db.collection<IData>(collections.data).insertMany(data)).insertedCount;
        console.log(`Inserted count to db: ${inserted}.`)
    } catch (err: any) {
        console.log(`0 docs were inserted to db: ${err}`);
    }
};