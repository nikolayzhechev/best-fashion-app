import * as globalConfig from "../config";
import * as scraper from "./scraper";
import siteEnums from "./enums";
import dbConfig from "../db/dbConfig";
import { redisClient, DEFAULT_EXPIRATION } from "../redis/config";
import { getCachedData, makeCacheKey } from "../redis/service";
import { IStores } from "@models/interfaces/IStores";
import { CheerioAPI } from "cheerio";
import { Browser, Page } from "puppeteer";
import { IQueries } from "@models/interfaces/IQueries.js";
import { IStoreTargetMetadata } from "@models/interfaces/IStoreTargetMetadata.js";
import { ISetDataDTO } from "@models/interfaces/DTOs/ISetDataDTO.js";
import { IData } from "@models/interfaces/IData.js";
import { INavi } from "@models/interfaces/INavi.js";

const retreivedItemsDbCollection = dbConfig.db
    .collection(dbConfig.allCollections.retreivedDataCollection);

let userData: ISetDataDTO = {
    url: "",
    siteName: "",
    type: "",
    currentSite: ""
}

let queryData: ISetDataDTO = {
    url: "",
    currentSite: ""
}

// gets the current object for scraping from db
async function getCurrentObject (siteName: string, type: string, queryData?: any): Promise<IStores | undefined> {
    const uniqueKey: string = makeCacheKey("Stores", siteName, type)
    const cachedData: IStores[] | null = await getCachedData(uniqueKey);

    if (cachedData === null){
        if (siteName === null){
            siteName = queryData.currentSite;
        }
        let items = await dbConfig.db.collection<IStores>(dbConfig.allCollections.storesCollection)
            .find({ name: siteName }).toArray();
        
        redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));

        for (const doc of items){
            return doc;
        };
    } else {
        // return JSON.parse(cachedData)[0];
        return cachedData[0];
    }
};

