import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/store';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ success: true, status: 'webhook active' }, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Clean recipient email address (handles "Name <email@domain.com>" or raw email)
    const rawRecipient = body.recipient || body.to || body.inboxAddress || '';
    const recipientMatch = rawRecipient.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const recipient = recipientMatch ? recipientMatch[1].toLowerCase() : rawRecipient.toLowerCase().trim();

    const senderEmail = body.senderEmail || body.from || body.sender || 'unknown@domain.com';
    const senderName = body.senderName || body.fromName || senderEmail.split('@')[0];
    const subject = body.subject || '(No Subject)';
    const bodyText = body.text || body.bodyText || '';
    const bodyHtml = body.html || body.bodyHtml || `<div>${bodyText}</div>`;

    if (!recipient) {
      return NextResponse.json({ success: false, error: 'Recipient address required' }, { status: 400, headers: corsHeaders });
    }

    const message = addMessage(recipient, {
      senderEmail,
      senderName,
      subject,
      bodyText,
      bodyHtml,
      attachments: body.attachments || []
    });

    console.log(`[Webhook Received] Message ${message.id} added for ${recipient}`);

    return NextResponse.json({
      success: true,
      messageId: message.id,
      recipient: message.inboxAddress
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
