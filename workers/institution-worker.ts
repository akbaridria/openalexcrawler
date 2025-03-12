import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { authorInstitutions, institutions } from "../db/schema";
import { ResponseInstitution } from "../type";
import { INSTITUTION_QUEUE_NAME, safeFetch } from "../helper/utils";
import { eq } from "drizzle-orm";

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

const processScrapeJob = async (job: Job<{
    ids: {
        authorId: string;
        institutions: string[];
    }[]
}, any, any>) => {
    const institutionIds = job.data.ids.flatMap((authorInstitution) => authorInstitution.institutions);
    const uniqueInstitutionIds = Array.from(new Set(institutionIds));
    const filterInstitutionIds = `?filter=id:${uniqueInstitutionIds.join("|")}`;

    const url = `https://api.openalex.org/institutions${filterInstitutionIds}`;
    const res = await safeFetch<{ results: ResponseInstitution[] }>(url);

    res.match(
        async (data) => {
            try {
                await db.insert(institutions).values(data.results.map((institution) => ({
                    id: cleanId(institution.id),
                    name: institution.display_name.replace(/\s*\(.*?\)\s*/g, "").trim(),
                    location: institution.country_code,
                    website: institution.homepage_url,
                    cover: institution.image_url,
                }))).onConflictDoNothing();

                const payloadAuthorinstitutions = job.data.ids.flatMap((authorInstitution) => {
                    return authorInstitution.institutions.map((institutionId) => ({
                        id: `${authorInstitution.authorId}-${institutionId}`,
                        author_id: authorInstitution.authorId,
                        institution_id: institutionId,
                    }))
                })

                await db.insert(authorInstitutions).values(payloadAuthorinstitutions).onConflictDoNothing();

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

const worker = new Worker(INSTITUTION_QUEUE_NAME, processScrapeJob, {
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

console.log("Institution Worker started!");
