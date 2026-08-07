import { NextRequest, NextResponse } from 'next/server';
import { createInbox } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, message: 'Inbox API Endpoint' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prefix = body.prefix || undefined;
    const domain = body.domain || undefined;
    const ttlMinutes = body.ttlMinutes || 15;

    const inbox = createInbox(prefix, domain, ttlMinutes);
    return NextResponse.json({ success: true, inbox });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
