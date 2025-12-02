import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from "puppeteer";
import { getUrl, getData, getAllObjects } from "./utils";
import { proxyList } from "./proxyList";
import { IProxyData } from "@models/interfaces/IProxyData.js";
import { IProxy } from "@models/interfaces/IProxy.js";
import { ISetDataDTO } from '@models/interfaces/DTOs/ISetDataDTO.js';
import { IItemsDTO } from '@models/interfaces/DTOs/IItemsDTO.js';
import { IData } from '@models/interfaces/IData.js';
import { INavi } from '@models/interfaces/INavi.js';

let itemsData: IData[] = [];
let naviData: INavi[] = [];
let pagesData: any[] = [];

// get random proxy server from list
function getRandomProxy(): IProxyData {
    let randomServerIndex: number = Math.floor(Math.random() * proxyList.length);
    const serverObject: IProxy = proxyList[randomServerIndex];

    const proxyData: IProxyData = {
        server: serverObject.host + ":" + serverObject.port,
        protocol: serverObject.protocol
    }

    console.log(`Proxy data: ${proxyData.server}`);

    return proxyData;
}

export async function scrapeDynamicData(siteName: string | undefined, type: string | undefined, appendToExisting: boolean, queryData?: ISetDataDTO): Promise<IItemsDTO | null> {
    console.log(`Scrape execution properties: siteName: ${siteName}, type: ${type}, queryData: ${queryData?.url}, appendToExisting?: ${appendToExisting}`)
    let url: string | undefined;
    
    if (siteName && type){
        if (queryData === null){
            url = await getUrl(siteName, type);
        } else {
            url = queryData?.url;
        }
    }

    if(url === undefined){
        console.log("URL is undefined.");
        return null;
    }

    if (appendToExisting){
        itemsData = await getAllObjects("RetreivedData", siteName);     // get written data from db
    }

    let proxyData: IProxyData = getRandomProxy();

    const browser: Browser = await puppeteer.launch(
        {
            headless: true,
            args: [
            `--proxy-server=${proxyData.protocol}=${proxyData.server}`,
            '--no-sandbox'
            // `--proxy-server=https=`, "--ignore-certificate-errors", "--ignore-certificate-errors-spki-list" ,
            ]
        }
    );
    
    const page: Page = await browser.newPage();
    let config: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    try {
        await page.setUserAgent(config);
        await page.goto(url, { timeout: 18000 });
        
        let bodyHTML: string = await page.evaluate(() => document.body.innerHTML);
        let $: cheerio.CheerioAPI = cheerio.load(bodyHTML);
        
        if (siteName && type) {
            let allItems = await getData($, siteName, type, page, queryData, browser);

            if (allItems) {
                if(allItems.items.length === 0){
                    console.error(`scraper.js: Items collection is empty. No data has been scraped.`);
                    return null;
                }
        
                if (appendToExisting){
                    itemsData.push(...allItems.items);      // add new data to existing           
                } else {
                    itemsData = Array.from(allItems.items);
                    naviData = Array.from(allItems.naviItems);
                    pagesData = Array.from(allItems.pagination);
                }
            }
        }

        if (appendToExisting){
            const targetCount: number = 100;
            const scrapedInfiniteData: any = await scrapeInfiniteScrollPage(page, itemsData, targetCount);
        }

     } catch (error: any) {
        console.log(error);
     } finally {
        await closeBrowser(browser);
     }

    return { itemsData, naviData, pagesData };
};

// scrapes infinite scrolling pages
async function scrapeInfiniteScrollPage (page: Page, itemsData: any[], targetCount: number) {
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

export function clearData (): void {
    itemsData.length = 0;
    naviData.length = 0;
    pagesData.length = 0;
}

export async function closeBrowser (browser: Browser) {
    await browser.close();
    console.log("Browser instance closed.");
}