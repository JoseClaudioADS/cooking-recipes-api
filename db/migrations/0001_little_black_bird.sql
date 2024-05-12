ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "filename" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ALTER COLUMN "ingredient" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "steps" text NOT NULL;