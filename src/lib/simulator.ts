import { addMessage, EmailMessage } from './store';

export type PresetTemplate = 'otp' | 'welcome' | 'invoice' | 'newsletter' | 'security';

export function triggerSimulatedEmail(targetAddress: string, templateType: PresetTemplate): EmailMessage {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  switch (templateType) {
    case 'otp': {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      return addMessage(targetAddress, {
        senderName: 'GitHub Security',
        senderEmail: 'noreply@github.com',
        subject: `[GitHub] Your authentication code is ${otpCode}`,
        bodyText: `Your verification code for GitHub is ${otpCode}. It will expire in 10 minutes. Do not share this code with anyone.`,
        bodyHtml: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #c9d1d9; border-radius: 12px; padding: 32px; border: 1px solid #30363d;">
            <div style="text-align: center; margin-bottom: 24px;">
              <svg height="40" viewBox="0 0 16 16" width="40" style="fill: #f0f6fc;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
            </div>
            <h2 style="color: #f0f6fc; text-align: center; font-size: 22px; margin-bottom: 8px;">Device Verification Code</h2>
            <p style="text-align: center; color: #8b949e; margin-bottom: 24px;">Please enter the code below to complete your sign-in request.</p>
            <div style="background: #161b22; border: 2px dashed #388bfd; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #58a6ff;">${otpCode}</span>
            </div>
            <p style="font-size: 13px; color: #8b949e; text-align: center;">This code will expire in <strong>10 minutes</strong>. If you did not initiate this request, please change your password immediately.</p>
            <hr style="border: none; border-top: 1px solid #30363d; margin: 24px 0;" />
            <p style="font-size: 12px; color: #484f58; text-align: center;">Sent to ${targetAddress} • GitHub Inc. 88 Colin P Kelly Jr St, San Francisco, CA</p>
          </div>
        `,
        securityScore: {
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
          phishingRisk: 'safe',
          score: 100,
          notes: ['SPF record verified (github.com)', 'DKIM signature valid', 'DMARC policy strict']
        }
      });
    }

    case 'welcome': {
      return addMessage(targetAddress, {
        senderName: 'Vercel Team',
        senderEmail: 'welcome@vercel.com',
        subject: '🚀 Welcome to Vercel - Deployment Superpowers Unleashed',
        bodyText: `Welcome to Vercel! You're ready to deploy your modern web applications with zero configuration. Get started by pushing your repository to GitHub.`,
        bodyHtml: `
          <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; border-radius: 16px; padding: 40px; border: 1px solid #333;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
              <span style="font-weight: 800; font-size: 24px; letter-spacing: -1px;">▲ Vercel</span>
              <span style="background: #111; color: #0070f3; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid #0070f3;">Pro Account</span>
            </div>
            <h1 style="font-size: 28px; font-weight: 700; line-height: 1.3; margin-bottom: 16px; background: linear-gradient(180deg, #fff 0%, #a1a1a1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Your high-speed cloud platform is live</h1>
            <p style="color: #888; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Deploy Next.js, React, and serverless architectures in seconds with automatic SSL, preview deployments, and global edge CDN performance.</p>
            <div style="background: #111; border-radius: 12px; padding: 20px; border: 1px solid #222; margin-bottom: 32px;">
              <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Active Workspace</div>
              <div style="font-size: 18px; font-weight: 600; color: #0070f3;">${targetAddress.split('@')[0]}-workspace</div>
            </div>
            <a href="#" style="display: inline-block; background: #fff; color: #000; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 15px;">Import Git Repository →</a>
          </div>
        `,
        securityScore: {
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
          phishingRisk: 'safe',
          score: 96,
          notes: ['SPF verified', 'DKIM verified', 'Trusted domain']
        }
      });
    }

    case 'invoice': {
      const invoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
      return addMessage(targetAddress, {
        senderName: 'Stripe Invoicing',
        senderEmail: 'invoices@stripe.com',
        subject: `Receipt for your subscription (${invoiceId}) - $49.00`,
        bodyText: `Your payment of $49.00 to CloudScale AI Services was successful. Receipt ID: ${invoiceId}.`,
        bodyHtml: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 32px; border: 1px solid #1e293b;">
            <div style="border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="margin: 0; color: #6366f1; font-size: 20px; font-weight: bold;">CloudScale AI</h3>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Receipt #${invoiceId}</p>
              </div>
              <span style="background: #10b98120; color: #34d399; font-weight: 600; font-size: 13px; padding: 6px 14px; border-radius: 20px; border: 1px solid #10b98140;">PAID</span>
            </div>
            <p style="color: #cbd5e1; font-size: 15px;">Hi there, thank you for your business! Below is your payment summary for <strong>Pro Developer Plan</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; color: #e2e8f0; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 1px solid #334155; text-align: left;">
                  <th style="padding: 10px 0; color: #94a3b8;">Description</th>
                  <th style="padding: 10px 0; color: #94a3b8; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px 0;">Pro Developer Tier (Monthly Subscription)</td>
                  <td style="padding: 12px 0; text-align: right;">$49.00</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: bold;">Total Paid</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #6366f1; font-size: 18px;">$49.00 USD</td>
                </tr>
              </tbody>
            </table>
            <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 13px; color: #94a3b8;">
              Paid with Visa ending in 4242 on ${dateStr}.
            </div>
          </div>
        `,
        attachments: [
          {
            id: `att_${Date.now()}`,
            filename: `${invoiceId}_Receipt.pdf`,
            contentType: 'application/pdf',
            size: 124500,
          }
        ],
        securityScore: {
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
          phishingRisk: 'safe',
          score: 99,
          notes: ['Stripe payment signatures valid', 'No malicious links detected']
        }
      });
    }

    case 'security': {
      return addMessage(targetAddress, {
        senderName: 'Google Security Alert',
        senderEmail: 'no-reply@accounts.google.com',
        subject: '⚠️ New login attempt detected from Chrome on macOS',
        bodyText: `A new sign-in was detected for your account from macOS in San Jose, CA. If this was you, you don't need to do anything.`,
        bodyHtml: `
          <div style="font-family: Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #202124; color: #e8eaed; border-radius: 12px; padding: 32px; border: 1px solid #3c4043;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="background: #ea433520; padding: 10px; border-radius: 50%;">
                <span style="font-size: 24px;">🛡️</span>
              </div>
              <div>
                <h3 style="margin: 0; color: #f28b82; font-size: 18px;">Security Alert</h3>
                <p style="margin: 0; color: #9aa0a6; font-size: 13px;">Google Account</p>
              </div>
            </div>
            <h2 style="font-size: 20px; margin-bottom: 16px;">New sign-in to your linked email address</h2>
            <p style="color: #bdc1c6; line-height: 1.5; font-size: 14px;">We noticed a new sign-in to your account on a Mac device at <strong>${timestamp}</strong>.</p>
            <div style="background: #292a2d; border-left: 4px solid #f28b82; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <div style="font-weight: bold; margin-bottom: 4px;">Details:</div>
              <div style="font-size: 13px; color: #9aa0a6;">Device: Chrome on macOS Big Sur</div>
              <div style="font-size: 13px; color: #9aa0a6;">Location: San Jose, CA (IP: 192.0.2.45)</div>
            </div>
            <p style="font-size: 13px; color: #bdc1c6;">If this was you, you can ignore this email. If this wasn't you, check your recent activity and secure your account immediately.</p>
          </div>
        `,
        securityScore: {
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
          phishingRisk: 'safe',
          score: 95,
          notes: ['Google accounts SPF pass', 'DKIM verified']
        }
      });
    }

    case 'newsletter':
    default: {
      return addMessage(targetAddress, {
        senderName: 'TLDR Tech Digest',
        senderEmail: 'dan@tldrtech.com',
        subject: '⚡ AI Breakthroughs, Next.js 15 Features & Modern Web Trends',
        bodyText: `TLDR Tech Digest: Today's top tech news covering AI autonomous agents, browser execution engines, and frontend optimization.`,
        bodyHtml: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #f3f4f6; border-radius: 12px; padding: 32px; border: 1px solid #1f2937;">
            <div style="border-bottom: 2px solid #8b5cf6; padding-bottom: 16px; margin-bottom: 24px; text-align: center;">
              <span style="font-weight: 900; font-size: 26px; color: #a78bfa; letter-spacing: -0.5px;">TLDR TECH</span>
              <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px;">Daily byte-sized news for developers • ${dateStr}</p>
            </div>
            <h3 style="color: #60a5fa; margin-bottom: 8px;">1. Next.js 15 introduces React 19 Support</h3>
            <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">The Next.js team announced full support for React 19 Async Server Components, improving build speeds by 40% and offering zero-config caching primitives.</p>
            <h3 style="color: #60a5fa; margin-bottom: 8px;">2. Autonomous AI Coding Agents reach 95% SWE-Bench Benchmark</h3>
            <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">New multi-agent orchestrators are handling entire software engineering lifecycles including testing, refactoring, and automated deployment.</p>
            <div style="text-align: center; margin-top: 32px;">
              <a href="#" style="background: #8b5cf6; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px;">Read Full Edition Online →</a>
            </div>
          </div>
        `,
        securityScore: {
          spfPass: true,
          dkimPass: true,
          dmarcPass: true,
          phishingRisk: 'safe',
          score: 92,
          notes: ['Newsletter domain verified']
        }
      });
    }
  }
}
