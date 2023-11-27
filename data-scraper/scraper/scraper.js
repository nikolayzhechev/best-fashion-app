import { getUrl, getData } from "./utils.js";
import { createRequire } from "module";
import { proxyList } from "./proxyList.js";

const require = createRequire(import.meta.url);
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

let itemsData = [];
let naviData = [];
let errProxyFail = false;
let cachedSiteUrl;
let cachedSiteType;

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

export function scrapeStaticData() {
    let config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }
    axios(url, config)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $(".product-link _item product-grid-product-info__name link", html).each(function () {
                const title = $(this).find("h3").text();
                const url = $(this).find("a").attr("href");

                itemsData.push({
                    title,
                    url
                })
            })
        })
        .catch(err => err.catch);

    return itemsData;
};

export async function scrapeDynamicData(siteName, type) {
    let url = await getUrl(siteName, type);

    if(url === undefined){
        return;
    }

    let proxyData = getRandomProxy();
    cachedSiteUrl = siteName;
    cachedSiteType = type;

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
        await page.goto(url, { timeout: 18000});
        
        // const watchDog = page.waitForFunction('window.status === "ready"');
        // await watchDog;
        
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        
        let allItems = await getData($, siteName, type, browser, page);
        let itemsArray = allItems.items;
        let naviItemsArray = allItems.naviItems;

        if(itemsArray.length === 0){
            console.error(`Items collection is empty. No data has been scraped.\n   scraper.js at line 89`);
            return;
        }

        itemsData = Array.from(itemsArray);
        naviData = Array.from(naviItemsArray);

     } catch (error) {
        console.log(error);
     } finally {
        await closeBrowser(browser);
     }
    
    return { itemsData, naviData };
};

if (errProxyFail) {
    scrapeDynamicData(cachedSiteUrl, cachedSiteType);
}

export async function clearData () {
    data.length = 0;
    return data;
}

export async function closeBrowser (browser) {
    await browser.close();
    console.log("Browser instance closed.");
}

// export async function waitForImageContent (page, img) {
//     const invalidUrl = "https://static.zara.net/stdstatic/5.16.1/images/transparent-background.png";
//     await page.waitForFunction((img, invalidUrl) => {
//            if(img !== invalidUrl){
//             return true;
//            }
//         }, {}, img, invalidUrl
//      )
// };