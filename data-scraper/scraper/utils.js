import { urlPaths } from "./urlTestPaths.js";

export function urlData (siteName, type) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];
    // TODO: call handler function that resolves the class and returns the data to the scraper
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
        console.log("site name is unavailable")
    }
}
// get url from React app and call urlData to retreive the whole url data and return to scraper funciton
export function getUrl (siteName, type) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];

    if(site !== undefined){
        let [ key, queryType ] = Object.entries(site.queries).find(el => el.includes(type));

        console.log(`Scraping site: ${site.url + queryType}`);

        return site.url + queryType
    } else {
        console.log("no url available");
    }
}

export function getData ($, url) {
    let retreivedData = $("body");
    const singleItem = retreivedData.find("img").attr("src");
    const imgPath = getUrl("catsApi") + singleItem;

    return singleItem;
}