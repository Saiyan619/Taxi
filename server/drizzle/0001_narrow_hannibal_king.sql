ALTER TABLE "billing_operations" ADD COLUMN "checkout_id" varchar(64);--> statement-breakpoint
ALTER TABLE "billing_operations" ADD COLUMN "checkout_url" text;