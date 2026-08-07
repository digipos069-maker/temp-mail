const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const http = require('http');

const PORT = process.env.SMTP_PORT || 2525;

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ['AUTH'],
  onData(stream, session, callback) {
    simpleParser(stream, async (err, parsed) => {
      if (err) {
        console.error('Error parsing incoming SMTP stream:', err);
        return callback(err);
      }

      const recipient = session.envelope.rcptTo[0]?.address || parsed.to?.text;
      const sender = session.envelope.mailFrom?.address || parsed.from?.text;

      console.log(`[SMTP Received] To: ${recipient} | From: ${sender} | Subject: ${parsed.subject}`);

      const payload = JSON.stringify({
        recipient,
        senderEmail: sender,
        senderName: parsed.from?.value[0]?.name || sender,
        subject: parsed.subject || '(No Subject)',
        text: parsed.text || '',
        html: parsed.html || parsed.textAsHtml || `<div>${parsed.text || ''}</div>`,
        attachments: (parsed.attachments || []).map((att) => ({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          filename: att.filename || 'attachment.bin',
          contentType: att.contentType,
          size: att.size
        }))
      });

      // Post to Next.js webhook endpoint
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/v1/webhook',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (res) => {
          console.log(`[SMTP Forwarded to Webhook] Status: ${res.statusCode}`);
        }
      );

      req.on('error', (e) => {
        console.error(`[SMTP Webhook Error]: ${e.message}`);
      });

      req.write(payload);
      req.end();

      callback();
    });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 [Temp Mail SMTP Server] Listening on port ${PORT}...`);
  console.log(`📫 You can send test emails directly to localhost:${PORT}`);
});
