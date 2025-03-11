import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { institutions } from "../db/schema";
import { ResponseAuthor } from "../type";
import { AUTHOR_QUEUE_NAME, INSTITUTION_QUEUE_NAME, institutionQueue, safeFetch } from "../helper/utils";

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

const processScrapeJob = async (job: Job<{ id: string }, any, any>) => {
    const authorId = job.data.id;
    const url = `https://api.openalex.org/people/${authorId}`;
    const res = await safeFetch<ResponseAuthor>(url);

    res.match(
        async (data) => {
            institutionQueue.addBulk(data.affiliations.map((affiliation) => ({
                data: { id: cleanId(affiliation.institution.id), authorId: cleanId(data.id) },
                name: INSTITUTION_QUEUE_NAME
            })))

            await db.insert(institutions).values(data.affiliations.map((affiliation) => ({
                id: cleanId(affiliation.institution.id),
                name: affiliation.institution.display_name,
            }))).onConflictDoNothing();

        },
        (error) => {
            return { processed: false, skipped: true, reason: error.message };
        }
    );

    return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(AUTHOR_QUEUE_NAME, processScrapeJob, {
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

console.log("Author Worker started!");
