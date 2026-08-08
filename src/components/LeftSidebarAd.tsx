'use client';

import { useEffect, useRef } from 'react';

const IS_PROD = process.env.NODE_ENV === 'production';

export function LeftSidebarAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_PROD) return;

    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/bd29cdf1ab432d67e473f034d5252a0a/invoke.js`;
      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : 'bd29cdf1ab432d67e473f034d5252a0a',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, []);

  return (
    <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 w-[160px] h-[600px] z-50 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl">
      {IS_PROD ? (
        <div ref={banner} className="w-full h-full flex items-center justify-center"></div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm text-center p-4">
          Ad Placeholder<br/>(160x600)
        </div>
      )}
    </div>
  );
}
