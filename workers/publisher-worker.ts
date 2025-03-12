import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { publishers } from "../db/schema";
import { ResponsePublisher } from "../type";
import { PUBLISHER_QUEUE_NAME, safeFetch } from "../helper/utils";
import { eq } from "drizzle-orm";

const processScrapeJob = async (job: Job<{ id: string }, any, any>) => {
    const publisherId = job.data.id;
    const url = `https://api.openalex.org/publishers/${publisherId}`;
    const res = await safeFetch<ResponsePublisher>(url);

    res.match(
        async (data) => {
            const cleanedName = data.display_name.replace(/\s*\(.*?\)\s*/g, "").trim();
            await db.update(publishers).set({
                website: data.homepage_url,
                cover: data.image_url,
                location: data.country_codes?.[0],
                name: cleanedName
            }).where(eq(publishers.id, publisherId));
        },
        (error) => {
            return { processed: false, skipped: true, reason: error.message };
        }
    );

    return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(PUBLISHER_QUEUE_NAME, processScrapeJob, {
    connection: redisConnection,
    concurrency: 10,
});

worker.on("completed", (job, result) => {
    if (result?.skipped) {
        console.log(`${job.id} was skipped: ${result.reason}`);
    } else {
        console.log(`${job.id} has completed!`);
    }
});

worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});

console.log("Publisher Worker started!");