// gets links, urls inside the current object from db
async function getQueryList (siteName: string, type: string, queryData: any): Promise< IQueries | undefined> {
    const uniqueKey: string = makeCacheKey("Queries", siteName, type)
    const cachedData: IQueries[] | null = await getCachedData(uniqueKey);

    try {
        if (cachedData === null){
            if (siteName === null){
                siteName = queryData.currentSite;
            }
            let items = await dbConfig.db.collection<IQueries>(dbConfig.allCollections.queryCollection)
                .find({ site: siteName }).toArray();
    
            redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));
        
            for (const doc of items){
                return doc;
            }
        } else {
            // return JSON.parse(cachedData)[0];
            return cachedData[0];
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

export async function getAllObjects (collection: string, siteName?:string ): Promise<any> {
    let collectionToRetreive;
    let items;
    let dbInstance;

    const uniqueKey: string = collection + "allObjects";
    const cachedData = await getCachedData(uniqueKey);

    try {
        if (cachedData === null){
            for(let [collKey, collName] of Object.entries(dbConfig.allCollections)){
                if (collName === collection){
                    collectionToRetreive = collName;
                }
            }
        
            if (collectionToRetreive !== undefined){
                dbInstance = dbConfig.db.collection(collectionToRetreive);
            }
        
            if (siteName === null || siteName === undefined){
                items = await dbInstance?.find().toArray();
            } else {
                items = await dbInstance?.find({ site: siteName }).toArray();
            }
        
            redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));
            return items;
        } else {
            return cachedData;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

// gets current object url to scrape from db
export async function getUrl (siteName: string, type: string) {
    let site: IStores | undefined = await getCurrentObject(siteName, type);
    
    if(site !== undefined){
        let [ key, queryType ]: any = Object.entries(site.queries).find(el => el.includes(type));

        console.log(`Scraping site: ${site.url + queryType}`);
        return site.url + queryType
    } else {
        console.error(`utils.js: No url available.`);
        return undefined;
    }
};

export async function getData ($: CheerioAPI, siteName: string, type: string, page: Page, queryData?: any, browser?: Browser): Promise<any> {
    let items: IData[] = [];
    let naviItems: INavi[] = [];
    let pagination: any[] = [];

    let site: IStores | undefined = await getCurrentObject(siteName, type, queryData);
    let queries: IQueries | undefined = await getQueryList(siteName, type, queryData);

    if (site && queries) {
        const currentTarget: IStoreTargetMetadata = site.target.metadata;
        const cacheLinkKey: string = makeCacheKey("Queries", siteName, type);
        const cacheSiteDataKey: string = makeCacheKey("Stores", siteName, type);
        const cachedLinkData: INavi[] | null = await getCachedData(cacheLinkKey);
        const cachedMainSiteData: IData[] | null = await getCachedData(cacheSiteDataKey);

        if (cachedLinkData === null){
            // retreive links from site
            await $(queries.navi.parent).each(function () {
                let link: string | undefined = "";
                let title: string | undefined = "";
    
                switch (site.name) {
                    case siteEnums.fashionDays:
                        link = $(this).attr("href");
                        title = $(this).find(queries.navi.title).text();
                        break;
                    case siteEnums.remixShop:
                        link = $(this).attr("href");
                        title = $(this).text().trim();
                        break;
                    case siteEnums.zara:
                        link = $(this).find(queries.navi.link).attr("href");
                        title = $(this).find("span").text();
                        break;
                    case siteEnums.aboutYou:
                        link = $(this).attr("href");
                        title = $(this).find(queries.navi.title).text().trim();
                        break;
                }
    
                if (!link?.includes("http") || !link?.includes("https")){
                    link = site.url + link;
                }
    
                if (link !== null){
                    naviItems.push({link, title});
                }
            });
            redisClient.setEx(cacheLinkKey, DEFAULT_EXPIRATION, JSON.stringify(naviItems));
        }
        else {
            naviItems.push(...cachedLinkData); // JSON.parse()
        }

        // retreive pagination
        await $(site.pagination).find("li").each(function () {
            let url, text;
    
            switch (site.name) {
                case siteEnums.remixShop:
                    url = $(this).find("a").attr("href");
                    text = $(this).find("a").text();
                    break;
            }
    
            if (url?.includes("http")) {
                url = site.url + url;
            }
    
            if (url?.includes("javascript")) {
                pagination.push({url, text});
            }
        });

        if (cachedMainSiteData == null){
            // retreive main data from site
            await $(site.target.class).each(function (){
                let title: string | undefined = "";
                let price: string | undefined = "";
                let originalPrice: string | undefined = "";
                let itemUrl: string | undefined = "";
                let description: string | undefined = "";
                let img: any[] = [];
        
                waitForTarget(page, "img")
                    .then(() => img.push($(this).find("img").attr("src")));
                        
                switch (site.name) {
                    case siteEnums.aboutYou:
                        title = $(this).find(currentTarget.text.tag).text();
                        price = $(this).find(currentTarget.price.class).text();
                        originalPrice = $(this).find(currentTarget.price.oldPriceClass).text();
                        itemUrl = $(this).find("a").attr("href");
                        // multiple images - implement img collection and add carosel in front-end
                        img.push($(this).find("img").attr("srcset"));
                        break;
        
                    case siteEnums.zara:
                        title = $(this).find(currentTarget.text.class).text();
                        price = $(this).find(currentTarget.price.class).text();
                        itemUrl = $(this).find(currentTarget.link).attr("href");
                        //img.push($(this).find("img").not(function () {
                        //    return $(this)
                        //        .attr("src") === "https://static.zara.net/stdstatic/5.16.1/images/transparent-background.png";
                        //}).attr("src"));
                        break;
        
                    case siteEnums.remixShop:
                        title = $(this).find(currentTarget.text.class).attr("title");
                        price = $(this).find(currentTarget.price.class).text();
                        itemUrl = $(this).find(currentTarget.link).attr("href");
                        break;
        
                    case siteEnums.fashionDays:
                        title = $(this).find(currentTarget.text.class).text();
                        price = $(this).find(currentTarget.price.class).text();
                        itemUrl = $(this).attr("href");
                        description = $(this).find(currentTarget.text.description).text();
                        break;
                }
        
                if (!itemUrl?.includes("http") || !itemUrl?.includes("https")){
                    itemUrl = site.url + itemUrl;
                }
        
                items.push({
                    title,
                    price,
                    originalPrice,
                    itemUrl,
                    img,
                    description,
                    site: siteName
                }); 
            });
    
            redisClient.setEx(cacheSiteDataKey, DEFAULT_EXPIRATION, JSON.stringify(items));
        } else {
            items.push(...cachedMainSiteData); // JSON.parse()
        }

        return { items, naviItems, pagination };
    }

    return null;
};

// sets main data for scraping
export function setData (data: ISetDataDTO) {
    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
};

// sets links, urls from main page for scraping
export function setQueryData (data: ISetDataDTO) {
    queryData.url = data.url;
    queryData.currentSite = data.currentSite;
};

// sends data to scraper func
export async function sendData () {
    // const data = await executeScrape(userData.siteName, userData.type, null, false);
    return await scraper.scrapeDynamicData(userData.siteName, userData.type, false);
};

// sends links, urls from main page to scraper func
export async function sendQueryData () {
    // const data = await executeScrape(null, null, queryData, false);
    return await scraper.scrapeDynamicData(userData.siteName, userData.type, false, queryData);
};

// sends data to scraper func - append to existing data
export async function sendDataAndAppend () {
    // const data = await executeScrape(userData.siteName, userData.type, null, true)
    await scraper.scrapeDynamicData(userData.siteName, userData.type, true);
};

// writes retreived data to db
export async function writeData (data: IData[] | undefined): Promise<void> {
    if (globalConfig.globalWriteToDB){
        const itemsToInsert = [];
        
        if (data) {
            for (const item of data) {
                const foundItem = await retreivedItemsDbCollection
                    .findOne({ "itemUrl": item.itemUrl });
    
                if (foundItem === undefined || foundItem === null) {
                    itemsToInsert.push(item);
                    console.log(`Inserting item: ${item.itemUrl}`)
                }
            };
    
            if(itemsToInsert.length > 0){
                redisClient.setEx("StoreItem", DEFAULT_EXPIRATION, JSON.stringify(itemsToInsert));
    
                retreivedItemsDbCollection.insertMany(itemsToInsert)
                    .then((res: any) => {
                        console.log(`Information: docs inserted: ${res}`);
                    })
                    .catch((err: any) => console.log(`Failed to insert docs.\n${err}`));
            } else {
                console.log(`globalWriteToDB: ${globalConfig.globalWriteToDB}`);
            };
        } else {
            console.log("Write to db: data is undefined.")
        };
    }
};

async function waitForTarget (page: Page, target: string): Promise<void> {
    try {
        await page.waitForSelector(target, {visible: true, timeout: 3000})
    } catch (error: any) {
        console.log(error);
    }
};

export async function deleteRerteivedData (filter: any): Promise<void> {
    if (globalConfig.deleteRetreivedData){
        retreivedItemsDbCollection.deleteMany(filter);
        console.log(`Warning: data deleted: ${globalConfig.deleteRetreivedData}`);
    }
}