CREATE TABLE "memories" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
