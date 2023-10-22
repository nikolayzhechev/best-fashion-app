import * as dataHandle from "./scraper.js";

export async function executeScrape (siteName, type, executiontype) {
    if (executiontype === "dynamic") {
        return await dataHandle.scrapeDynamicData(siteName, type);
    } else if (executiontype === "static" ){
        return dataHandle.scrapeStaticData();
    }
    return null;
}