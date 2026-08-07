import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Standardized inbound payload format
    const recipient = body.recipient || body.to || body.inboxAddress;
    const senderEmail = body.senderEmail || body.from || body.sender || 'unknown@domain.com';
    const senderName = body.senderName || body.fromName || senderEmail.split('@')[0];
    const subject = body.subject || '(No Subject)';
    const bodyText = body.text || body.bodyText || '';
    const bodyHtml = body.html || body.bodyHtml || `<div>${bodyText}</div>`;

    if (!recipient) {
      return NextResponse.json({ success: false, error: 'Recipient address required' }, { status: 400 });
    }

    const message = addMessage(recipient, {
      senderEmail,
      senderName,
      subject,
      bodyText,
      bodyHtml,
      attachments: body.attachments || []
    });

    return NextResponse.json({
      success: true,
      messageId: message.id,
      recipient: message.inboxAddress
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
