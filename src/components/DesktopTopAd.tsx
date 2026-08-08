'use client';

import { useEffect, useRef } from 'react';

const IS_PROD = process.env.NODE_ENV === 'production';

export function DesktopTopAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_PROD) return;

    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/1eec78a7da1bc340939805bdbe075be1/invoke.js`;
      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : '1eec78a7da1bc340939805bdbe075be1',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, []);

  return (
    <div className="hidden lg:flex w-full justify-center my-4">
      {IS_PROD ? (
        <div ref={banner} className="flex items-center justify-center min-w-[728px] min-h-[90px]"></div>
      ) : (
        <div className="flex items-center justify-center min-w-[728px] min-h-[90px] bg-slate-800 text-slate-400 text-sm border border-slate-700 rounded-lg">
          Desktop Ad Placeholder (728x90)
        </div>
      )}
    </div>
  );
}
