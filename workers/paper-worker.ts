import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { publications, journals, publishers, authors, publicationAuthors } from "../db/schema";
import { Publication } from "../type";
import { AUTHOR_QUEUE_NAME, authorQueue, JOURNAL_QUEUE_NAME, journalQueue, PAPER_QUEUE_NAME, PUBLISHER_QUEUE_NAME, publisherQueue } from "../helper/utils";

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

// Helper function to reconstruct abstract from inverted index
function reconstructAbstract(invertedIndex: {
  [key: string]: number[];
}): string {
  if (!invertedIndex) return "";

  // Create array of words with their positions
  const wordsWithPositions = Object.entries(invertedIndex).flatMap(
    ([word, positions]) => positions.map((pos) => ({ word, position: pos }))
  );

  // Sort by position and join words
  return wordsWithPositions
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.word)
    .join(" ");
}

const processScrapeJob = async (job: Job<Publication, any, any>) => {
  const publication: Publication = job.data;
  let journalId = publication.primary_location.source?.id;
  let publisherId = publication.primary_location.source?.host_organization;
  if (!journalId) return { processed: false, skipped: true, reason: "No journal id" };
  if (!publisherId) return { processed: false, skipped: true, reason: "No publisher id" };

  await db.transaction(async (trx) => {
    const source = publication.primary_location.source;

    // Handle publisher
    publisherId = cleanId(publisherId || '');
    await trx
      .insert(publishers)
      .values({
        id: publisherId,
        name: source?.host_organization_name,
      })
      .onConflictDoNothing();

    // Handle journal
    journalId = cleanId(journalId || '');
    await trx
      .insert(journals)
      .values({
        id: journalId,
        name: source?.display_name || "",
        publisher_id: publisherId,
      })
      .onConflictDoNothing();

    // Handle publication
    await trx
      .insert(publications)
      .values({
        id: cleanId(publication.id),
        title: publication.title,
        publication_date: publication.publication_date,
        pdf_url: publication.open_access.oa_url,
        journal_id: journalId,
        url: publication?.primary_location?.landing_page_url,
        abstract: publication.abstract_inverted_index
          ? reconstructAbstract(publication.abstract_inverted_index)
          : "",
      }).onConflictDoNothing();

    // Handle authors and publication-author relationships
    for (const authorship of publication.authorships) {
      const author = authorship.author;
      const authorId = cleanId(author.id);

      // Insert author
      await trx
        .insert(authors)
        .values({
          id: authorId,
          display_name: author.display_name,
        })
        .onConflictDoNothing();

      // Link author to publication
      await trx
        .insert(publicationAuthors)
        .values({
          publication_id: cleanId(publication.id),
          author_id: authorId,
        })
        .onConflictDoNothing();
    }
  });

  // Queue journal, publisher and authors for additional processing if needed
  journalQueue.add(JOURNAL_QUEUE_NAME, { id: journalId });
  publisherQueue.add(PUBLISHER_QUEUE_NAME, { id: publisherId });
  authorQueue.add(AUTHOR_QUEUE_NAME, { ids: publication.authorships.map((authorship) => cleanId(authorship.author.id)) });

  return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(PAPER_QUEUE_NAME, processScrapeJob, {
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

console.log("Paper Worker started!");
