import { NextRequest, NextResponse } from 'next/server';
import { getInbox, deleteInbox, extendInboxTtl } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const inbox = getInbox(address);

  if (!inbox) {
    return NextResponse.json({ success: false, error: 'Inbox not found or expired' }, { status: 404 });
  }

  return NextResponse.json({ success: true, inbox });
}

export async function PATCH(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const body = await req.json().catch(() => ({}));
  const additionalMinutes = body.additionalMinutes || 30;

  const inbox = extendInboxTtl(address, additionalMinutes);
  if (!inbox) {
    return NextResponse.json({ success: false, error: 'Inbox not found or expired' }, { status: 404 });
  }

  return NextResponse.json({ success: true, inbox });
}

export async function DELETE(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const deleted = deleteInbox(address);

  return NextResponse.json({ success: deleted, message: deleted ? 'Inbox deleted' : 'Inbox not found' });
}
