import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from "puppeteer";
import * as service from "../../services/scraperService.js";
import * as proxyService from "../../services/proxyService.js"; 
import { IProxyData } from "../../models/interfaces/IProxyData.js";
import { IData } from '../../models/interfaces/IData.js';
import { INavi } from '../../models/interfaces/INavi.js';
import { IStores } from '../../models/interfaces/IStores';
import { IQueries } from "../../models/interfaces/IQueries.js";
import { IStoreTargetMetadata } from "../../models/interfaces/IStoreTargetMetadata.js";
import siteEnums from "../enums";
import { ICategories } from '../../models/interfaces/ICategories.js';
import { Scraper } from '../../models/interfaces/IScraper.js';
import { closeBrowser, waitForTarget} from '../utils.js';

const siteName: string = siteEnums.Sites.zara;
const store: IStores | null = await service.getStore(siteName);
const queries: IQueries | null = await service.getCategories(siteName);
let itemsData: IData[] = [];

const zaraScraper: Scraper = {
    source: "zara",
    isExecutable: false,

    async scrapeDynamicData(): Promise<IData[]> {
        let proxyData: IProxyData = await proxyService.getRandomProxy();
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
            
            if (queries && store) {
                await setScrapedData(queries.men);
                await setScrapedData(queries.woman);
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            await closeBrowser(browser, page);
        }

        async function setScrapedData (categories: ICategories): Promise<void> {
            for (const [category, query] of Object.entries(categories)) {
                if (query !== "" && query) {
                    await page.goto(store?.url + query , { timeout: 18000 });

                    if (siteName) {
                        let scrapedData = await scrapeData(page, category);
                        if (scrapedData) {
                            itemsData = [...scrapedData];
                        } else {
                            console.error(`scraper: Items collection is empty. No data has been scraped.`);
                        }
                    }
                }
            };
        }

        
    async function scrapeData (page: Page, category: string): Promise<IData[] | null> {
        let bodyHTML: string = await page.evaluate(() => document.body.innerHTML);
        let $: cheerio.CheerioAPI = cheerio.load(bodyHTML);

        let items: IData[] = [];
        let naviItems: INavi[] = [];
        let pagination: any[] = [];

        if (store && queries) {
            const currentTarget: IStoreTargetMetadata = store.target.metadata;

            // retreive links from site
            await $(queries.navi.parent).each(function () {
                let link: string | undefined = $(this).find(queries.navi.link).attr("href");
                let title: string | undefined = $(this).find("span").text();

                if (!link?.includes("http") || !link?.includes("https")){
                    link = store.url + link;
                }
                if (link !== null){
                    naviItems.push({link, title});
                }
            });

            // retreive pagination
            await $(store.pagination).find("li").each(function () {
                let url: string | undefined = $(this).find("a").attr("href");
                let text: string | undefined = $(this).find("a").text();
        
                if (url?.includes("http")) {
                    url = store.url + url;
                }
        
                if (url?.includes("javascript")) {
                    pagination.push({url, text});
                }
            });

            // retreive main data from site
            await $(store.target.class).each(function (){
                let img: any[] = [];
        
                waitForTarget(page, "img")
                    .then(() => img.push($(this).find("img").attr("src")));
                    const title: string | undefined = $(this).find(currentTarget.text.class).text();
                    const price: string | undefined = $(this).find(currentTarget.price.class).text();
                    const description = "";
                    const gender: string | undefined = $(this).find(category).text();
                    const originalPrice = "";
                    let itemUrl: string | undefined = $(this).find(currentTarget.link).attr("href");

                if (!itemUrl?.includes("http") || !itemUrl?.includes("https")){
                    itemUrl = store.url + itemUrl;
                }

                items.push({
                    title,
                    price,
                    gender,
                    category,
                    originalPrice,
                    itemUrl,
                    img,
                    description,
                    site: siteName
                }); 
            });

            return items;
        }

        return null;
    };
        return itemsData;
    }
};

export default zaraScraper;