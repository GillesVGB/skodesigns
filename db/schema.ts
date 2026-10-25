import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  body: text("body").notNull(),
  language: text("language").notNull(),
  createdAt: integer("created_at").notNull(),
});

// No raw IP addresses are stored. These short-lived keys are separate from reviews.
export const reviewLimits = sqliteTable("review_limits", {
  id: text("id").primaryKey(),
  nextAllowedAt: integer("next_allowed_at").notNull(),
});
