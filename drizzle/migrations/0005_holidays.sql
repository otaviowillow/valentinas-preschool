CREATE TABLE `holidays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `settings` ADD `holiday_schedule_title` text DEFAULT 'Holiday schedule' NOT NULL;
--> statement-breakpoint
ALTER TABLE `settings` ADD `holiday_schedule_intro` text DEFAULT 'The school will be closed on the following days for holidays and vacation. Tuition is required year-round.' NOT NULL;
--> statement-breakpoint
INSERT INTO `settings` (
	`id`,
	`capacity`,
	`weekly_from`,
	`application_fee`,
	`part_time_label`,
	`part_time_price`,
	`part_time_note`,
	`full_time_label`,
	`full_time_note`,
	`sibling_discount`,
	`subsidies_accepted`,
	`holiday_schedule_title`,
	`holiday_schedule_intro`
)
SELECT
	1,
	12,
	350,
	300,
	'Part-time',
	'Contact us',
	'2 or 3 days / week',
	'Full-time',
	'5 days / week, full day',
	1,
	1,
	'Holiday schedule for October 2024 – October 2025',
	'The school will be closed on the following days for holidays and vacation. Tuition is required year-round.'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `id` = 1);
--> statement-breakpoint
UPDATE `settings`
SET
	`holiday_schedule_title` = 'Holiday schedule for October 2024 – October 2025',
	`holiday_schedule_intro` = 'The school will be closed on the following days for holidays and vacation. Tuition is required year-round.'
WHERE `id` = 1;
--> statement-breakpoint
INSERT INTO `holidays` (`name`, `start_date`, `end_date`) VALUES
	('Veterans Day', '2025-11-11', NULL),
	('Thanksgiving Holiday', '2025-11-27', '2025-11-28'),
	('Christmas Holiday', '2025-12-22', '2025-12-26'),
	('New Year''s Day', '2026-01-01', NULL),
	('Martin Luther King Day', '2026-01-19', NULL),
	('President''s Day', '2026-02-16', NULL),
	('Spring break', '2026-03-30', '2026-04-03'),
	('Memorial Day', '2026-05-25', NULL),
	('Juneteenth', '2026-06-19', NULL),
	('Independence Day', '2026-07-03', NULL),
	('Summer break', '2026-08-10', '2026-08-14'),
	('Labor Day', '2026-09-07', NULL);
