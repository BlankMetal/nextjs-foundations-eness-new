'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  return (
    <>
      {/* Load the gtag.js library — afterInteractive so it doesn't block page hydration */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded');
        }}
      />
      {/* Initialize GA — inline scripts require an `id` prop */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `,
        }}
      />
    </>
  );
}
