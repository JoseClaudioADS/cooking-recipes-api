ALTER TABLE "magic_links" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "preparation_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "updated_at" SET NOT NULL;