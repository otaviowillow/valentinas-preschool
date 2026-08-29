export interface AnnouncementRecipientRow {
  email: string | null;
  childStatus: string;
  classId: number | null;
}

export interface AnnouncementEmailSummary {
  attempted: number;
  sent: number;
  failed: number;
}

interface EmailResult {
  ok: boolean;
}

export function selectAnnouncementRecipients(
  rows: AnnouncementRecipientRow[],
  classId: number | null
): string[] {
  const emails = rows
    .filter(
      (row) =>
        row.childStatus === 'enrolled' &&
        (classId === null || row.classId === classId) &&
        row.email
    )
    .map((row) => row.email!.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(emails)];
}

export async function sendAnnouncementEmails(
  recipients: string[],
  send: (to: string) => Promise<EmailResult>
): Promise<AnnouncementEmailSummary> {
  let sent = 0;

  for (const recipient of recipients) {
    const result = await send(recipient);
    if (result.ok) sent++;
  }

  return {
    attempted: recipients.length,
    sent,
    failed: recipients.length - sent,
  };
}
