'use client';

const IS_PROD = process.env.NODE_ENV === 'production';

export function DesktopTopAd() {
  return (
    <div className="hidden lg:flex w-full justify-center my-4">
      {IS_PROD ? (
        <iframe
          src="/ads/banner-728x90.html"
          width="728"
          height="90"
          frameBorder="0"
          scrolling="no"
          className="bg-transparent"
          title="Advertisement"
        ></iframe>
      ) : (
        <div className="flex items-center justify-center min-w-[728px] min-h-[90px] bg-slate-800 text-slate-400 text-sm border border-slate-700 rounded-lg">
          Desktop Ad Placeholder (728x90)
        </div>
      )}
    </div>
  );
}
