import { NextRequest, NextResponse } from 'next/server';
import { triggerSimulatedEmail, PresetTemplate } from '@/lib/simulator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, template } = body;

    if (!address) {
      return NextResponse.json({ success: false, error: 'Target inbox address required' }, { status: 400 });
    }

    const validTemplate: PresetTemplate = ['otp', 'welcome', 'invoice', 'newsletter', 'security'].includes(template)
      ? template
      : 'otp';

    const message = triggerSimulatedEmail(address, validTemplate);

    return NextResponse.json({
      success: true,
      message: 'Test email generated successfully',
      email: message
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
