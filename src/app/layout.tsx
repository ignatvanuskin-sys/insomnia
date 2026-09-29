import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { business, SITE_URL } from '@/data/business';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Инсомния — хоррор-квест в Караганде',
    template: '%s | Инсомния Караганда',
  },
  description: `Хоррор-квест «Инсомния» в Караганде — ул. Новосёлов, 145/1. Рейтинг ${business.rating} на 2ГИС, ${business.reviewsCount} отзывов. Ежедневно с ${business.schedule.from} до ${business.schedule.to}. Хоррор-квест «Забытые души» и INSOMNIA CINEMA.`,
  keywords: [
    'Инсомния',
    'хоррор квест Караганда',
    'квесты Караганда',
    'страшный квест Караганда',
    'квест для компании Караганда',
    'хоррор квест Новоселов Караганда',
    'Забытые души Караганда',
    'INSOMNIA CINEMA Караганда',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_KZ',
    url: SITE_URL,
    siteName: 'Инсомния — хоррор-квест Караганда',
    title: 'Инсомния — хоррор-квест в Караганде',
    description: `Рейтинг ${business.rating} на 2ГИС, ${business.reviewsCount} отзывов. Ежедневно с ${business.schedule.from} до ${business.schedule.to}.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Инсомния — хоррор-квест в Караганде',
    description: `Рейтинг ${business.rating} на 2ГИС. ${business.addressShort}.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#050506',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EntertainmentBusiness',
  name: 'Инсомния',
  alternateName: 'Хоррор-квест Инсомния',
  description: business.tagline,
  slogan: business.tagline,
  image: `${SITE_URL}/og.png`,
  url: SITE_URL,
  telephone: business.phone,
  priceRange: 'Уточняйте у администратора',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'улица Новосёлов, 145/1',
    addressLocality: 'Караганда',
    addressRegion: 'Караганда',
    postalCode: business.postalCode,
    addressCountry: 'KZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: business.coords.lat,
    longitude: business.coords.lon,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: business.schedule.from,
    closes: business.schedule.to,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: business.rating,
    reviewCount: business.reviewsCount,
    ratingCount: business.ratingsCount,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: [business.instagramHref, business.twoGisUrl],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:border focus:border-blood-bright focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:tracking-[0.16em] focus:text-bone focus:uppercase"
        >
          К содержимому
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
