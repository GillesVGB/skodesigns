CREATE TABLE `review_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`next_allowed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rating` integer NOT NULL,
	`body` text NOT NULL,
	`language` text NOT NULL,
	`created_at` integer NOT NULL
);
