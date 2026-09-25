ALTER TABLE `inquiries` ADD `is_spam` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `spam_score` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `spam_reasons` text;
