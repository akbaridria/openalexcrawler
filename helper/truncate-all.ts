import { db } from "../db";

async function truncateAllTables() {
  await db.execute(
    `TRUNCATE TABLE 
      publication_authors, 
      author_institutions, 
      publications, 
      authors, 
      institutions, 
      journals, 
      publishers
      RESTART IDENTITY CASCADE;`
  );
}

truncateAllTables()
  .then(() => console.log("All tables truncated"))
  .catch((err) => console.error("Error truncating tables:", err));
