import { NextRequest, NextResponse } from 'next/server';
import { getMessages, getInbox, markAsRead, deleteMessage } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const inbox = getInbox(address);

  if (!inbox) {
    return NextResponse.json({ success: false, error: 'Inbox not found or expired' }, { status: 404 });
  }

  const messages = getMessages(address);
  return NextResponse.json({
    success: true,
    address,
    count: messages.length,
    messages
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const body = await req.json().catch(() => ({}));

  if (body.messageId && body.action === 'mark_read') {
    markAsRead(address, body.messageId);
    return NextResponse.json({ success: true, messageId: body.messageId });
  }

  return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
}

export async function DELETE(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get('id');

  if (!messageId) {
    return NextResponse.json({ success: false, error: 'Message ID required' }, { status: 400 });
  }

  const deleted = deleteMessage(address, messageId);
  return NextResponse.json({ success: deleted });
}
