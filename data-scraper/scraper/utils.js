import { executeScrape } from "./executeScrape.js";
import { createRequire } from "module";
import * as globalConfig from "./config.js";
import siteEnums from "./enums.js";
import dbConfig from "./db/dbConfig.js";

const require = createRequire(import.meta.url);
const retreivedItemsDbCollection = dbConfig.db.collection(dbConfig.retreivedDataCollection);

let userData = {
    url: "",
    siteName: "",
    type: ""
}
let queryData = {
    url: "",
    currentSite: ""
}

async function getCurrentObject (siteName, type, queryData){
    if (siteName === null){
        siteName = queryData.currentSite;
    }
    let items = dbConfig.db.collection(dbConfig.storesCollection)
        .find({ name: siteName });
    
    for await (const doc of items){
        return doc;
    }
};

async function getQueryList (siteName, type, queryData){
    if (siteName === null){
        siteName = queryData.currentSite;
    }
    let items = dbConfig.db.collection(dbConfig.queryCollection)
        .find({ site: siteName });

    for await (const doc of items){
        return doc;
    }
};

export async function getAllObjects (){
    let items = await dbConfig.db.collection(dbConfig.storesCollection)
        .find().toArray();

    return items;
};

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

export async function getUrl (siteName, type) {
    let site = await getCurrentObject (siteName, type);

    if(site !== undefined){
        let [ key, queryType ] = Object.entries(site.queries).find(el => el.includes(type));

        console.log(`Scraping site: ${site.url + queryType}`);
        return site.url + queryType
    } else {
        console.error(`No url available;\n  utils.js at line 35.`);
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

    // retreive links from site
    await $(queries.navi.parent).each(function () {   
        let link, title;

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

    return { items, naviItems, pagination };
};

export function setData (data) {
    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
};

export function setQueryData (data) {
    queryData.url = data.queryLink;
    queryData.currentSite = data.thisSite;
};

export async function sendData () {
    const data = await executeScrape(userData.siteName, userData.type, null, "dynamic");
    return data;
};

export async function sendQueryData () {
    const data = await executeScrape(null, null, queryData, "dynamic");
    return data;
};

export async function writeData (data) {
    if (globalConfig.globalWriteToDB){
        let searchedItems = [];
    
        data.forEach(item => {
            // TODO: update find existing item operation
            searchedItems.push(retreivedItemsDbCollection.find({ itemUrl: item.itemUrl }));
        });

        data = data.filter(el => !searchedItems.includes(el));

        retreivedItemsDbCollection.insertMany(data)
            .then(res => {
                console.log(`Information: doc inserted: ${res._id}`);
            })
            .catch(err => console.log(`Failed to insert doc: ${res.itemUrl}\n${err}`));
    } else {console.log(`globalWriteToDB: ${globalConfig.globalWriteToDB}`)}
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