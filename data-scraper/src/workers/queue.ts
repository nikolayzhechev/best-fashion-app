import { keys } from "../environment/keys.js";
import { Scraper } from "../models/interfaces/IScraper.js";
import { scrapers } from "../scrapers/registry.js";
import { Queue } from "bullmq";

const queueName = "scraper-queue";
const cronPattern = "*/1 * * * *";

export const scraperQueue: Queue = new Queue(queueName, {
    connection: {
        host: keys.redisHost,
        port: keys.redisPort
    }
});

export async function run(): Promise<void> {
    const sources: Record<string, Scraper> = scrapers;
    
    for (const source in sources) {
        console.log(`Enqueing job: ${source}`);

        await scraperQueue.upsertJobScheduler(
            `scrape-job: ${source}`,
            {
                pattern: cronPattern,
                tz: 'Europe/Sofia',
            },
            {
                name: source,
                data: { source },
                opts: {
                    removeOnComplete: true,
                    removeOnFail: 10
                }
            }
        );
    }

    console.log("Scrape jobs enqueued");
};