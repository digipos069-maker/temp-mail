import { NextRequest, NextResponse } from 'next/server';
import { createInbox, SUPPORTED_DOMAINS } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { customPrefix, customDomain, ttlMinutes } = body;

    const inbox = createInbox(customPrefix, customDomain, ttlMinutes || 60);
    return NextResponse.json({
      success: true,
      inbox
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedDomains: SUPPORTED_DOMAINS,
    systemStatus: 'online',
    timestamp: new Date().toISOString()
  });
}
