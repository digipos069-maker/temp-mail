import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | Temp Mail Blog`,
    description: post.excerpt,
  };
}

// Generate static params for SEO
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Very basic markdown parser for paragraphs and bold text. 
  // In a real production app with complex markdown, you'd use react-markdown.
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      if (paragraph.trim() === '') return null;
      
      // Render headings
      if (paragraph.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
      }
      
      // Render lists
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(i => i.trim().startsWith('- '));
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {items.map((item, i) => (
              <li key={i}>{item.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      if (paragraph.includes('\n1. ') || paragraph.startsWith('1. ')) {
        const items = paragraph.split('\n').filter(i => /^\d+\./.test(i.trim()));
        return (
          <ol key={idx} className="list-decimal pl-6 space-y-2 mb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
            ))}
          </ol>
        );
      }

      // Render normal paragraphs (handle bold **text**)
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={idx} className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-24">
      
      {/* Back button */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="w-full aspect-[21/9] relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/5 border border-slate-200 dark:border-slate-800">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {renderContent(post.content)}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-blue-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to protect your privacy?</h3>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">Generate a highly secure, disposable email address instantly and keep your real inbox safe from spam.</p>
          <Link href="/" className="inline-block bg-white text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition active:scale-95 shadow-lg">
            Create Temp Email Now
          </Link>
        </div>
      </div>

    </article>
  );
}
