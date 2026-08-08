'use client';

const IS_PROD = process.env.NODE_ENV === 'production';

export function MobileTopAd() {
  return (
    <div className="flex lg:hidden w-full justify-center my-4">
      {IS_PROD ? (
        <iframe
          src="/ads/banner-468x60.html"
          width="468"
          height="60"
          frameBorder="0"
          scrolling="no"
          className="bg-transparent max-w-full"
          title="Advertisement"
        ></iframe>
      ) : (
        <div className="flex items-center justify-center min-w-[320px] max-w-[468px] w-full min-h-[60px] bg-slate-800 text-slate-400 text-xs border border-slate-700 rounded-lg">
          Mobile Ad Placeholder (468x60)
        </div>
      )}
    </div>
  );
}
