import { pgTable, text, varchar, date, boolean, serial } from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: varchar("id", { length: 2 }).primaryKey(),  // ISO 2-letter country code
  name: varchar("name", { length: 100 }).notNull(),
  entityID: varchar("entity_id", { length: 255 }),
});

export const publishers = pgTable("publishers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
  cover: text("cover"),
  location: varchar("location", { length: 2 }).references(() => countries.id),
  website: text("website"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const journals = pgTable("journals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  publisher_id: varchar("publisher_id", { length: 255 })
    .references(() => publishers.id),
  website: text("website"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const institutions = pgTable("institutions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  location: varchar("country_id", { length: 2 })
    .references(() => countries.id),
  type: varchar("type", { length: 50 }),
  cover: text("cover"),
  website: text("website"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const authors = pgTable("authors", {
  id: varchar("id", { length: 255 }).primaryKey(),
  display_name: text("display_name"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const publications = pgTable("publications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title"),
  publication_date: date("publication_date"),
  journal_id: varchar("journal_id", { length: 255 })  // Changed from publisher_id
    .references(() => journals.id),
  url: text("url"),
  pdf_url: text("pdf_url"),
  abstract: text("abstract"),  // For reconstructed abstract text
  entityID: varchar("entity_id", { length: 255 }),
});

export const publicationAuthors = pgTable("publication_authors", {
  publication_id: varchar("publication_id", { length: 255 }).references(
    () => publications.id
  ),
  author_id: varchar("author_id", { length: 255 }).references(() => authors.id),
});

export const authorInstitutions = pgTable("author_institutions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  author_id: varchar("author_id", { length: 255 }).references(() => authors.id),
  institution_id: varchar("institution_id", { length: 255 }).references(
    () => institutions.id
  ),
});
