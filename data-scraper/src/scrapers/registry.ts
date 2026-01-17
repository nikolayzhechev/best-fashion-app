import { Scraper } from "../models/interfaces/IScraper.js";
import fashiondaysScraper from "./fashiondays/scraper.js";
import remixshopScraper from "./remixshop/scraper.js";
import aboutYouScraper from "./aboutyou/scraper.js";

export const scrapers: Record<string, Scraper> = {
    fashiondays: fashiondaysScraper,
    remixshop: remixshopScraper,
    aboutYou: aboutYouScraper
};