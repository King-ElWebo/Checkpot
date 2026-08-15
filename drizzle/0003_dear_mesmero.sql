CREATE TABLE "outfit_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outfit_categories_group_slug_idx" UNIQUE("group_id","slug")
);
--> statement-breakpoint
CREATE TABLE "outfit_category_assignments" (
	"outfit_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "outfit_category_assignments_outfit_id_category_id_pk" PRIMARY KEY("outfit_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "outfit_category_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outfit_category_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "outfit_categories" ADD CONSTRAINT "outfit_categories_group_id_outfit_category_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."outfit_category_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_category_assignments" ADD CONSTRAINT "outfit_category_assignments_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_category_assignments" ADD CONSTRAINT "outfit_category_assignments_category_id_outfit_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."outfit_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "outfit_categories_group_id_idx" ON "outfit_categories" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "outfit_category_assignments_category_id_idx" ON "outfit_category_assignments" USING btree ("category_id");