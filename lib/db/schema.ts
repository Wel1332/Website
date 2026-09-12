import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  index,
  integer,
  pgSchema,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* Drizzle schema — the single source of truth for the Postgres tables.
   `npm run db:push` syncs it to the database; `npm run db:generate` writes
   SQL migrations into ./drizzle from the diff.

   Everything lives in its own Postgres schema, `store`, not `public`. On
   Supabase, `public` is served to anyone holding the anon key through the
   Data API — these tables (password hashes, customer emails) must never be
   reachable that way. A private schema also keeps drizzle-kit from touching
   whatever else the database holds.

   RLS is enabled on every table with no policies: belt and braces in case the
   schema is ever exposed or granted to the API roles by mistake — they'd
   still see nothing. The app is unaffected because it connects as the table
   owner, which bypasses RLS. */

export const storeSchema = pgSchema("store");

export const userRole = storeSchema.enum("user_role", ["ADMIN", "STAFF"]);

export const orderStatus = storeSchema.enum("order_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

export const users = storeSchema.table("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("STAFF"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const products = storeSchema.table("products", {
  id: text("id").primaryKey().$defaultFn(createId),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  image: text("image").notNull(),
  features: text("features").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const orders = storeSchema.table(
  "orders",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    customerEmail: text("customer_email"),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(),
    status: orderStatus("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("orders_product_id_idx").on(t.productId)]
).enableRLS();

export type User = typeof users.$inferSelect;
export type DbProduct = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
