import { describe, expect, it, vi } from 'vitest';
import {
  selectAnnouncementRecipients,
  sendAnnouncementEmails,
} from './announcements';
import { announcementInput } from './announcement-validation';

describe('selectAnnouncementRecipients', () => {
  const rows = [
    { email: 'Parent@example.com', childStatus: 'enrolled', classId: 1 },
    { email: 'parent@example.com', childStatus: 'enrolled', classId: 2 },
    { email: 'old@example.com', childStatus: 'withdrawn', classId: 1 },
    { email: 'graduate@example.com', childStatus: 'graduated', classId: 1 },
    { email: null, childStatus: 'enrolled', classId: 1 },
  ];

  it('returns unique enrolled family emails', () => {
    expect(selectAnnouncementRecipients(rows, null)).toEqual([
      'parent@example.com',
    ]);
  });

  it('filters enrolled families by class', () => {
    expect(selectAnnouncementRecipients(rows, 1)).toEqual([
      'parent@example.com',
    ]);
    expect(selectAnnouncementRecipients(rows, 3)).toEqual([]);
  });
});

describe('announcementInput', () => {
  it('requires a class for class announcements', () => {
    const result = announcementInput.safeParse({
      title: 'Reminder',
      body: 'Bring a jacket.',
      audience: 'class',
      classId: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('sendAnnouncementEmails', () => {
  it('reports partial provider failures', async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: false });

    await expect(
      sendAnnouncementEmails(['one@example.com', 'two@example.com'], send)
    ).resolves.toEqual({ attempted: 2, sent: 1, failed: 1 });
  });
});
