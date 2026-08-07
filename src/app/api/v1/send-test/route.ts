import { NextRequest, NextResponse } from 'next/server';
import { addMessage, EmailMessage } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetAddress = body.to || body.inboxAddress || 'test@tempomail.store';
    
    const sampleMessage: EmailMessage = {
      id: 'test_' + Math.random().toString(36).substring(2, 9),
      inboxAddress: targetAddress.toLowerCase(),
      senderName: body.senderName || 'Security Team',
      senderEmail: body.senderEmail || 'no-reply@security-center.org',
      subject: body.subject || 'Your Verification Code: ' + Math.floor(100000 + Math.random() * 900000),
      bodyText: body.bodyText || `Your security verification code is ${Math.floor(100000 + Math.random() * 900000)}. This code expires in 15 minutes.`,
      bodyHtml: body.bodyHtml || `<p>Your security verification code is <strong>${Math.floor(100000 + Math.random() * 900000)}</strong>.</p>`,
      receivedAt: new Date().toISOString(),
      isUnread: true,
      attachments: [],
      securityScore: {
        spfPass: true,
        dkimPass: true,
        dmarcPass: true,
        phishingRisk: 'safe',
        score: 98,
        notes: ['SPF Authorized', 'DKIM Valid']
      }
    };

    addMessage(targetAddress, sampleMessage);

    return NextResponse.json({ success: true, message: sampleMessage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
