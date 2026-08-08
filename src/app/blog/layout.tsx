'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // Dummy handlers for Header on the blog pages. 
  // Redirects to homepage where the actual modals live.
  const handleOpenApiDocs = () => {
    if (typeof window !== 'undefined') window.location.href = '/';
  };
  
  const handleOpenSimulator = () => {
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onOpenApiDocs={handleOpenApiDocs} 
        onOpenSimulator={handleOpenSimulator} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
