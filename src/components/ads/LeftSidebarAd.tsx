'use client';

const IS_PROD = process.env.NODE_ENV === 'production';

export function LeftSidebarAd() {
  return (
    <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 w-[160px] h-[600px] z-50 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl">
      {IS_PROD ? (
        <iframe
          src="/ads/banner-160x600.html"
          width="160"
          height="600"
          frameBorder="0"
          scrolling="no"
          className="bg-transparent"
          title="Advertisement"
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm text-center p-4">
          Ad Placeholder<br/>(160x600)
        </div>
      )}
    </div>
  );
}
