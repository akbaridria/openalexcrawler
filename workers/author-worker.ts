import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { authors, institutions } from "../db/schema";
import { ResponseAuthor } from "../type";
import { AUTHOR_QUEUE_NAME, INSTITUTION_QUEUE_NAME, institutionQueue, safeFetch } from "../helper/utils";

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

const processScrapeJob = async (job: Job<{ ids: string[] }, any, any>) => {
    const authorIds = job.data.ids;
    const uniqueAuthorIds = Array.from(new Set(authorIds));
    const filterAuthoIds = `?filter=id:${uniqueAuthorIds.join("|")}`;

    const url = `https://api.openalex.org/people${filterAuthoIds}`;
    const res = await safeFetch<{ results: ResponseAuthor[] }>(url);

    res.match(
        async (data) => {
            try {
                await db.insert(authors).values(data.results.map((author) => ({
                    id: cleanId(author.id),
                    name: author.display_name,
                }))).onConflictDoNothing();

                const authorInstitutionMap = data.results.map((author) => ({
                    authorId: cleanId(author.id),
                    institutions: author.last_known_institutions.map((institution) => cleanId(institution.id)),
                }));
                if (authorInstitutionMap.length > 0) {
                    institutionQueue.add(INSTITUTION_QUEUE_NAME, { ids: authorInstitutionMap });
                }

            } catch (error) {
                return { processed: false, skipped: true, reason: error };
            }

        },
        (error) => {
            return { processed: false, skipped: true, reason: error.message };
        }
    );

    return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(AUTHOR_QUEUE_NAME, processScrapeJob, {
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

console.log("Author Worker started!");
