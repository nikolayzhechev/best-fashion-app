import { executeScrape } from "./executeScrape.js";
import { createRequire } from "module";
import * as globalConfig from "./config.js";
import siteEnums from "./enums.js";
import dbConfig from "./db/dbConfig.js";
import { redisClient, DEFAULT_EXPIRATION } from "./redis/config.js";
import { getCachedData } from "./redis/cachingFunction.js";

const require = createRequire(import.meta.url);
const retreivedItemsDbCollection = dbConfig.db
    .collection(dbConfig.allCollections.retreivedDataCollection);

let userData = {
    url: "",
    siteName: "",
    type: ""
}
let queryData = {
    url: "",
    currentSite: ""
}
// gets the current object for scraping from db
async function getCurrentObject (siteName, type, queryData){
    const uniqueKey = siteName + "currentObject";
    const cachedData = await getCachedData(uniqueKey);

    if (cachedData == null){
        if (siteName === null){
            siteName = queryData.currentSite;
        }
        let items = dbConfig.db.collection(dbConfig.allCollections.storesCollection)
            .find({ name: siteName });
        
        redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));

        for await (const doc of items){
            return doc;
        };
    } else {
        return cachedData;
    }
};
// gets links, urls inside the current object from db
async function getQueryList (siteName, type, queryData){
    const uniqueKey = siteName + "queryList";
    const cachedData = await getCachedData(uniqueKey);

    if (cachedData == null){
        if (siteName === null){
            siteName = queryData.currentSite;
        }
        let items = dbConfig.db.collection(dbConfig.allCollections.queryCollection)
            .find({ site: siteName });

        redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));
    
        for await (const doc of items){
            return doc;
        }
    } else {
        return cachedData;
    }

};

export async function getAllObjects (collection, siteName){
    let collectionToRetreive;
    let items;
    let dbInstance;

    const uniqueKey = collection + "allObjects";
    const cachedData = await getCachedData(uniqueKey);

    if (cachedData == null){
        for(let [collKey, collName] of Object.entries(dbConfig.allCollections)){
            if (collName == collection){
                collectionToRetreive = collName;
            }
        }
    
        if (collectionToRetreive !== undefined){
            dbInstance = dbConfig.db.collection(collectionToRetreive);
        }
    
        if (siteName === null || siteName === undefined){
            items = await dbInstance.find().toArray();
        } else {
            items = await dbInstance.find({ site: siteName }).toArray();
        }
    
        redisClient.setEx(uniqueKey, DEFAULT_EXPIRATION, JSON.stringify(items));
        return items;
    } else {
        return cachedData;
    }

};
// TODO: remove urlData func
export function urlData (siteName, type) {
    let site = getCurrentObject (siteName, type);
    
    if(site !== undefined){
        if (site.name === "zara" && type === "woman"){
            return site.url + site.queries.women;
        } else if (site.name === "zara" && type === "men") {
            return site.url + site.men;
        }
        
        if (type === "htmlCat"){
            return site.url + site.queries.htmlCat
        }
    } else {
        console.error("Site name is unavailable.")
    }
};
// gets current object url to scrape from db
export async function getUrl (siteName, type) {
    let site = await getCurrentObject (siteName, type);

    if(site !== undefined){
        let [ key, queryType ] = Object.entries(site.queries).find(el => el.includes(type));

        console.log(`Scraping site: ${site.url + queryType}`);
        return site.url + queryType
    } else {
        console.error(`utils.js: No url available.`);
        return undefined;
    }
};

export async function getData ($, siteName, type, queryData, browser, page) {
    let site = await getCurrentObject(siteName, type, queryData);
    let queries = await getQueryList(siteName, type, queryData);
    let items = [];
    let naviItems = [];
    let pagination = [];
    const currentTarget = site.target.metadata;

    const cachedLinkData = await getCachedData(queries.navi.parent);
    const cachedMainSiteData = await (getCachedData(site.target.class));
    
    if (cachedLinkData == null){
        // retreive links from site
        await $(queries.navi.parent).each(function () {
            let link, title;

            //if (cache == null){   // TODO: what is 'cache'?
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
            //}
        });
        redisClient.setEx(queries.navi.parent, DEFAULT_EXPIRATION, JSON.stringify(naviItems));
    }
    else {
        naviItems.push(JSON.parse(cachedLinkData));
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

        if (!url.includes("http")) {
            url = site.url + url;
        }

        if (!url.includes("javascript")) {
            pagination.push({url, text});
        }
    });

    if (cachedMainSiteData == null){
        // retreive main data from site
        await $(site.target.class).each(function (){
            let title, price, originalPrice, itemUrl, description;
            let img = [];
    
            waitForTarget(page, "img")
                .then(img.push($(this).find("img").attr("src")));
                    
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
                site: siteName        //TODO: add site name to write operation for later use
            }); 
        });
        redisClient.setEx(site.target.class, DEFAULT_EXPIRATION, JSON.stringify(items));
    } else {
        items.push(JSON.parse(cachedMainSiteData));
    }
    return { items, naviItems, pagination };
};
// sets main data for scraping
export function setData (data) {
    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
};
// sets links, urls from main page for scraping
export function setQueryData (data) {
    queryData.url = data.url;
    queryData.currentSite = data.currentSite;
};
// sends data to scraper func
export async function sendData () {
    const data = await executeScrape(userData.siteName, userData.type, null, false);
    return data;
};
// sends links, urls from main page to scraper func
export async function sendQueryData () {
    const data = await executeScrape(null, null, queryData, false);
    return data;
};
// sends data to scraper func - append to existing data
export async function sendDataAndAppend () {
    const data = await executeScrape(userData.siteName, userData.type, null, true)
};
// writes retreived data to db
export async function writeData (data) {
    if (globalConfig.globalWriteToDB){
        const itemsToInsert = [];
            
        for (const item of data) {
            const foundItem = await retreivedItemsDbCollection
                .findOne({ "itemUrl": item.itemUrl });

            if (foundItem === undefined || foundItem === null) {
                itemsToInsert.push(item);
                console.log(`Inserting item: ${item.itemUrl}`)
            }
        }

        if(itemsToInsert.length > 0){
            redisClient.setEx("StoreItem", DEFAULT_EXPIRATION, JSON.stringify(itemsToInsert));

            retreivedItemsDbCollection.insertMany(itemsToInsert)
                .then(res => {
                    console.log(`Information: docs inserted: ${res}`);
                })
                .catch(err => console.log(`Failed to insert docs.\n${err}`));
        } else {console.log(`globalWriteToDB: ${globalConfig.globalWriteToDB}`)}
        }
};

async function waitForTarget (page, target) {
    try {
        await page.waitForSelector(target, {visible: true}, {timeout: 3000})
    } catch (error) {
        // console.log(error); UPDATE
    }
};

export async function deleteRerteivedData (filter) {
    if (globalConfig.deleteRetreivedData){
        retreivedItemsDbCollection.deleteMany(filter);
        console.log(`Warning: data deleted: ${globalConfig.deleteRetreivedData}`);
    }
}