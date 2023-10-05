import { urlPaths } from "./urlTestPaths.js";

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
        console.error(`No url available for: ${site.url + queryType}\n  utils.js at line 35.`);
        return undefined;
    }
}

export function getData ($, siteName, type) {
    let site = getCurrentObject (siteName, type);
    let items = [];

    let item = $(site.target.class).each(function (){
        let title;
        let itemUrl;
        let img;

        if (typeof site.target.metadata.text === 'object'){
            title = $(this).find(site.target.metadata.text.tag).text();
        } else {
            title = $(this).find(site.target.metadata.text).text();
        }

        itemUrl = $(this).find("a").attr("href");

        if (!itemUrl.includes("http")){
            itemUrl = site.url + itemUrl;
        }
        // TODO: returns undefined on Zara store - check class and parent
        img = $(this).find(site.target.metadata.img?.refTag).attr("srcset");

        if (img === null || img === undefined){
            img = $(this).find(site.target.metadata.img?.class).attr("src");
        }

        items.push({
            title,
            itemUrl,
            img
        })
    });
    return items;
}