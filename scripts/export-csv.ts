import { db } from "../db";
import { publications, authors, publicationAuthors } from "../db/schema";
import { sql, like, eq } from "drizzle-orm";
import { createObjectCsvWriter } from 'csv-writer';

async function exportToCSV() {
  const result = await db
    .select({
      id: publications.id,
      title: publications.title,
      publication_date: publications.publication_date,
      language: publications.language,
      published_in: publications.published_in,
      is_open_access: publications.is_open_access,
      open_access_status: publications.open_access_status,
      url: publications.url,
      type: publications.type,
      authors: sql<string>`array_agg(${authors.display_name})`
    })
    .from(publications)
    .leftJoin(publicationAuthors, eq(publications.id, publicationAuthors.publication_id))
    .leftJoin(authors, eq(publicationAuthors.author_id, authors.id))
    .where(like(publications.title, '%graph%'))
    .groupBy(publications.id)
    .limit(500);

  const csvWriter = createObjectCsvWriter({
    path: 'publications_export.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'title', title: 'Title' },
      { id: 'publication_date', title: 'Publication Date' },
      { id: 'language', title: 'Language' },
      { id: 'published_in', title: 'Published In' },
      { id: 'is_open_access', title: 'Is Open Access' },
      { id: 'open_access_status', title: 'Open Access Status' },
      { id: 'url', title: 'URL' },
      { id: 'type', title: 'Type' },
      { id: 'authors', title: 'Authors' }
    ]
  });

  await csvWriter.writeRecords(result);

  console.log('CSV file has been written successfully');
}

exportToCSV()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
