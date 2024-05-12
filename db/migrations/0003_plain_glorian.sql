ALTER TABLE "recipe_ingredients" ALTER COLUMN "ingredient" SET DATA TYPE varchar(40);--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ALTER COLUMN "ingredient" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD COLUMN "name" varchar(256) NOT NULL;