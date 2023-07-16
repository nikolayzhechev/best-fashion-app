import { urlData, getUrl } from "./utils.js";
import { createRequire } from "module";
import { proxyList } from "./urlTestPaths.js";

const require = createRequire(import.meta.url);
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url = urlData("catsApi", "htmlCat");
const data = [];

// get random proxy server from list
let randomServerIndex = Math.floor(Math.random() * proxyList.length);
const serverObject = proxyList[randomServerIndex];
//serverObject.host + serverObject.port;
const proxyServer = "129.159.112.251:3128";

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


export async function ScrapeDynamicData() {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: [
            `--proxy-server=https=${proxyServer}`,
            // "--no-sandbox",
            // "--ignore-certificate-errors",
            // "--ignore-certificate-errors-spki-list" ,
        ]
    });

    const page = await browser.newPage();
    let config = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    // await getDataAndPushToCollection(page, config, ".product-grid-product-info__main-info");
    try {
        await page.setUserAgent(config);
        await page.goto(url); //, { timeout: 18000 }
        
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);

        let retreivedData = $("body");
        const singleItem = retreivedData.find("img").attr("src");
        const imgPath = getUrl("catsApi") + singleItem;

        data.push({ imgPath })

     } catch (error) {
         console.log(error)
     }
    
    await browser.close();
    return data;
};


// async function getDataAndPushToCollection (page, config, selector) {
//     try {
//         await page.setUserAgent(config);
//         await page.goto(url, { timeout: 18000 });
        
//         let bodyHTML = await page.evaluate(() => document.body.innerHTML);
//         let $ = cheerio.load(bodyHTML);

//         let retreivedData = $(selector);

//         retreivedData.each(() => {
//             const item = $.find("src");
//             data.push({
//                 item
//             })  
//         })

//     } catch (error) {
//         console.log(error)
//     }
// };