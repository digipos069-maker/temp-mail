'use client';

import { useEffect, useRef } from 'react';

const IS_PROD = process.env.NODE_ENV === 'production';

export function MobileBottomAd() {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_PROD) return;

    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//manyapostle.com/a0e17a57111024426ad8916c81fd8b08/invoke.js`;
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
      {IS_PROD ? (
        <div ref={banner} className="flex items-center justify-center min-w-[468px] min-h-[60px]"></div>
      ) : (
        <div className="flex items-center justify-center min-w-[468px] min-h-[60px] bg-slate-800 text-slate-400 text-sm border border-slate-700 rounded-lg">
          Mobile Ad Placeholder (468x60)
        </div>
      )}
    </div>
  );
}
