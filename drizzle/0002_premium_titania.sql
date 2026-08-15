DROP INDEX "outfit_brands_outfit_id_idx";--> statement-breakpoint
ALTER TABLE "outfit_brands" ADD CONSTRAINT "outfit_brands_outfit_id_brand_id_pk" PRIMARY KEY("outfit_id","brand_id");