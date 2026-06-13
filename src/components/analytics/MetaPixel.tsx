import Script from 'next/script'

// Meta (Facebook) Pixel — RODO-safe: loads with consent revoked, so no cookies
// or tracking fire until the visitor accepts in the consent banner. ConsentBanner
// calls fbq('consent','grant'/'revoke') on accept/reject. Events fired before grant
// (PageView, CTA clicks) are queued by fbq and sent once consent is granted.
// No <noscript> fallback on purpose: it cannot respect the consent banner.
export function MetaPixel({ pixelId }: { pixelId?: string | null }) {
  if (!pixelId) return null
  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('consent','revoke');
      fbq('init','${pixelId}');
      fbq('track','PageView');
      try { if (localStorage.getItem('wisnia-consent') === 'granted') fbq('consent','grant'); } catch(e){}
    `}</Script>
  )
}
