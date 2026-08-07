'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { InboxControls } from '@/components/InboxControls';
import { InboxList } from '@/components/InboxList';
import { EmailViewer } from '@/components/EmailViewer';
import { TestSimulatorModal } from '@/components/TestSimulatorModal';
import { QrCodeModal } from '@/components/QrCodeModal';
import { ApiDocsModal } from '@/components/ApiDocsModal';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { Footer } from '@/components/Footer';
import { Inbox, EmailMessage } from '@/lib/store';

export default function HomePage() {
  const [currentInbox, setCurrentInbox] = useState<Inbox | null>(null);
  const [activeInboxes, setActiveInboxes] = useState<Inbox[]>([]);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);

  // Modals
  const [showSimulator, setShowSimulator] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Generate or Load Inbox
  const handleGenerateInbox = async (customPrefix?: string, customDomain?: string) => {
    try {
      const res = await fetch('/api/v1/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrefix, customDomain, ttlMinutes: 60 }),
      });
      const data = await res.json();
      if (data.success) {
        const newInbox: Inbox = data.inbox;
        setCurrentInbox(newInbox);
        setActiveInboxes((prev) => [newInbox, ...prev.filter((i) => i.address !== newInbox.address)]);
        setMessages([]);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to create inbox:', err);
    }
  };

  // Initial load
  useEffect(() => {
    handleGenerateInbox();
  }, []);

  // Fetch messages for current inbox
  const fetchMessages = useCallback(async () => {
    if (!currentInbox) return;
    try {
      const res = await fetch(`/api/v1/inbox/${encodeURIComponent(currentInbox.address)}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [currentInbox]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time SSE listener
  useEffect(() => {
    if (!currentInbox) return;

    const sseUrl = `/api/v1/stream/${encodeURIComponent(currentInbox.address)}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('new_mail', (e: MessageEvent) => {
      try {
        const newMsg: EmailMessage = JSON.parse(e.data);
        setMessages((prev) => [newMsg, ...prev.filter((m) => m.id !== newMsg.id)]);
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [currentInbox]);

  const handleSelectInbox = (address: string) => {
    const target = activeInboxes.find((i) => i.address === address);
    if (target) {
      setCurrentInbox(target);
      setSelectedMessage(null);
    }
  };

  const handleExtendTtl = async (address: string) => {
    try {
      const res = await fetch(`/api/v1/inbox/${encodeURIComponent(address)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalMinutes: 30 }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.inbox;
        setCurrentInbox(updated);
        setActiveInboxes((prev) => prev.map((i) => (i.address === address ? updated : i)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInbox = async (address: string) => {
    try {
      await fetch(`/api/v1/inbox/${encodeURIComponent(address)}`, { method: 'DELETE' });
      const remaining = activeInboxes.filter((i) => i.address !== address);
      setActiveInboxes(remaining);
      if (remaining.length > 0) {
        setCurrentInbox(remaining[0]);
      } else {
        handleGenerateInbox();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentInbox) return;
    try {
      await fetch(`/api/v1/inbox/${encodeURIComponent(currentInbox.address)}/messages?id=${messageId}`, {
        method: 'DELETE',
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Header Navbar */}
      <Header
        activeAddress={currentInbox?.address}
        onOpenApiDocs={() => setShowApiDocs(true)}
        onOpenSimulator={() => setShowSimulator(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* SEO Main Heading Shell */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-100">
            Instant <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Disposable Temporary Mail</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Generate a free temporary email address to receive activation links, OTP codes, and newsletters without revealing your personal email address.
          </p>
        </div>

        {/* Inbox Control Box */}
        <InboxControls
          currentInbox={currentInbox}
          activeInboxes={activeInboxes}
          onGenerateNew={handleGenerateInbox}
          onSelectInbox={handleSelectInbox}
          onExtendTtl={handleExtendTtl}
          onDeleteInbox={handleDeleteInbox}
          onOpenQrModal={() => setShowQrModal(true)}
          onRefresh={fetchMessages}
        />

        {/* Dual Panel Grid (Messages List + Message Viewer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Inbox List (5 cols) */}
          <div className="lg:col-span-5">
            <InboxList
              messages={messages}
              selectedMessageId={selectedMessage?.id || null}
              onSelectMessage={setSelectedMessage}
              onRefresh={fetchMessages}
              onOpenSimulator={() => setShowSimulator(true)}
            />
          </div>

          {/* Right Column: Email Detail Viewer (7 cols) */}
          <div className="lg:col-span-7">
            <EmailViewer
              message={selectedMessage}
              onDeleteMessage={handleDeleteMessage}
            />
          </div>

        </div>

        {/* Pre-rendered SEO FAQ Section */}
        <SeoFaqSection />

      </main>

      {/* Modals */}
      {currentInbox && (
        <TestSimulatorModal
          activeAddress={currentInbox.address}
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
          onSendSuccess={fetchMessages}
        />
      )}

      {currentInbox && (
        <QrCodeModal
          address={currentInbox.address}
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
        />
      )}

      <ApiDocsModal
        isOpen={showApiDocs}
        onClose={() => setShowApiDocs(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
