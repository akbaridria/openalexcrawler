import { pgTable, text, varchar, date, boolean, serial } from "drizzle-orm/pg-core";

// Reference tables for what were previously enums
export const accessStatuses = pgTable("access_statuses", {
  id: serial("id").primaryKey(),  // Will be 0-5
  name: varchar("name", { length: 50 }).notNull(), // e.g., 'diamond', 'gold', etc.
  description: text("description"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const languages = pgTable("languages", {
  id: varchar("id", { length: 10 }).primaryKey(), // e.g., 'en', 'es', etc.
  name: varchar("name", { length: 50 }), // e.g., 'English', 'Spanish',
  entityID: varchar("entity_id", { length: 255 }),
});

export const countries = pgTable("countries", {
  id: varchar("id", { length: 2 }).primaryKey(),  // ISO 2-letter country code
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const publishers = pgTable("publishers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const institutions = pgTable("institutions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  country_id: varchar("country_id", { length: 2 })
    .references(() => countries.id),
  type: varchar("type", { length: 50 }),
  entityID: varchar("entity_id", { length: 255 }),
});

export const authors = pgTable("authors", {
  id: varchar("id", { length: 255 }).primaryKey(),
  display_name: text("display_name"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const publicationTypes = pgTable("publication_types", {
  id: varchar("id", { length: 50 }).primaryKey(),  // e.g., 'journal', 'book', etc.
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const licenses = pgTable("licenses", {
  id: varchar("id", { length: 50 }).primaryKey(), // e.g., 'cc-by', 'cc-by-nc', etc.
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  url: text("url"),
  entityID: varchar("entity_id", { length: 255 }),
});

export const publications = pgTable("publications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title"),
  publication_date: date("publication_date"),
  language_id: varchar("language_id", { length: 10 }).references(() => languages.id),
  publisher_id: varchar("publisher_id", { length: 255 }).references(() => publishers.id),
  is_open_access: boolean("is_open_access"),
  access_status_id: serial("access_status_id").references(() => accessStatuses.id),
  url: text("url"),
  type_id: varchar("type_id", { length: 50 })
    .references(() => publicationTypes.id),
  entityID: varchar("entity_id", { length: 255 }),
  license_id: varchar("license_id", { length: 50 })
    .references(() => licenses.id),
  abstract: text("abstract"),  // For reconstructed abstract text
  abstract_inverted_index: text("abstract_inverted_index"),  // Store as JSON string
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
