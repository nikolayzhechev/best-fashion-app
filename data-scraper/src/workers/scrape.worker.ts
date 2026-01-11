import { Job, Worker } from "bullmq";
import { scrapers } from "../scrapers/registry.js";
import * as itemService from "../services/itemService.js";
import { keys } from '../environment/keys';

const worker = new Worker(
    "scraper-queue",
    async (job: Job) => {
        console.log(`Job data: ${Object.keys(job.data)}`);
        const { source } = job.data;
        const scraper = scrapers[source];

        await job.updateProgress(25);

        if (!scraper) {
            throw new Error("Unknown scraper");
        }
        
        const items = await scraper.scrapeDynamicData();

        console.log(`Items scraped from job: ${items.length}`);
        
        await job.updateProgress(50);
        
        await itemService.writeData(items);

        await job.updateProgress(100);
    },
    {
        connection: {
            host: keys.redisHost,
            port: keys.redisPort
        },
        concurrency: 2
    }
);

console.log(`Worker state: ${worker.isRunning()}`);

worker.on("completed", job => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});