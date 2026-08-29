import { connect } from 'cloudflare:sockets';

export const CONTACT_EMAIL = 'vanjagloginic@yahoo.com';

export interface EmailAttachment {
  filename: string;
  contentType: string;
  data: ArrayBuffer;
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail(
  env: Env,
  { to, subject, html, text, replyTo = CONTACT_EMAIL, attachments = [] }: SendArgs
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!env.YAHOO_APP_PASSWORD) return { ok: false, skipped: true };

  try {
    for (const recipient of Array.isArray(to) ? to : [to]) {
      await sendYahooMessage(env.YAHOO_APP_PASSWORD, {
        to: recipient,
        subject,
        html,
        text,
        replyTo,
        attachments,
      });
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function sendYahooMessage(
  appPassword: string,
  message: Omit<SendArgs, 'to'> & { to: string }
): Promise<void> {
  const socket = connect(
    { hostname: 'smtp.mail.yahoo.com', port: 465 },
    { secureTransport: 'on' }
  );
  await socket.opened;

  const smtp = new SmtpSession(socket.readable, socket.writable);
  try {
    await smtp.expect([220]);
    await smtp.command('EHLO valentinaspreschool.com', [250]);
    await smtp.command('AUTH LOGIN', [334]);
    await smtp.command(base64Utf8(CONTACT_EMAIL), [334]);
    await smtp.command(base64Utf8(appPassword.replace(/\s/g, '')), [235]);
    await smtp.command(`MAIL FROM:<${CONTACT_EMAIL}>`, [250]);
    await smtp.command(`RCPT TO:<${message.to}>`, [250, 251]);
    await smtp.command('DATA', [354]);
    await smtp.write(`${buildMimeMessage(message)}\r\n.\r\n`);
    await smtp.expect([250]);
    await smtp.command('QUIT', [221]);
  } finally {
    await socket.close();
  }
}

class SmtpSession {
  private readonly reader: ReadableStreamDefaultReader<Uint8Array>;
  private readonly writer: WritableStreamDefaultWriter<Uint8Array>;
  private readonly decoder = new TextDecoder();
  private readonly encoder = new TextEncoder();
  private buffer = '';

  constructor(
    readable: ReadableStream<Uint8Array>,
    writable: WritableStream<Uint8Array>
  ) {
    this.reader = readable.getReader();
    this.writer = writable.getWriter();
  }

  async command(command: string, expected: number[]): Promise<void> {
    await this.write(`${command}\r\n`);
    await this.expect(expected);
  }

  async write(value: string): Promise<void> {
    await this.writer.write(this.encoder.encode(value));
  }

  async expect(expected: number[]): Promise<void> {
    const { code, response } = await this.readResponse();
    if (!expected.includes(code)) {
      throw new Error(`Yahoo SMTP ${code}: ${response}`);
    }
  }

  private async readResponse(): Promise<{ code: number; response: string }> {
    while (true) {
      const match = this.buffer.match(/(?:^|\r\n)(\d{3}) ([^\r\n]*)\r\n/);
      if (match?.index !== undefined) {
        const end = match.index + match[0].length;
        const response = this.buffer.slice(0, end).trim();
        this.buffer = this.buffer.slice(end);
        return { code: Number(match[1]), response };
      }

      const { value, done } = await this.reader.read();
      if (done) throw new Error('Yahoo SMTP closed the connection unexpectedly.');
      this.buffer += this.decoder.decode(value, { stream: true });
    }
  }
}

function buildMimeMessage({
  to,
  subject,
  html,
  text,
  replyTo,
  attachments = [],
}: Omit<SendArgs, 'to'> & { to: string }): string {
  const alternativeBoundary = `vp-alt-${crypto.randomUUID()}`;
  const headers = [
    `From: ${encodeHeader("Valentina's Preschool")} <${CONTACT_EMAIL}>`,
    `To: <${to}>`,
    `Reply-To: <${replyTo}>`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
  ];
  const alternative = [
    `--${alternativeBoundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(base64Utf8(text)),
    `--${alternativeBoundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(base64Utf8(html)),
    `--${alternativeBoundary}--`,
  ];

  if (attachments.length === 0) {
    return [
      ...headers,
      `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
      '',
      ...alternative,
    ]
      .join('\r\n')
      .replace(/^\./gm, '..');
  }

  const mixedBoundary = `vp-mixed-${crypto.randomUUID()}`;
  const lines = [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
    '',
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
    '',
    ...alternative,
  ];

  for (const attachment of attachments) {
    const filename = attachment.filename.replace(/[\r\n"]/g, '_');
    lines.push(
      `--${mixedBoundary}`,
      `Content-Type: ${attachment.contentType}; name="${filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
        attachment.filename
      )}`,
      '',
      wrapBase64(base64Bytes(new Uint8Array(attachment.data)))
    );
  }

  lines.push(`--${mixedBoundary}--`);

  return lines.join('\r\n').replace(/^\./gm, '..');
}

function base64Bytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encodeHeader(value: string): string {
  return `=?UTF-8?B?${base64Utf8(value)}?=`;
}

function base64Utf8(value: string): string {
  return base64Bytes(new TextEncoder().encode(value));
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join('\r\n') ?? '';
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
