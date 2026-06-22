CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`email` text,
	`phone` text,
	`pay_type` text DEFAULT 'hourly' NOT NULL,
	`pay_rate_cents` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`hire_date` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payroll_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`period_label` text,
	`hours` integer,
	`gross_cents` integer NOT NULL,
	`method` text,
	`paid_at` integer,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`capacity` integer DEFAULT 12 NOT NULL,
	`weekly_from` integer DEFAULT 350 NOT NULL,
	`application_fee` integer DEFAULT 300 NOT NULL,
	`part_time_label` text DEFAULT 'Part-time' NOT NULL,
	`part_time_price` text DEFAULT 'Contact us' NOT NULL,
	`part_time_note` text DEFAULT '2 or 3 days / week' NOT NULL,
	`full_time_label` text DEFAULT 'Full-time' NOT NULL,
	`full_time_note` text DEFAULT '5 days / week, full day' NOT NULL,
	`sibling_discount` integer DEFAULT true NOT NULL,
	`subsidies_accepted` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
