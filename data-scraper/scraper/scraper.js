import { getUrl, getData, getAllObjects } from "./utils.js";
import { createRequire } from "module";
import { proxyList } from "./proxyList.js";

const require = createRequire(import.meta.url);
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

let itemsData = [];
let naviData = [];
let pagesData = [];

// get random proxy server from list
function getRandomProxy(){
    let randomServerIndex = Math.floor(Math.random() * proxyList.length);
    const serverObject = proxyList[randomServerIndex];

    const proxyData = {
        proxyServer: serverObject.host + ":" +serverObject.port,
        proxyProtocol: serverObject.protocol
    }

    for(let key in proxyData){
        console.log(`Proxy data: ${key}: ${proxyData[key]}`);
    }

    return proxyData;
}

export async function scrapeDynamicData(siteName, type, queryData, appendToExisting) {
    console.log(`Scrape execution properties: siteName: ${siteName}, type: ${type}, queryData: ${queryData}, appendToExisting?: ${appendToExisting}`)
    let url;
    
    if (queryData === null){
        url = await getUrl(siteName, type);
    } else {
        url = queryData.url;
    }

    if(url === undefined){
        return;
    }

    if (appendToExisting){
        itemsData = getAllObjects("RetreivedData", siteName);     // get written data from db
    }

    let proxyData = getRandomProxy();

    const browser = await puppeteer.launch(
        {
            headless: true,
            args: [
            `--proxy-server=${proxyData.proxyProtocol}=${proxyData.proxyServer}`,
            // `--proxy-server=https=`,  "--no-sandbox", "--ignore-certificate-errors", "--ignore-certificate-errors-spki-list" ,
            ]
        }
    );
    
    const page = await browser.newPage();
    let config = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    try {
        await page.setUserAgent(config);
        await page.goto(url, { timeout: 18000 });
        
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        
        let allItems = await getData($, siteName, type, queryData, browser, page);
        let itemsArray = allItems.items;
        let naviItemsArray = allItems.naviItems;
        let paginationArray = allItems.pagination;

        if(itemsArray.length === 0){
            console.error(`scraper.js: Items collection is empty. No data has been scraped.`);
            return;
        }

        if (appendToExisting){
            itemsData.push(...itemsArray);      // add new data to existing           
        } else {
            itemsData = Array.from(itemsArray);
            naviData = Array.from(naviItemsArray);
            pagesData = Array.from(paginationArray);
        }

        if (appendToExisting){
            const targetCount = 100;
            const scrapedInfiniteData = await scrapeInfiniteScrollPage(page, itemsData, targetCount);
        }

     } catch (error) {
        console.log(error);
     } finally {
        await closeBrowser(browser);
     }

    return { itemsData, naviData, pagesData };
};

// scrapes infinite scrolling pages
async function scrapeInfiniteScrollPage (page, itemsData, targetCount) {
    let itemsCount = 0;
    // TODO: detect scroll behaviour in front-end and call this
    // function once user scrolles to the bottom
    try {
        while (itemsCount < targetCount){
        }
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(1000);
        // TODO: is itemData filtered with relevant data?
        itemsCount = itemsData.length;

    } catch (error) {
        console.log(error);
    }
};

export async function clearData () {
    data.length = 0;
    return data;
}

export async function closeBrowser (browser) {
    await browser.close();
    console.log("Browser instance closed.");
}