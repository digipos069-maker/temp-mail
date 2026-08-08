'use client';

import { useEffect, useRef } from 'react';

export function RightSidebarAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/99bb600c85b0106ce2c40b8cda5cdc5e/invoke.js`;
      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : '99bb600c85b0106ce2c40b8cda5cdc5e',
        'format' : 'iframe',
        'height' : 300,
        'width' : 160,
        'params' : {}
      };`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, []);

  return (
    <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 w-[160px] h-[300px] z-50 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl">
      <div ref={banner} className="w-full h-full flex items-center justify-center"></div>
    </div>
  );
}
