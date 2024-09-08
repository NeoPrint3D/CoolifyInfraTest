CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"status" varchar DEFAULT 'incomplete',
	"created_at" timestamp DEFAULT now() NOT NULL
);
