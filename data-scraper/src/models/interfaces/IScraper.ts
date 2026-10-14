import { IData } from "./IData.js";

export interface Scraper {
  source: string;
  scrapeDynamicData(): Promise<IData[]>;
}