import { asc, eq } from 'drizzle-orm';
import { dbFrom, schema } from '../db';
import type { Holiday } from '../db/schema';

export const DEFAULT_HOLIDAY_TITLE =
  'Holiday schedule for October 2024 – October 2025';

export const DEFAULT_HOLIDAY_INTRO =
  'The school will be closed on the following days for holidays and vacation.\nTuition is required year-round.';

/** Initial schedule — seeded by migration; used as fallback if the table is empty. */
export const DEFAULT_HOLIDAYS: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>[] =
  [
    { name: 'Veterans Day', startDate: '2025-11-11', endDate: null },
    {
      name: 'Thanksgiving Holiday',
      startDate: '2025-11-27',
      endDate: '2025-11-28',
    },
    {
      name: 'Christmas Holiday',
      startDate: '2025-12-22',
      endDate: '2025-12-26',
    },
    { name: "New Year's Day", startDate: '2026-01-01', endDate: null },
    {
      name: 'Martin Luther King Day',
      startDate: '2026-01-19',
      endDate: null,
    },
    { name: "President's Day", startDate: '2026-02-16', endDate: null },
    { name: 'Spring break', startDate: '2026-03-30', endDate: '2026-04-03' },
    { name: 'Memorial Day', startDate: '2026-05-25', endDate: null },
    { name: 'Juneteenth', startDate: '2026-06-19', endDate: null },
    { name: 'Independence Day', startDate: '2026-07-03', endDate: null },
    {
      name: 'Summer break',
      startDate: '2026-08-10',
      endDate: '2026-08-14',
    },
    { name: 'Labor Day', startDate: '2026-09-07', endDate: null },
  ];

export interface HolidaySchedule {
  title: string;
  intro: string;
  holidays: Pick<Holiday, 'id' | 'name' | 'startDate' | 'endDate'>[];
}

function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

/** e.g. "November 11, 2025" or "November 27–28, 2025" */
export function formatHolidayDates(
  startDate: string,
  endDate: string | null | undefined
): string {
  const start = parseIsoDate(startDate);
  if (!endDate || endDate === startDate) {
    return start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const end = parseIsoDate(endDate);
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    const month = start.toLocaleDateString('en-US', { month: 'long' });
    return `${month} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  const startStr = start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}

export function formatHolidayLine(
  holiday: Pick<Holiday, 'name' | 'startDate' | 'endDate'>
): string {
  return `${holiday.name} — ${formatHolidayDates(holiday.startDate, holiday.endDate)}`;
}

export function buildHolidayNoticeBody(schedule: HolidaySchedule): string {
  const lines = [
    schedule.intro.trim(),
    '',
    ...schedule.holidays.map((h) => formatHolidayLine(h)),
  ];
  return lines.join('\n');
}

export function buildHolidayFaqAnswer(schedule: HolidaySchedule): string {
  const lines = [
    schedule.title.trim(),
    '',
    schedule.intro.trim(),
    '',
    ...schedule.holidays.map((h) => `• ${formatHolidayLine(h)}`),
  ];
  return lines.join('\n');
}

export async function getHolidaySchedule(): Promise<HolidaySchedule> {
  try {
    const db = dbFrom();
    const [settingsRow] = await db
      .select({
        title: schema.settings.holidayScheduleTitle,
        intro: schema.settings.holidayScheduleIntro,
      })
      .from(schema.settings)
      .where(eq(schema.settings.id, 1));

    const rows = await db
      .select({
        id: schema.holidays.id,
        name: schema.holidays.name,
        startDate: schema.holidays.startDate,
        endDate: schema.holidays.endDate,
      })
      .from(schema.holidays)
      .orderBy(asc(schema.holidays.startDate));

    const holidays =
      rows.length > 0
        ? rows
        : DEFAULT_HOLIDAYS.map((h, i) => ({ id: i + 1, ...h }));

    return {
      title: settingsRow?.title ?? DEFAULT_HOLIDAY_TITLE,
      intro: settingsRow?.intro ?? DEFAULT_HOLIDAY_INTRO,
      holidays,
    };
  } catch {
    return {
      title: DEFAULT_HOLIDAY_TITLE,
      intro: DEFAULT_HOLIDAY_INTRO,
      holidays: DEFAULT_HOLIDAYS.map((h, i) => ({ id: i + 1, ...h })),
    };
  }
}
