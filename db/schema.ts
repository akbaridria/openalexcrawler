import {
  pgTable,
  text,
  varchar,
  date,
  boolean,
} from "drizzle-orm/pg-core";

export const publicationAuthors = pgTable("publication_authors", {
  publication_id: varchar("publication_id", { length: 255 }).references(
    () => publications.id
  ),
  author_id: varchar("author_id", { length: 255 }).references(() => authors.id),
});

export const publications = pgTable("publications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title"),
  publication_date: date("publication_date"),
  language: varchar("language", { length: 50 }),
  published_in: varchar("published_in", { length: 255 }),
  is_open_access: boolean("is_open_access"),
  open_access_status: varchar("open_access_status", { length: 50 }),
  url: text("url"),
  type: varchar("type", { length: 50 }),
});

export const authors = pgTable("authors", {
  id: varchar("id", { length: 255 }).primaryKey(),
  display_name: text("display_name"),
});
