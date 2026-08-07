import { NextRequest, NextResponse } from 'next/server';
import { getInbox, deleteInbox } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  try {
    const address = decodeURIComponent(params.address);
    const inbox = getInbox(address);
    if (!inbox) {
      return NextResponse.json({ success: false, error: 'Inbox not found or expired' }, { status: 404 });
    }
    return NextResponse.json({ success: true, inbox });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { address: string } }) {
  try {
    const address = decodeURIComponent(params.address);
    const deleted = deleteInbox(address);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
