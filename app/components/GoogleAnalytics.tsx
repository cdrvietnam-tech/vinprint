import Script from "next/script";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

// Measurement ID mặc định của VinPrint. Có thể ghi đè bằng biến môi trường
// NEXT_PUBLIC_GA_ID nếu cần đổi tài khoản. Đây là ID công khai, an toàn khi để trong mã.
const DEFAULT_GA_ID = "G-0XQZ3FCJN0";

export default function GoogleAnalytics() {
  const gaId = (process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_ID).trim();
  if (!GA_ID_PATTERN.test(gaId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="vinprint-ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
