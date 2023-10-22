import { urlPaths } from "./urlTestPaths.js";
import { executeScrape } from "./executeScrape.js";

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

function getCurrentObject (siteName, type){
    let item = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];
    return item;
}

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
}

export function getUrl (siteName, type) {
    let site = getCurrentObject (siteName, type);

    if(site !== undefined){
        let [ key, queryType ] = Object.entries(site.queries).find(el => el.includes(type));

        console.log(`Scraping site: ${site.url + queryType}`);
        return site.url + queryType
    } else {
        console.error(`No url available;\n  utils.js at line 35.`);
        return undefined;
    }
}

export function getData ($, siteName, type) {
    let site = getCurrentObject (siteName, type);
    let items = [];
    const currentTarget = site.target.metadata;

    let item = $(site.target.class).each(function (){
        let title, price, originalPrice, itemUrl, img, description;

        switch (site.name) {
            case siteEnums.aboutYou:
                title = $(this).find(currentTarget.text.tag).text();
                price = $(this).find(currentTarget.price.class).text();
                originalPrice = $(this).find(currentTarget.price.oldPriceClass).text();
                itemUrl = $(this).find("a").attr("href");
                img = $(this).find(currentTarget.img?.refTag).attr("srcset");
                break;
            case siteEnums.zara:
                title = $(this).find(currentTarget.text.class).text();
                itemUrl = $(this).find(currentTarget.link).attr("href");
                img = $(this).find(currentTarget.img?.refTag).attr("src");
                break;
            case siteEnums.remixShop:
                title = $(this).find(currentTarget.text.class).attr("title");
                itemUrl = $(this).find(currentTarget.link).attr("href");
                img = $(this).find(currentTarget.img?.class).attr("src");
            case siteEnums.fashionDays:
                title = $(this).find(currentTarget.text.class).text();
                itemUrl = $(this).attr("href");
                img = $(this).find(currentTarget.img.class).attr("src");
                description = $(this).find(currentTarget.text.description).text();
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
        })
    });
    return items;
}

export function setData (data) {
    userData.url = data.url;
    userData.siteName = data.siteName;
    userData.type = data.type;
}

export async function sendData () {
    const data = await executeScrape(userData.siteName, userData.type, "dynamic");
    return data;
}

function getRandomData () {
    const randomObject = Math.floor(Math.random() * urlPaths.length);
}