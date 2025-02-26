import { Job, Worker } from "bullmq";
import { redisConnection } from "../helper/redis";
import { db } from "../db";
import { publications, authors, publicationAuthors, publishers, institutions, authorInstitutions, languages, countries, publicationTypes } from "../db/schema";
import { Publication } from "../type";
import { CRAWLER_QUEUE_NAME } from "../helper/utils";

// Access status mapping
const ACCESS_STATUS_MAP: Record<string, number> = {
  'diamond': 0,
  'gold': 1,
  'green': 2,
  'hybrid': 3,
  'bronze': 4,
  'closed': 5,
};

const cleanId = (id: string) => id.replace("https://openalex.org/", "");

// Helper function to reconstruct abstract from inverted index
function reconstructAbstract(invertedIndex: { [key: string]: number[] }): string {
  if (!invertedIndex) return '';
  
  // Create array of words with their positions
  const wordsWithPositions = Object.entries(invertedIndex).flatMap(([word, positions]) =>
    positions.map(pos => ({ word, position: pos }))
  );

  // Sort by position and join words
  return wordsWithPositions
    .sort((a, b) => a.position - b.position)
    .map(entry => entry.word)
    .join(' ');
}

const processScrapeJob = async (job: Job<Publication, any, any>) => {
  const publication: Publication = job.data;
  
  const publicationType = publication.type;

  await db.transaction(async (trx) => {
    // Add publication type handling
    if (publicationType) {
      await trx
        .insert(publicationTypes)
        .values({
          id: publicationType,
          name: publicationType.charAt(0).toUpperCase() + publicationType.slice(1),
          description: `Publication type: ${publicationType}`,
        })
        .onConflictDoNothing();
    }

    // Ensure language exists
    if (publication.language) {
      await trx
        .insert(languages)
        .values({
          id: publication.language,
          name: publication.language,
        })
        .onConflictDoNothing();
    }

    let publisherId = null;
    if (publication?.primary_location?.source?.host_organization_name) {
      const source = publication.primary_location.source;
      publisherId = cleanId(source.host_organization);
      
      await trx
        .insert(publishers)
        .values({
          id: publisherId,
          name: source.host_organization_name,
        })
        .onConflictDoNothing();
    }

    // Insert publication with new references
    await trx.insert(publications).values({
      id: cleanId(publication.id),
      title: publication.title,
      publication_date: publication.publication_date,
      language_id: publication.language,
      publisher_id: publisherId,
      is_open_access: publication.open_access.is_oa,
      access_status_id: ACCESS_STATUS_MAP[publication.open_access.oa_status],
      url: publication.open_access.oa_url || 
           publication?.primary_location?.landing_page_url,
      type_id: publicationType,
      abstract: publication.abstract_inverted_index ? reconstructAbstract(publication.abstract_inverted_index) : '',
      abstract_inverted_index: publication.abstract_inverted_index ? 
        JSON.stringify(publication.abstract_inverted_index) : null,
    });

    for (const authorship of publication.authorships) {
      const author = authorship.author;
      const authorId = cleanId(author.id);

      await trx
        .insert(authors)
        .values({
          id: authorId,
          display_name: author.display_name,
        })
        .onConflictDoNothing();

      await trx
        .insert(publicationAuthors)
        .values({
          publication_id: cleanId(publication.id),
          author_id: authorId,
        })
        .onConflictDoNothing();

      if (authorship.institutions && authorship.institutions.length > 0) {
        for (const inst of authorship.institutions) {
          const institutionId = cleanId(inst.id);

          // Insert country if it exists
          if (inst.country_code) {
            await trx
              .insert(countries)
              .values({
                id: inst.country_code,
                name: inst.country_code, // You might want to map country codes to full names
                description: `Country code: ${inst.country_code}`,
              })
              .onConflictDoNothing();
          }

          await trx
            .insert(institutions)
            .values({
              id: institutionId,
              name: inst.display_name,
              country_id: inst.country_code,
              type: inst.type,
            })
            .onConflictDoNothing();

          await trx
            .insert(authorInstitutions)
            .values({
              id: `${authorId}-${institutionId}`,
              author_id: authorId,
              institution_id: institutionId,
            })
            .onConflictDoNothing();
        }
      }
    }
  });

  return { processed: true, skipped: false, reason: null };
};

const worker = new Worker(CRAWLER_QUEUE_NAME, processScrapeJob, {
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

console.log("Scrape Worker started!");
