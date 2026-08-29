import { z } from 'zod';

const trimOrEmpty = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value == null ? '' : value;

const emptyToUndefined = (value: unknown) => {
  const trimmed = trimOrEmpty(value);
  return trimmed === '' ? undefined : trimmed;
};

export const announcementInput = z
  .object({
    title: z.preprocess(
      trimOrEmpty,
      z.string().min(1, 'Title is required').max(200)
    ),
    body: z.preprocess(
      trimOrEmpty,
      z.string().min(1, 'Message is required').max(5000)
    ),
    audience: z
      .preprocess(emptyToUndefined, z.enum(['all', 'class']))
      .catch('all'),
    classId: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().positive().optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.audience === 'class' && !data.classId) {
      ctx.addIssue({
        code: 'custom',
        path: ['classId'],
        message: 'Choose a class',
      });
    }
  });
