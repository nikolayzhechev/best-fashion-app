import { urlPaths } from "./urlTestPaths.js";

export function urlData (siteName, type) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];

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

export function getUrl (siteName) {
    let site = urlPaths.filter(el => el.name === siteName.toLowerCase())[0];

    if(site !== undefined){
        return site.url
    } else {
        console.log("no url available");
    }
}