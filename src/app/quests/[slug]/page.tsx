import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { quests, getQuest, business } from '@/data/business';
import { hooks } from '@/data/copy';
import { photoHref, photoFocus, questPhotos, heroPhoto } from '@/data/photos';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import { Fact } from '@/components/Fact';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return quests.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuest(slug);
  if (!q) return { title: 'Квест не найден' };

  return {
    title: `${q.name} — хоррор-квест в Караганде`,
    description: `${q.hook} ${business.name}, ${business.addressShort}, Караганда. ${business.schedule.days} ${business.schedule.from} — ${business.schedule.to}.`,
    alternates: { canonical: `/quests/${q.slug}` },
    openGraph: { title: `${q.name} — ${business.name}`, description: q.hook },
  };
}

export default async function QuestPage({ params }: Params) {
  const { slug } = await params;
  const q = getQuest(slug);
  if (!q) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${q.name} — ${business.name}`,
    description: q.hook,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: business.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'улица Новосёлов, 145/1',
        addressLocality: 'Караганда',
        postalCode: business.postalCode,
        addressCountry: 'KZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.coords.lat,
        longitude: business.coords.lon,
      },
    },
    organizer: { '@type': 'Organization', name: business.name, url: business.twoGisUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RevealOnScroll />
      <Header />

      <main id="main" className="pt-14 pb-16 sm:pt-16 sm:pb-0">
        {/* HERO квеста */}
        <section className="relative overflow-hidden border-b border-iron">
          {/* Реальный кадр локации под «камерой наблюдения» */}
          <div className="absolute inset-0" aria-hidden>
            <span className="cctv block h-full w-full">
              <Image
                src={photoHref(questPhotos[q.slug] ?? heroPhoto)}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={70}
                className="object-cover"
                style={{ objectPosition: photoFocus(questPhotos[q.slug] ?? heroPhoto) }}
              />
            </span>
          </div>
          <div className="light-leak absolute inset-0" aria-hidden />
          <div className="scanlines absolute inset-0" aria-hidden />
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <Link
              href="/#quests"
              className="link-unfurl font-mono text-[10px] tracking-[0.18em] text-dust uppercase"
            >
              ← Все квесты
            </Link>
            <p className="mt-8 font-mono text-[10px] tracking-huge text-blood-bright uppercase">
              {q.kicker}
            </p>
            <h1 className="glitch mt-4 font-display text-[12vw] leading-[0.94] font-bold tracking-wide text-bone text-shadow-hard sm:text-[7.5vw] lg:text-[5.5vw]" data-text={q.name}>
              {q.name}
            </h1>
            <p className="mt-6 max-w-lg font-body text-[15px] leading-relaxed text-ashlight">
              {q.hook}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/booking?quest=${q.slug}`}
                className="w-full border border-blood/70 bg-blood/15 px-8 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/30 sm:w-auto"
              >
                Забронировать
              </Link>
              <a
                href={business.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-iron px-8 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone sm:w-auto"
              >
                Уточнить условия
              </a>
            </div>
          </div>
        </section>

        {/* Параметры квеста */}
        <section className="border-b border-iron bg-ash">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Fact label="Игроки" value={q.players} />
              <Fact label="Возраст" value={q.age} />
              <Fact label="Длительность" value={q.duration} />
              <Fact label="Стоимость" value={q.price} />
            </dl>
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-dust">
              {q.priceNote} Количество игроков, длительность и возраст в открытом
              доступе не опубликованы — их назовёт администратор: напишите ему или
              оставьте заявку, и мы перезвоним.
            </p>
          </div>
        </section>

        {/* История — без спойлеров */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="reveal max-w-2xl">
              <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
                История
              </p>
              <h2 className="mt-5 font-display text-3xl leading-[1.05] font-black tracking-wide text-bone sm:text-5xl">
                {hooks[q.slug]?.title ?? 'Что там произошло'}
              </h2>
            </div>
            <div className="reveal mt-10 max-w-2xl space-y-5">
              {(hooks[q.slug]?.lines ?? q.story).map((p, i) => (
                <p
                  key={i}
                  className={`font-mono text-[13px] leading-relaxed ${
                    i === q.story.length - 1 ? 'text-ashlight' : 'text-bone'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
            <p className="reveal mt-8 border-l border-blood/60 pl-4 font-mono text-[11px] leading-relaxed text-dust">
              Дальше — ниже. Остальное вы узнаете внутри.
            </p>
          </div>
        </section>

        {/* Атмосфера + что ждёт */}
        <section className="border-y border-iron bg-ash py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="reveal">
                <h2 className="font-display text-2xl font-black tracking-wide text-bone sm:text-3xl">
                  Атмосфера
                </h2>
                <ul className="mt-6 space-y-3">
                  {q.atmosphere.map((a) => (
                    <li
                      key={a}
                      className="flex gap-3 font-mono text-[12px] leading-relaxed text-ashlight"
                    >
                      <span aria-hidden className="text-blood-bright">
                        ▸
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal">
                <h2 className="font-display text-2xl font-black tracking-wide text-bone sm:text-3xl">
                  Что вас ждёт
                </h2>
                <ul className="mt-6 space-y-3">
                  {q.awaits.map((a) => (
                    <li
                      key={a}
                      className="flex gap-3 font-mono text-[12px] leading-relaxed text-ashlight"
                    >
                      <span aria-hidden className="text-blood-bright">
                        ▸
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-[11px] leading-relaxed text-dust">
                  Сценарные детали и скайм-моменты мы не раскрываем заранее.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Условия и запись */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="reveal max-w-2xl">
              <h2 className="font-display text-3xl leading-[1.05] font-black tracking-wide text-bone sm:text-5xl">
                Условия и запись
              </h2>
              <p className="mt-5 font-mono text-[12px] leading-relaxed text-dust">
                {q.source}. Количество игроков, длительность и возраст подтверждает
                администратор — мы не публикуем неподтверждённые цифры.
              </p>
            </div>

            <div className="reveal mt-9 grid gap-2.5 sm:grid-cols-2">
              <Link
                href={`/booking?quest=${q.slug}`}
                className="border border-blood-bright bg-blood/20 px-7 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all hover:bg-blood/35"
              >
                Выбрать время
              </Link>
              <a
                href={business.phoneHref}
                className="border border-iron px-7 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                {business.phone}
              </a>
            </div>

            <p className="reveal mt-6 font-mono text-[11px] leading-relaxed text-dust">
              {business.name} · {business.addressShort}, Караганда ·{' '}
              {business.schedule.days} {business.schedule.from} — {business.schedule.to} · рейтинг{' '}
              {business.rating.toFixed(1)} на 2ГИС ({business.reviewsCount} отзывов).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
