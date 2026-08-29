/** Family announcement email via Yahoo SMTP (Worker secret). */

import type { AnnouncementEmailSummary } from './announcements';

export function isFamilyEmailReady(env: Env): boolean {
  return Boolean(env.YAHOO_APP_PASSWORD);
}

export function familyEmailResultMessage(
  env: Env,
  summary: AnnouncementEmailSummary
): string {
  if (!isFamilyEmailReady(env)) {
    return 'Announcement posted. Email was not sent (sending is not configured).';
  }
  if (summary.attempted === 0) {
    return 'Announcement posted. No enrolled family email addresses matched.';
  }
  if (summary.failed > 0) {
    return `Announcement posted. Email sent to ${summary.sent} ${
      summary.sent === 1 ? 'recipient' : 'recipients'
    }; ${summary.failed} failed.`;
  }
  if (summary.sent === 1) {
    return 'Email sent successfully to 1 recipient. Announcement posted.';
  }
  return `Email sent successfully to ${summary.sent} recipients. Announcement posted.`;
}

export function holidayNoticeResultMessage(
  wantedEmail: boolean,
  env: Env,
  summary: AnnouncementEmailSummary
): string {
  if (!wantedEmail) return 'Holiday notice posted for families.';

  if (!isFamilyEmailReady(env)) {
    return 'Holiday notice posted. Email was not sent (sending is not configured).';
  }
  if (summary.attempted === 0) {
    return 'Holiday notice posted. No enrolled family email addresses matched.';
  }
  if (summary.failed > 0) {
    return `Holiday notice posted. Email sent to ${summary.sent} ${
      summary.sent === 1 ? 'family' : 'families'
    }; ${summary.failed} failed.`;
  }
  if (summary.sent === 1) {
    return 'Holiday notice posted and emailed to 1 family.';
  }
  return `Holiday notice posted and emailed to ${summary.sent} families.`;
}
