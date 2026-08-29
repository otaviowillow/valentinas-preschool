import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../db';
import { selectAnnouncementRecipients } from './announcements';

export async function getAnnouncementRecipientEmails(
  db: ReturnType<typeof dbFrom>,
  classId: number | null
): Promise<string[]> {
  const rows = await db
    .select({
      email: schema.families.email,
      childStatus: schema.children.status,
      classId: schema.children.classId,
    })
    .from(schema.children)
    .innerJoin(
      schema.families,
      eq(schema.children.familyId, schema.families.id)
    )
    .where(eq(schema.children.status, 'enrolled'));

  return selectAnnouncementRecipients(rows, classId);
}
