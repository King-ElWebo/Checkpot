CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"subject_hash" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"request_count" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rate_limits_scope_subject_idx" ON "rate_limits" USING btree ("scope","subject_hash");--> statement-breakpoint
CREATE INDEX "rate_limits_expires_at_idx" ON "rate_limits" USING btree ("expires_at");