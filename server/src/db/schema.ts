import { boolean, index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {length: 100}),
  email: varchar("email", {length: 255}).notNull().unique(),
  password_hash: varchar("password", {length: 255}).notNull(),
  verified: boolean("verified").default(false).notNull(),
  token: varchar("token", {length: 255}),
  token_expires_at: timestamp("token_expires_at", {withTimezone: true}),
  created_at: timestamp("created_at", {withTimezone: true}).defaultNow(),
  updated_at: timestamp("updated_at", {withTimezone: true}).defaultNow()
}, (table) => [
  index("token_idx").on(table.token),
  uniqueIndex("name_idx").on(table.name)
]);

// Work on this later!!:
// add a revoked_at
// Right now my only way to "kill" a row is deleting it outright. 
// That works for the basic flow (rotation = delete old, insert new),
// but it means ill lose all history as theres no way to later ask "was this
// token revoked, or did it just never exist?" for debugging/audit 
// purposes. A nullable revoked_at column lets you soft-delete 
// instead: set the timestamp instead of removing the row, and your 
// lookup query becomes WHERE jti = ? AND revoked_at IS NULL. 
// Not compulsory for v1, but cheap to add now vs. migrating later. 

export const refreshTokens = pgTable('refresh_tokens', {
  jti: uuid('jti').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})


export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('pass_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  passwordTokenHash: varchar('pass_token_hash', {length: 255}).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})


export const articulations = pgTable('articulations', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  rawText: text("raw_text").notNull(),
  tone: varchar("tone", { length: 50 }).notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true,}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true,}).defaultNow().notNull(),
});


export const billingSubscriptions = pgTable("billing_subscriptions", {
  userId: uuid("user_id").primaryKey().references(() => users.id),
  bachsCustomerId: varchar("bachs_customer_id", { length: 64 }).notNull(),
  bachsSubscriptionId: varchar("bachs_subscription_id", { length: 64 }).notNull().unique(),
  productId: varchar("product_id", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  state: jsonb("state").notNull(),
  eventCreatedAt: timestamp("event_created_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("billing_customer_idx").on(table.bachsCustomerId),
]);

export const billingWebhookEvents = pgTable("billing_webhook_events", {
  id: varchar("id", { length: 128 }).primaryKey(),
  type: varchar("type", { length: 128 }).notNull(),
  eventCreatedAt: timestamp("event_created_at", { withTimezone: true }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

export const billingOperations = pgTable("billing_operations", {
  idempotencyKey: varchar("idempotency_key", { length: 128 }).primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  operation: varchar("operation", { length: 32 }).notNull(),
  plan: varchar("plan", { length: 64 }).notNull(),
  checkoutId: varchar("checkout_id", { length: 64 }),
  checkoutUrl: text("checkout_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
