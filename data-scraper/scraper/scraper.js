import { urlData, getUrl } from "./utils.js";
import { createRequire } from "module";
import { proxyList } from "./urlTestPaths.js";

const require = createRequire(import.meta.url);
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const data = [];
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

                data.push({
                    title,
                    url
                })
            })
        })
        .catch(err => err.catch);

    return data;
};


export async function scrapeDynamicData(siteName, type) {
    let url = getUrl(siteName, type);
    let proxyData = getRandomProxy();
    cachedSiteUrl = siteName;
    cachedSiteType = type;

    const browser = await puppeteer.launch(
        {
            headless: true,
            args: [
            `--proxy-server=${proxyData.proxyProtocol}=${proxyData.proxyServer}`,
            // `--proxy-server=https=`
            // "--no-sandbox",
            // "--ignore-certificate-errors",
            // "--ignore-certificate-errors-spki-list" ,
        ]
    });

    const page = await browser.newPage();
    let config = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    try {
        await page.setUserAgent(config);
        await page.goto(url, { timeout: 18000 });

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        
        //const resource = getData($); 

        let item = $(".product-grid-product-info__main-info");
        const itemUrl = item.find("a").attr("href");
        const title = item.find("h3").text();

            data.push({
                title,
                itemUrl
            })
            console.log(`Fetching data: ${title}, ${itemUrl}`);
        
     } catch (error) {
         console.log(error);
         //errProxyFail = true;
     }
    
    await browser.close();
    errProxyFail = false;
    return data;
};

if (errProxyFail){
    scrapeDynamicData(cachedSiteUrl, cachedSiteType);
}

export async function clearData () {
    data.length = 0;    
    return data;
}