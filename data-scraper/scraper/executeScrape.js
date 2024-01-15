import * as dataHandle from "./scraper.js";

export async function executeScrape (siteName, type, queryData, appendToExisting) {
    return await dataHandle.scrapeDynamicData(siteName, type, queryData, appendToExisting);
}