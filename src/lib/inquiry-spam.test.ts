import { describe, expect, it } from 'vitest';
import { detectIntakeSpam } from './spam';
import { createInquiryInput } from './validation';

const validInquiry = {
  parentName: 'Valentina Smith',
  email: 'valentina@example.com',
  phone: '3105551234',
  childAge: 36,
  desiredStart: '2026-10-15',
  intent: 'tour' as const,
  message: 'We would like to schedule a tour for our child.',
};

describe('public inquiry validation', () => {
  const schema = createInquiryInput(15, 60);

  it('requires both email and phone', () => {
    expect(schema.safeParse({ ...validInquiry, email: '' }).success).toBe(false);
    expect(schema.safeParse({ ...validInquiry, phone: '' }).success).toBe(false);
  });

  it('rejects children older than four years', () => {
    expect(schema.safeParse({ ...validInquiry, childAge: 48 }).success).toBe(true);
    expect(schema.safeParse({ ...validInquiry, childAge: 49 }).success).toBe(false);
  });
});

describe('inquiry spam scoring', () => {
  it('leaves a normal family inquiry unflagged', () => {
    expect(detectIntakeSpam(validInquiry)).toEqual({
      spam: false,
      score: 0,
      reasons: [],
    });
  });

  it('flags marketing pitches and links for admin review', () => {
    const result = detectIntakeSpam({
      ...validInquiry,
      message: 'Our digital marketing agency can help. Visit https://spam.example.com.',
    });

    expect(result.spam).toBe(true);
    expect(result.reasons).toContain('phrase:digital marketing');
    expect(result.reasons).toContain('url_in_message');
  });

  it('flags implausible phone numbers', () => {
    const result = detectIntakeSpam({
      ...validInquiry,
      phone: '1234567890',
    });

    expect(result.spam).toBe(true);
    expect(result.reasons).toContain('implausible_phone');
  });
});
