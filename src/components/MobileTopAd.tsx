'use client';

import { useEffect, useRef } from 'react';

export function MobileTopAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/a0e17a57111024426ad8916c81fd8b08/invoke.js`;
      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : 'a0e17a57111024426ad8916c81fd8b08',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, []);

  return (
    <div className="flex lg:hidden w-full justify-center my-4 overflow-hidden">
      <div ref={banner} className="flex items-center justify-center min-w-[468px] min-h-[60px]"></div>
    </div>
  );
}
