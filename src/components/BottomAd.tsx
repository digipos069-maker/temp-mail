'use client';

import { useEffect, useRef } from 'react';

export function BottomAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div className="hidden md:flex w-full justify-center my-8">
      <div ref={banner} className="flex items-center justify-center min-w-[728px] min-h-[90px]"></div>
    </div>
  );
}
