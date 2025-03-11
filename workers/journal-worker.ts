import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { journals } from "../db/schema";
import { ResponseJournal } from "../type";
import { JOURNAL_QUEUE_NAME, safeFetch } from "../helper/utils";
import { eq } from "drizzle-orm";

const processScrapeJob = async (job: Job<{ id: string }, any, any>) => {
    const journalId = job.data.id;
    const url = `https://api.openalex.org/sources/${journalId}`;
    const res = await safeFetch<ResponseJournal>(url);

    res.match(
        async (data) => {
            await db.update(journals).set({
                website: data.homepage_url,
            }).where(eq(journals.id, journalId));
        },
        (error) => {
            return { processed: false, skipped: true, reason: error.message };
        }
    );

    return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(JOURNAL_QUEUE_NAME, processScrapeJob, {
    connection: redisConnection,
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

console.log("Journal Worker started!");
