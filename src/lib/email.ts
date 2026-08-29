import { connect } from 'cloudflare:sockets';

export const CONTACT_EMAIL = 'vanjagloginic@yahoo.com';

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(
  env: Env,
  { to, subject, html, text, replyTo = CONTACT_EMAIL }: SendArgs
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
}: Omit<SendArgs, 'to'> & { to: string }): string {
  const boundary = `vp-${crypto.randomUUID()}`;
  const lines = [
    `From: ${encodeHeader("Valentina's Preschool")} <${CONTACT_EMAIL}>`,
    `To: <${to}>`,
    `Reply-To: <${replyTo}>`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(base64Utf8(text)),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(base64Utf8(html)),
    `--${boundary}--`,
  ];

  return lines.join('\r\n').replace(/^\./gm, '..');
}

function encodeHeader(value: string): string {
  return `=?UTF-8?B?${base64Utf8(value)}?=`;
}

function base64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
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
