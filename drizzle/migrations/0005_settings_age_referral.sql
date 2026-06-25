ALTER TABLE `settings` ADD `age_min_months` integer DEFAULT 15 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `age_max_months` integer DEFAULT 60 NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `tuition_note` text DEFAULT 'Pricing varies by schedule (2, 3, or 5 days). Contact us for current rates.' NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `sibling_discount_note` text DEFAULT 'Please contact us for sibling discount details.' NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `referral_enabled` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `referral_title` text DEFAULT 'Refer a family, you both win' NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `referral_body` text DEFAULT 'Know a family who would love it here? When they enroll, your application fee is waived and your first week is free.' NOT NULL;
