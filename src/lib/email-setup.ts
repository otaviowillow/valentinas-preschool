/** Family announcement email via Resend (Worker secret). */

export function isFamilyEmailReady(env: Env): boolean {
  return Boolean(env.RESEND_API_KEY);
}

export function familyEmailResultMessage(
  wantedEmail: boolean,
  env: Env,
  recipientCount: number
): string {
  if (!wantedEmail) return 'Announcement posted.';

  if (!isFamilyEmailReady(env)) {
    return 'Announcement posted. Email was not sent (sending is not configured).';
  }
  if (recipientCount === 0) {
    return 'Announcement posted. No family email addresses on file to send to.';
  }
  if (recipientCount === 1) {
    return 'Announcement posted and emailed to 1 family.';
  }
  return `Announcement posted and emailed to ${recipientCount} families.`;
}

export function holidayNoticeResultMessage(
  wantedEmail: boolean,
  env: Env,
  recipientCount: number
): string {
  if (!wantedEmail) return 'Holiday notice posted for families.';

  if (!isFamilyEmailReady(env)) {
    return 'Holiday notice posted. Email was not sent (sending is not configured).';
  }
  if (recipientCount === 0) {
    return 'Holiday notice posted. No family email addresses on file to send to.';
  }
  if (recipientCount === 1) {
    return 'Holiday notice posted and emailed to 1 family.';
  }
  return `Holiday notice posted and emailed to ${recipientCount} families.`;
}
