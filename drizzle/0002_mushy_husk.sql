ALTER TABLE `store_items` ADD `title_nl` text;--> statement-breakpoint
ALTER TABLE `store_items` ADD `title_en` text;--> statement-breakpoint
ALTER TABLE `store_items` ADD `title_fr` text;--> statement-breakpoint
ALTER TABLE `store_items` ADD `kind` text DEFAULT 'single' NOT NULL;--> statement-breakpoint
ALTER TABLE `store_items` ADD `quantity` integer;