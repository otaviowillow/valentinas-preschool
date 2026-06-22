CREATE TABLE `recurring_invoices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`family_id` integer NOT NULL,
	`child_id` integer,
	`amount_cents` integer NOT NULL,
	`description` text,
	`frequency` text DEFAULT 'monthly' NOT NULL,
	`next_run_date` text NOT NULL,
	`last_run_date` text,
	`auto_send` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`family_id`) REFERENCES `families`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE no action
);
