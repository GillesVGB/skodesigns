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

export const staffSessions = sqliteTable("staff_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  tokenCipher: text("token_cipher").notNull(),
  expiresAt: integer("expires_at").notNull(),
  verifiedAt: integer("verified_at"),
});
export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  featured: integer("featured").notNull(),
  createdAt: integer("created_at").notNull(),
  deletedAt: integer("deleted_at"),
});
export const hiddenProjects = sqliteTable("hidden_projects", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
});
export const storeItems = sqliteTable("store_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  descriptionNl: text("description_nl").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  price: integer("price").notNull(),
  image: text("image"),
  createdAt: integer("created_at").notNull(),
  deletedAt: integer("deleted_at"),
  titleNl: text("title_nl"),
  titleEn: text("title_en"),
  titleFr: text("title_fr"),
  kind: text("kind").notNull().default("single"),
  quantity: integer("quantity"),
});
