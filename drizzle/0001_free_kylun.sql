CREATE TABLE `hidden_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`image` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`featured` integer NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `staff_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`token_cipher` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description_nl` text NOT NULL,
	`description_en` text NOT NULL,
	`description_fr` text NOT NULL,
	`price` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
