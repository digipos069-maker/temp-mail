// Global In-Memory & File-backed Store for Temp Mail System

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  contentUrl?: string; // base64 or download link
}

export interface EmailMessage {
  id: string;
  inboxAddress: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  rawMime?: string;
  receivedAt: string; // ISO string
  isUnread: boolean;
  attachments: Attachment[];
  securityScore: {
    spfPass: boolean;
    dkimPass: boolean;
    dmarcPass: boolean;
    phishingRisk: 'safe' | 'warning' | 'critical';
    score: number; // 0 - 100
    notes: string[];
  };
}

export interface Inbox {
  address: string;
  prefix: string;
  domain: string;
  createdAt: string;
  expiresAt: string;
  ttlMinutes: number;
}

export const SUPPORTED_DOMAINS = [
  'temp-pulse.io',
  'disposta.net',
  'inboxpad.dev',
  'quickmail.box',
  'shadowbox.email'
];

// Global state container attached to globalThis to survive Next.js HMR in dev mode
const globalStore = globalThis as unknown as {
  inboxes: Map<string, Inbox>;
  messages: Map<string, EmailMessage[]>;
  listeners: Map<string, Set<(message: EmailMessage) => void>>;
};

if (!globalStore.inboxes) {
  globalStore.inboxes = new Map();
  globalStore.messages = new Map();
  globalStore.listeners = new Map();
}

export function generateRandomPrefix(): string {
  const adjectives = ['spark', 'cyber', 'shadow', 'quantum', 'pulse', 'swift', 'nexus', 'vortex', 'orbit', 'hyper'];
  const nouns = ['box', 'mail', 'node', 'wave', 'post', 'drop', 'net', 'vault', 'link', 'core'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomHex = Math.random().toString(36).substring(2, 6);
  return `${adj}.${noun}.${randomHex}`;
}

export function createInbox(customPrefix?: string, customDomain?: string, ttlMinutes: number = 60): Inbox {
  const prefix = (customPrefix || generateRandomPrefix()).toLowerCase().replace(/[^a-z0-9._-]/g, '');
  const domain = (customDomain && SUPPORTED_DOMAINS.includes(customDomain)) ? customDomain : SUPPORTED_DOMAINS[0];
  const address = `${prefix}@${domain}`;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

  const inbox: Inbox = {
    address,
    prefix,
    domain,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ttlMinutes
  };

  globalStore.inboxes.set(address, inbox);
  if (!globalStore.messages.has(address)) {
    globalStore.messages.set(address, []);
  }

  return inbox;
}

export function getInbox(address: string): Inbox | null {
  const normalized = address.toLowerCase().trim();
  const inbox = globalStore.inboxes.get(normalized);
  if (!inbox) return null;

  // Check if expired
  if (new Date(inbox.expiresAt).getTime() < Date.now()) {
    deleteInbox(normalized);
    return null;
  }
  return inbox;
}

export function extendInboxTtl(address: string, additionalMinutes: number = 30): Inbox | null {
  const inbox = getInbox(address);
  if (!inbox) return null;

  const currentExpiry = new Date(inbox.expiresAt).getTime();
  const newExpiry = new Date(currentExpiry + additionalMinutes * 60 * 1000);
  inbox.expiresAt = newExpiry.toISOString();
  globalStore.inboxes.set(inbox.address, inbox);
  return inbox;
}

export function deleteInbox(address: string): boolean {
  const normalized = address.toLowerCase().trim();
  globalStore.messages.delete(normalized);
  globalStore.listeners.delete(normalized);
  return globalStore.inboxes.delete(normalized);
}

export function getMessages(address: string): EmailMessage[] {
  const normalized = address.toLowerCase().trim();
  return globalStore.messages.get(normalized) || [];
}

export function addMessage(address: string, messageData: Partial<EmailMessage>): EmailMessage {
  const normalized = address.toLowerCase().trim();
  let inbox = getInbox(normalized);

  // Auto-create inbox if receiving message via webhook/SMTP
  if (!inbox) {
    const parts = normalized.split('@');
    inbox = createInbox(parts[0], parts[1] || SUPPORTED_DOMAINS[0]);
  }

  const message: EmailMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    inboxAddress: normalized,
    senderName: messageData.senderName || 'Unknown Sender',
    senderEmail: messageData.senderEmail || 'sender@example.com',
    subject: messageData.subject || '(No Subject)',
    bodyText: messageData.bodyText || '',
    bodyHtml: messageData.bodyHtml || `<div>${messageData.bodyText || ''}</div>`,
    rawMime: messageData.rawMime || '',
    receivedAt: new Date().toISOString(),
    isUnread: true,
    attachments: messageData.attachments || [],
    securityScore: messageData.securityScore || {
      spfPass: true,
      dkimPass: true,
      dmarcPass: true,
      phishingRisk: 'safe',
      score: 98,
      notes: ['Valid SPF signature', 'DKIM verified', 'Domain matches sender identity']
    }
  };

  const list = globalStore.messages.get(normalized) || [];
  list.unshift(message); // Newest first
  globalStore.messages.set(normalized, list);

  // Notify active SSE subscribers
  const listeners = globalStore.listeners.get(normalized);
  if (listeners) {
    listeners.forEach((callback) => callback(message));
  }

  return message;
}

export function markAsRead(address: string, messageId: string): void {
  const list = getMessages(address);
  const target = list.find(m => m.id === messageId);
  if (target) {
    target.isUnread = false;
  }
}

export function deleteMessage(address: string, messageId: string): boolean {
  const normalized = address.toLowerCase().trim();
  const list = getMessages(normalized);
  const filtered = list.filter(m => m.id !== messageId);
  globalStore.messages.set(normalized, filtered);
  return filtered.length !== list.length;
}

export function subscribeToInbox(address: string, callback: (message: EmailMessage) => void): () => void {
  const normalized = address.toLowerCase().trim();
  if (!globalStore.listeners.has(normalized)) {
    globalStore.listeners.set(normalized, new Set());
  }

  const set = globalStore.listeners.get(normalized)!;
  set.add(callback);

  return () => {
    set.delete(callback);
  };
}
