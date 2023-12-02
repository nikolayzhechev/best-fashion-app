import * as dataHandle from "./scraper.js";

export async function executeScrape (siteName, type, queryData, executiontype) {
    if (executiontype === "dynamic") {
        return await dataHandle.scrapeDynamicData(siteName, type, queryData);
    } else if (executiontype === "static" ){
        return dataHandle.scrapeStaticData();
    }
    return null;
}