import * as service from "../../services/scraperService.js";
import * as b from "./browser.js";
import * as mapper from "./map.js";
import { HTTPResponse, Page, Browser } from "puppeteer";
import siteEnums from "../enums.js";
import { IData } from "@models/interfaces/IData";
import { Scraper } from "@models/interfaces/IScraper";
import { IStores } from "@models/interfaces/IStores.js";
import { ICategories } from "@models/interfaces/ICategories.js";
import { IQueries } from "@models/interfaces/IQueries.js";
import { closeBrowser } from "../utils.js";
import { logger } from "logger.js";

const siteName: string = siteEnums.Sites.answear;
const store: IStores | null = await service.getStore(siteName);
const queries: IQueries | null = await service.getCategories(siteName);
const browser: Browser = await b.createBrowser();
const page: Page = await b.createPage(browser);
let itemsData: IData[] = [];

const answearScraper: Scraper = {
    source: "answear",
    isExecutable: true,

    async scrapeDynamicData(): Promise<IData[]> {
        const url: string | undefined = store?.url;

        if (url && queries) {
            await scrapeDataByQuery();
            await scrapeDataByCategory(queries.men);
            await scrapeDataByCategory(queries.woman);
        }

        async function scrapeDataByQuery (): Promise<void> {
            for (const query in store?.queries) {
                try {
                    logger.info(`Fetching: ${url + query}`);
                    const response: HTTPResponse | null = await page.goto(url + query);
    
                    if (response) {
                        console.log(await response.text());
                        const body: string = await response.text();
                        const mappedContent: IData | null = await mapper.fieldMapper(body);
    
                        if (mappedContent) {
                            itemsData.push(mappedContent);
                        } else {
                            console.log("Mapped data is null.");
                        }
                    }
                } catch (err: any) {
                    console.log(`Error in scrapeDataByQuery: ${err}`);
                }
            }
        };

        async function scrapeDataByCategory (categories: ICategories): Promise<void> {
            for (const [category, query] of Object.entries(categories)) {
                const response: HTTPResponse | null = await page.goto(url + query);

                if (response) {
                    console.log(await response.text());
                }
            }
        };

        closeBrowser(browser, page);
        return itemsData;
    },
}

export default answearScraper;