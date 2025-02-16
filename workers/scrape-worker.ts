import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { publications, authors, publicationAuthors } from "../db/schema";
import { Publication } from "../type";
import { CRAWLER_QUEUE_NAME } from "../helper/utils";
import { eq } from "drizzle-orm";

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

const processScrapeJob = async (job: Job<Publication, any, any>) => {
  const publication: Publication = job.data;

  await db.transaction(async (trx) => {
    // Insert publication
    await trx.insert(publications).values({
      id: cleanId(publication.id),
      title: publication.title,
      publication_date: publication.publication_date,
      language: publication.language,
      published_in: publication.primary_location?.source?.display_name,
      is_open_access: publication.open_access.is_oa,
      open_access_status: publication.open_access.oa_status,
      url:
        publication.open_access.oa_url ||
        publication.primary_location.landing_page_url,
      type: publication.primary_location?.source?.type || publication.type,
    });

    // Insert authors and link to publication
    for (const authorship of publication.authorships) {
      const author = authorship.author;
      const authorId = cleanId(author.id);

      // Use upsert instead of insert for authors
      await trx
        .insert(authors)
        .values({
          id: authorId,
          display_name: author.display_name,
        })
        .onConflictDoNothing({ target: authors.id });

      // Insert publication-author relationship
      await trx
        .insert(publicationAuthors)
        .values({
          publication_id: cleanId(publication.id),
          author_id: authorId,
        })
        .onConflictDoNothing();
    }
  });
};

const worker = new Worker(CRAWLER_QUEUE_NAME, processScrapeJob, {
  connection: redisConnection,
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

console.log("Scrape Worker started!");
