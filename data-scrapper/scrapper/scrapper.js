import { urlData } from "./utils.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url = urlData("zara", "woman");
const data = [];

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
            console.log(html);
        })
        .catch(err => err.catch);

    return data;
};


export async function ScrapeDynamicData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let config = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    try {
        await page.setUserAgent(config);
        await page.goto(url, { timeout: 18000 });

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);

        let retreivedData = $(".product-grid-product-info__main-info");

        retreivedData.each((index, element) => {
            const title = $(element).find("h3").text();
            const url = $(element).find("a").attr("href");

            data.push({
                title,
                url
            })
        })

    } catch (error) {
        console.log(error)
    }
    await browser.close();
    return data;
};
