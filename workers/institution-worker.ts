import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { authorInstitutions, institutions } from "../db/schema";
import { ResponseInstitution } from "../type";
import { INSTITUTION_QUEUE_NAME, safeFetch } from "../helper/utils";
import { eq } from "drizzle-orm";

const processScrapeJob = async (job: Job<{ id: string, authorId: string }, any, any>) => {
    const institutionId = job.data.id;
    const url = `https://api.openalex.org/institutions/${institutionId}`;
    const res = await safeFetch<ResponseInstitution>(url);

    res.match(
        async (data) => {
            const cleanedName = data.display_name.replace(/\s*\(.*?\)\s*/g, "").trim();
            await db.update(institutions).set({
                name: cleanedName,
                location: data.country_code,
                website: data.homepage_url,
            }).where(eq(institutions.id, institutionId));

            await db.insert(authorInstitutions).values({
                id: `${job.data.authorId}-${institutionId}`,
                author_id: job.data.authorId,
                institution_id: institutionId,
            }).onConflictDoNothing();

        },
        (error) => {
            return { processed: false, skipped: true, reason: error.message };
        }
    );

    return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(INSTITUTION_QUEUE_NAME, processScrapeJob, {
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

console.log("Institution Worker started!");
