import { IData } from "./IData";
import { RedisClientType } from "redis";

export interface Scraper {
  source: string;
  scrapeDynamicData(): Promise<IData[]>;
}