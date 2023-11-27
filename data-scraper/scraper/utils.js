import { executeScrape } from "./executeScrape.js";
import { client } from "./db.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const siteEnums = {
    aboutYou: "aboutyou",
    zara: "zara",
    remixShop: "remixshop",
    fashionDays: "fashiondays"
}
let userData = {
    url: "",
    siteName: "",
    type: ""
}
const dbName = "BFA";
const storesCollection = "Stores";
const queryCollection = "Queries";

async function getCurrentObject (siteName, type){
    let items = client.db(dbName).collection(storesCollection)
        .find({ name: siteName });
    
    for await (const doc of items){
        return doc;
    }
};

async function getQueryList (siteName, type){
    let items = client.db(dbName).collection(queryCollection)
        .find({ site: siteName });

    for await (const doc of items){
        return doc;
    }
};

export async function getAllObjects (){
    let items = await client.db(dbName).collection(storesCollection)
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
    // create function to get title and links
export async function getData ($, siteName, type, page) {
    let site = await getCurrentObject(siteName, type);
    let queries = await getQueryList(siteName, type);
    let items = [];
    let naviItems = [];
    const currentTarget = site.target.metadata;

    await $(queries.navi.link).each(function () {   
        let link, title;

        link = $(this).attr("href");
        title = $(this).find(queries.navi.title).text();

        if (!link?.includes("http") || !link?.includes("https")){
            link = site.url + link;
        }

        naviItems.push({link, title});
    });

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
            description
        });
    });

    return { items, naviItems };
};

export function setData (data) {
    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
};

export async function sendData () {
    const data = await executeScrape(userData.siteName, userData.type, "dynamic");
    return data;
};

function getRandomData () {
    const randomObject = Math.floor(Math.random() * urlPaths.length);
};

async function waitForTarget (page, target) {
    try {
        await page.waitForSelector(target, {visible: true}, {timeout: 3000})
    } catch (error) {
        console.log(error);
    }
};