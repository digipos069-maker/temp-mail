'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Inbox,
  EmailMessage,
  createInbox,
  getInbox,
  getMessages,
  extendInboxTtl,
  deleteInbox,
  subscribeToInbox,
  markAsRead,
  SUPPORTED_DOMAINS
} from '@/lib/store';
import { LanguageCode } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Header } from '@/components/Header';
import { InboxControls } from '@/components/InboxControls';
import { InboxList } from '@/components/InboxList';
import { EmailViewer } from '@/components/EmailViewer';
import { TestSimulatorModal } from '@/components/TestSimulatorModal';
import { QrCodeModal } from '@/components/QrCodeModal';
import { ApiDocsModal } from '@/components/ApiDocsModal';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { Footer } from '@/components/Footer';
import { LeftSidebarAd } from '@/components/LeftSidebarAd';
import { MobileTopAd } from '@/components/MobileTopAd';
import { DesktopTopAd } from '@/components/DesktopTopAd';
import { RightSidebarAd } from '@/components/RightSidebarAd';
import { BottomAd } from '@/components/BottomAd';

interface MainDashboardProps {
  initialLang?: LanguageCode;
}

export default function MainDashboard({ initialLang }: MainDashboardProps) {
  const { setLanguage } = useTranslation();

  const [activeAddress, setActiveAddress] = useState<string>('');
  const [allInboxes, setAllInboxes] = useState<Inbox[]>([]);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);

  // Ref to track user's selected message without stale closure issues
  const selectedMessageRef = useRef<EmailMessage | null>(null);

  // Keep ref in sync with selectedMessage state
  useEffect(() => {
    selectedMessageRef.current = selectedMessage;
  }, [selectedMessage]);

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  useEffect(() => {
    if (initialLang) {
      setLanguage(initialLang);
    }
  }, [initialLang, setLanguage]);

  // Initial inbox creation
  useEffect(() => {
    const defaultInbox = createInbox();
    setActiveAddress(defaultInbox.address);
    setAllInboxes([defaultInbox]);
  }, []);

  // Fetch inbox messages from API & subscribe to SSE real-time stream
  useEffect(() => {
    if (!activeAddress) return;

    const fetchMessagesFromApi = async () => {
      try {
        const localList = getMessages(activeAddress);
        
        // Fetch real-time message list from server API endpoint
        const res = await fetch(`/api/v1/inbox/${encodeURIComponent(activeAddress)}/messages`, {
          cache: 'no-store'
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.messages)) {
            setMessages(data.messages);
            
            // Only auto-select the first message if user hasn't selected any message yet
            if (data.messages.length > 0 && !selectedMessageRef.current) {
              setSelectedMessage(data.messages[0]);
            }
            return;
          }
        }

        setMessages([...localList]);
        if (localList.length > 0 && !selectedMessageRef.current) {
          setSelectedMessage(localList[0]);
        }
      } catch (err) {
        const localList = getMessages(activeAddress);
        setMessages([...localList]);
        if (localList.length > 0 && !selectedMessageRef.current) {
          setSelectedMessage(localList[0]);
        }
      }
    };

    fetchMessagesFromApi();

    // Auto-poll API every 3 seconds as a resilient backup to SSE stream
    const pollInterval = setInterval(() => {
      fetchMessagesFromApi();
    }, 3000);

    // Subscribe to SSE real-time updates for active inbox
    const unsubscribe = subscribeToInbox(activeAddress, (newMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMessage.id);
        if (exists) return prev;
        return [newMessage, ...prev];
      });
      
      // Do NOT override user's selection if they are reading an existing email
      if (!selectedMessageRef.current) {
        setSelectedMessage(newMessage);
      }
    });

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [activeAddress]);

  const handleSelectInbox = (address: string) => {
    setActiveAddress(address);
    setSelectedMessage(null);
    selectedMessageRef.current = null;
    const list = getMessages(address);
    setMessages([...list]);
  };

  const handleExtendTtl = (address: string) => {
    const updated = extendInboxTtl(address, 30);
    if (updated) {
      setAllInboxes((prev) => prev.map((inbox) => (inbox.address === address ? { ...updated } : inbox)));
    }
  };

  const handleDeleteInbox = (address: string) => {
    deleteInbox(address);
    const remaining = allInboxes.filter((i) => i.address !== address);
    if (remaining.length > 0) {
      setAllInboxes(remaining);
      setActiveAddress(remaining[0].address);
      setMessages(getMessages(remaining[0].address));
      setSelectedMessage(null);
      selectedMessageRef.current = null;
    } else {
      const newInbox = createInbox();
      setAllInboxes([newInbox]);
      setActiveAddress(newInbox.address);
      setMessages([]);
      setSelectedMessage(null);
      selectedMessageRef.current = null;
    }
  };

  // Replaces the current active address with a fresh new address
  const handleGenerateNew = (prefix?: string, domain?: string) => {
    if (activeAddress) {
      deleteInbox(activeAddress);
    }
    const newInbox = createInbox(prefix, domain);
    const remainingInboxes = allInboxes.filter((i) => i.address !== activeAddress);
    setAllInboxes([newInbox, ...remainingInboxes]);
    setActiveAddress(newInbox.address);
    setMessages([]);
    setSelectedMessage(null);
    selectedMessageRef.current = null;
  };

  const handleSelectMessage = (msg: EmailMessage) => {
    markAsRead(activeAddress, msg.id);
    setSelectedMessage(msg);
    selectedMessageRef.current = msg;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isUnread: false } : m))
    );
  };

  const currentInboxObj = getInbox(activeAddress) || allInboxes[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Navbar Header */}
      <Header
        activeAddress={activeAddress}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <LeftSidebarAd />
      <RightSidebarAd />
      <MobileTopAd />
      <DesktopTopAd />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Inbox Control Box */}
        <InboxControls
          currentInbox={currentInboxObj}
          activeInboxes={allInboxes}
          onGenerateNew={handleGenerateNew}
          onSelectInbox={handleSelectInbox}
          onExtendTtl={handleExtendTtl}
          onDeleteInbox={handleDeleteInbox}
          onOpenQrModal={() => setIsQrOpen(true)}
          onRefresh={() => {
            fetch(`/api/v1/inbox/${encodeURIComponent(activeAddress)}/messages`, { cache: 'no-store' })
              .then((res) => res.json())
              .then((data) => {
                if (data.messages) setMessages(data.messages);
              });
          }}
        />

        {/* 2-Column Dashboard Layout (Left: Message List, Right: Email Reader) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <InboxList
              messages={messages}
              selectedMessageId={selectedMessage?.id || null}
              onSelectMessage={handleSelectMessage}
              onRefresh={() => {
                fetch(`/api/v1/inbox/${encodeURIComponent(activeAddress)}/messages`, { cache: 'no-store' })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.messages) setMessages(data.messages);
                  });
              }}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />
          </div>

          <div className="lg:col-span-7">
            <EmailViewer
              message={selectedMessage}
              onDeleteMessage={(msgId) => {
                setMessages((prev) => prev.filter((m) => m.id !== msgId));
                setSelectedMessage(null);
                selectedMessageRef.current = null;
              }}
            />
          </div>
        </div>

        {/* SEO FAQ Section & Schema.org Rich Snippets */}
        <SeoFaqSection />
      </main>

      {/* Bottom Ad */}
      <BottomAd />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <TestSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        activeAddress={activeAddress}
        onSendSuccess={() => {
          fetch(`/api/v1/inbox/${encodeURIComponent(activeAddress)}/messages`, { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
              if (data.messages) setMessages(data.messages);
            });
        }}
      />

      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        address={activeAddress}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

    </div>
  );
}
