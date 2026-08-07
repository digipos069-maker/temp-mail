import { NextRequest } from 'next/server';
import { subscribeToInbox, EmailMessage } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address).toLowerCase();

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Send initial connected ping
  writer.write(encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected', address })}\n\n`));

  // Subscribe to store events for this inbox
  const unsubscribe = subscribeToInbox(address, (newMessage: EmailMessage) => {
    try {
      const payload = `event: new_mail\ndata: ${JSON.stringify(newMessage)}\n\n`;
      writer.write(encoder.encode(payload));
    } catch (err) {
      console.error('Error writing to SSE stream:', err);
    }
  });

  // Keep-alive heartbeat interval every 15s
  const interval = setInterval(() => {
    try {
      writer.write(encoder.encode(`event: ping\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`));
    } catch {
      clearInterval(interval);
    }
  }, 15000);

  // Clean up on disconnect
  req.signal.addEventListener('abort', () => {
    clearInterval(interval);
    unsubscribe();
    writer.close().catch(() => {});
  });

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
