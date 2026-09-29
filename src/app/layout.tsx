import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Oswald, Playfair_Display } from 'next/font/google';
import './globals.css';
import { business, quests, SITE_URL } from '@/data/business';
import BoilDefs from '@/components/BoilDefs';

/**
 * Четыре шрифта — четыре роли.
 *
 * Oswald (сжатый гротеск)   — крупные заголовки. Узкие формы дают
 *                             «плакатный» кинематографичный вид.
 * Playfair Display (антиква)— акцентные фразы: создаёт контраст
 *                             с техническим моно, как каптион в фильме.
 * Inter                     — читаемые абзацы.
 * JetBrains Mono            — только служебные надписи: метки камер,
 *                             время, номера. Это визуальный код видеонаблюдения.
 *
 * Переменные называются --font-face-*, чтобы не пересекаться
 * с одноимёнными ключами темы в globals.css.
 */
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-face-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

/**
 * Playfair подключён ТОЛЬКО курсивом.
 *
 * Это не экономия на красоте: класс `.font-serif` в globals.css задаёт
 * `font-style: italic`, и прямых начертаний на странице нет ни одного.
 * При этом next/font скачивал вместе с курсивом и оба прямых файла
 * (латиница + кириллица) и ставил их в `<link rel=preload>` — то есть
 * около 59 КБ из ~300 КБ шрифтового трафика уходили на начертание,
 * которое браузер не отрисовывает ни на одной странице.
 */
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-face-serif',
  weight: ['500', '700', '900'],
  style: ['italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-face-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-face-mono',
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
    /* Карточка собирается из настоящего кадра локации: без images
       og:image не отдавался вообще, и ссылка в мессенджере шла пустой. */
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Хоррор-квест «Инсомния», Караганда — ул. Новосёлов, 145/1',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Инсомния — хоррор-квест в Караганде',
    description: `Рейтинг ${business.rating} на 2ГИС. ${business.addressShort}.`,
    images: ['/og.jpg'],
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
  image: `${SITE_URL}/og.jpg`,
  url: SITE_URL,
  telephone: business.phone,
  priceRange: quests.find((q) => q.price)?.price ?? 'Уточняйте у администратора',
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
    <html
      lang="ru"
      className={`${oswald.variable} ${playfair.variable} ${inter.variable} ${mono.variable}`}
    >
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

        {/*
          Заставка живёт на CSS-таймлайне и появляется с первого кадра,
          поэтому решение «показывать или нет» обязано быть принято ДО
          первой отрисовки. Скрипт выполняется синхронно при разборе HTML
          и ставит атрибут на <html>; CSS по нему убирает слой заставки
          (html[data-intro='off'] .intro). Так человек, который уже видел
          заставку в этой сессии, не получает её мельком ещё раз.
          Если JS выключен вовсе, заставка просто доиграет свои 3.2 с:
          она гасится собственной анимацией, без участия скриптов.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=window.sessionStorage.getItem('insomnia-intro-seen')==='1';if(r||s){document.documentElement.setAttribute('data-intro','off');}}catch(e){}})();`,
          }}
        />

        {/* SVG-фильтры «кипения» — объявлены один раз на весь документ. */}
        <BoilDefs />

        {/* Редкий провал в темноту: «помеха на записи», а не мигание.
            Цикл 11 s, глубина 0.68 — заметно, но читать не мешает.
            Прежние 23 s с двойным миганием подряд давали ~3 вспышки
            в секунду (зона риска WCAG 2.3.1) и при этом почти никогда
            не попадали в поле зрения.
            При prefers-reduced-motion анимация гасится в globals.css. */}
        <span
          aria-hidden
          className="dropout pointer-events-none fixed inset-0 z-[9996] bg-black"
        />

        {children}
      </body>
    </html>
  );
}
