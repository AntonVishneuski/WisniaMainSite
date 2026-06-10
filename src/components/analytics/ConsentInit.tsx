import Script from 'next/script'

export function ConsentInit() {
  return (
    <Script id="consent-default" strategy="beforeInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      var stored = null;
      try { stored = localStorage.getItem('wisnia-consent'); } catch(e){}
      gtag('consent','default',{
        ad_storage: 'denied', analytics_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
        functionality_storage: 'granted', security_storage: 'granted',
        wait_for_update: 500
      });
      if (stored === 'granted') {
        gtag('consent','update',{ ad_storage:'granted', analytics_storage:'granted', ad_user_data:'granted', ad_personalization:'granted' });
      }
    `}</Script>
  )
}
