import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';
import CctvStamp from '@/components/CctvStamp';
import RevealOnScroll from '@/components/RevealOnScroll';
import StickyCta from '@/components/StickyCta';
import { business, quests } from '@/data/business';
import { threat, enterHint } from '@/data/copy';
import { heroPhoto, photoFocus, photoHref, questPhotos } from '@/data/photos';
import Flashlight from '@/components/Flashlight';
import CountUp from '@/components/CountUp';
import DotMatrix from '@/components/DotMatrix';
import Sigil from '@/components/Sigil';
import Watcher from '@/components/Watcher';
import HowItWorks from '@/components/HowItWorks';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import Gallery from '@/components/Gallery';
import Location from '@/components/Location';

export default function Home() {
  return (
    <>
      <Intro />
      <RevealOnScroll />
      <Header />
      <StickyCta />

      <main id="main" className="pt-14 pb-16 sm:pt-16 sm:pb-0">
        {/* ============ HERO ============ */}
        <section className="relative flex min-h-[92svh] items-center overflow-hidden">
          {/* Кадр с камеры наблюдения — фон первого экрана.
              Тот же приём, что и в галерее: обесцвечивание, контраст
              и развёртка превращают фотографию в запись с камеры. */}
          <div className="absolute inset-0" aria-hidden>
            <span className="cctv block h-full w-full">
              {/* Качество 55 вместо 68: кадр проходит через grayscale,
                  контраст и виньетку, поэтому разница в артефактах не
                  читается, а вес LCP-картинки падает примерно вдвое
                  (на телефоне это ~122 → ~65 КБ). */}
              <Image
                src={photoHref(heroPhoto)}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={55}
                className="object-cover"
                style={{ objectPosition: photoFocus(heroPhoto) }}
              />
            </span>
          </div>

          {/* Медленно плывущие световые пятна — глубина вместо плоского фона */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
          </div>
          <div className="light-leak absolute inset-0" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.36]"
            aria-hidden
            style={{
              backgroundImage:
                'radial-gradient(ellipse 80% 60% at 50% 40%, #16161a 0%, #08080a 55%, #050506 100%)',
            }}
          />
          <div className="scanlines absolute inset-0" aria-hidden />

          {/* Фонарик: тьма расходится вокруг курсора. На тач-экране
              и при reduced-motion компонент не создаёт слой вовсе. */}
          <Flashlight />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <div className="anim-hero flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-dust uppercase">
                <CctvStamp />
                <span className="h-px flex-1 bg-iron" aria-hidden />
                <span>Камера 04</span>
              </div>

              {/* Глитч включается только на больших экранах:
                  на телефоне постоянное дрожание мешает читать крупный текст. */}
              <h1
                className="anim-hero-2 type-hero mt-6 font-display text-[15vw] font-bold text-bone text-shadow-hard sm:glitch sm:text-[11vw] lg:text-[8.5vw]"
                data-text="ИНСОМНИЯ"
              >
                ИНСОМНИЯ
              </h1>

              <p className="anim-hero-3 mt-6 max-w-md font-serif text-[1.35rem] leading-snug text-ashlight sm:text-2xl">
                {business.tagline}
              </p>

              <p className="anim-hero-4 mt-6 max-w-md border-l border-blood/60 pl-4 font-body text-[14px] leading-relaxed text-dust">
                Это не фильм. Ты не смотришь историю — ты оказываешься внутри неё.
              </p>

              <div className="anim-hero-5 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/booking"
                  className="w-full border border-blood/70 bg-blood/15 px-8 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/30 sm:w-auto"
                >
                  Войти
                </Link>
                <a
                  href="#quests"
                  className="w-full border border-iron px-8 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone sm:w-auto"
                >
                  Смотреть квесты
                </a>
              </div>

              <p className="anim-hero-6 mt-5 max-w-md font-mono text-[11px] leading-relaxed text-dust/80">
                {enterHint}
              </p>
            </div>
          </div>

          <div
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
            aria-hidden
          >
            <span className="font-mono text-[9px] tracking-huge text-dust uppercase">Вниз</span>
            <span className="h-10 w-px bg-gradient-to-b from-dust to-transparent" />
          </div>
        </section>

        {/* ============ TRUST — рациональная «земля» ============ */}
        <section className="border-y border-iron bg-ash">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="reveal grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">
                  Рейтинг 2ГИС
                </p>
                <p className="mt-2 font-display text-4xl font-black text-bone tabular-nums">
                  <CountUp to={business.rating} decimals={1} />
                  <span className="ml-1 text-lg text-blood-bright">★</span>
                </p>
                <p className="mt-1 font-mono text-[10px] text-dust">
                  <CountUp to={business.ratingsCount} /> оценок
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">Отзывы</p>
                <p className="mt-2 font-display text-4xl font-black text-bone tabular-nums">
                  <CountUp to={business.reviewsCount} />
                </p>
                <p className="mt-1 font-mono text-[10px] text-dust">
                  на{' '}
                  <a
                    href={business.twoGisReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blood-bright underline underline-offset-2"
                  >
                    2ГИС
                  </a>
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">Город</p>
                <p className="mt-2 font-display text-4xl font-black text-bone">Караганда</p>
                <p className="mt-1 font-mono text-[10px] text-dust">{business.addressShort}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">Открыто</p>
                <p className="mt-2 font-display text-4xl font-black text-bone tabular-nums">
                  {business.schedule.from}
                  <span className="mx-1 text-lg text-dust">—</span>
                  {business.schedule.to}
                </p>
                <p className="mt-1 font-mono text-[10px] text-dust">{business.schedule.days}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ ЧТО ЭТО ============ */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="reveal max-w-2xl">
              <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
                Что это
              </p>
              <h2 className="mt-5 font-display text-3xl leading-[1.05] font-black tracking-wide text-bone sm:text-5xl">
                Ты не зритель.
                <br />
                Ты — внутри.
              </h2>
              <Sigil className="mt-8" />
            </div>

            <div className="reveal mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {threat.map((t) => (
                <p
                  key={t}
                  className="border-t border-iron pt-4 font-mono text-[12px] leading-relaxed text-dust"
                >
                  {t}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ============ КВЕСТЫ ============ */}
        <section id="quests" className="scroll-mt-20 border-t border-iron py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
                  Форматы
                </p>
                <h2 className="mt-5 font-display text-3xl leading-[1.05] font-black tracking-wide text-bone sm:text-5xl">
                  Два входа.
                </h2>
              </div>
              <p className="max-w-xs font-mono text-[11px] leading-relaxed text-dust">
                Выбери, куда пойдёшь. Оба закрываются изнутри.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {quests.map((q, i) => (
                <article
                  key={q.slug}
                  className="reveal group beam-border relative flex flex-col border border-iron bg-ash transition-colors duration-500 hover:border-slate"
                >
                  <div
                    className="relative h-44 overflow-hidden border-b border-iron sm:h-56"
                    aria-hidden
                  >
                    <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
                      <span className="cctv block h-full w-full">
                        <Image
                          src={photoHref(questPhotos[q.slug] ?? heroPhoto)}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={70}
                          className="object-cover"
                          /* Карточка широкая (~2.4:1), кадр вертикальный:
                             берём яркую верхнюю полосу, а не середину. */
                          style={{
                            objectPosition: photoFocus(questPhotos[q.slug] ?? heroPhoto),
                          }}
                        />
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 z-[5] font-mono text-[10px] tracking-[0.2em] text-bone/80 uppercase">
                      CAM 0{i + 4}
                    </span>
                    <span className="absolute right-4 bottom-4 z-[5] font-mono text-[10px] tracking-[0.2em] text-blood-bright/90 uppercase tabular-nums">
                      REC ●
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-blood-bright uppercase">
                      {q.kicker}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-black tracking-wide text-bone sm:text-3xl">
                      {q.name}
                    </h3>
                    <p className="mt-3 font-mono text-[12px] leading-relaxed text-ashlight">
                      {q.hook}
                    </p>

                    <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-iron pt-4">
                      {[
                        { l: 'Игроки', v: q.players },
                        { l: 'Возраст', v: q.age },
                        { l: 'Цена', v: q.price },
                      ].map((f) => (
                        <div key={f.l}>
                          <dt className="font-mono text-[9px] tracking-[0.16em] text-dust uppercase">
                            {f.l}
                          </dt>
                          <dd
                            className={`mt-1 font-display text-sm font-bold ${
                              f.v ? 'text-bone' : 'text-dust'
                            }`}
                          >
                            {f.v ?? '—'}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {q.priceNote ? (
                      <p className="mt-3 font-mono text-[10px] leading-relaxed text-dust/80">
                        {q.priceNote}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
                      <Link
                        href={`/quests/${q.slug}`}
                        className="flex-1 border border-iron px-5 py-3 text-center font-mono text-[10px] tracking-[0.18em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
                      >
                        Подробнее
                      </Link>
                      <Link
                        href={`/booking?quest=${q.slug}`}
                        className="flex-1 border border-blood/60 bg-blood/12 px-5 py-3 text-center font-mono text-[10px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
                      >
                        Забронировать
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="reveal mt-6 font-body text-[13px] leading-relaxed text-dust">
              Цена «Забытых душ» — из{' '}
              <a
                href={business.twoGisPricesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blood-bright underline underline-offset-2"
              >
                прайс-листа 2ГИС от {business.priceListUpdatedAt}
              </a>
              . Количество игроков, длительность, возраст и стоимость INSOMNIA CINEMA
              уточните у администратора — мы не публикуем цифры, которые не можем
              подтвердить.
            </p>
          </div>
        </section>

        {/* ============ КАДР ИЗ АРХИВА — передышка-испуг между секциями ============
            Тот же механизм фонарика, но здесь он не украшение: пока курсор
            не пройдёт по кадру, фотографию почти не видно. */}
        <section className="relative flex min-h-[74svh] items-end overflow-hidden border-y border-iron">
          <div className="absolute inset-0" aria-hidden>
            <span className="cctv block h-full w-full">
              <Image
                src={photoHref('16.jpg')}
                alt=""
                fill
                sizes="100vw"
                quality={60}
                className="object-cover"
                style={{ objectPosition: photoFocus('16.jpg') }}
              />
            </span>
          </div>
          <div className="light-leak absolute inset-0" aria-hidden />
          <div className="scanlines absolute inset-0" aria-hidden />
          <Flashlight />

          {/* Индикатор прибора — в углу кадра, а не рядом с кнопкой:
              в потоке он читался как вторая, «сломанная» кнопка (это
              отметил визуальный QA). */}
          <DotMatrix
            className="pointer-events-none absolute top-6 right-6 z-10 w-20 opacity-70 sm:top-10 sm:right-10 sm:w-28"
            cols={9}
            rows={3}
            k={-0.045}
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="reveal font-mono text-[10px] tracking-huge text-blood-bright uppercase">
              CAM 09 · кадр из архива
            </p>
            <h2 className="reveal mt-5 max-w-lg font-display text-3xl leading-[1.02] font-black tracking-wide text-bone text-shadow-hard sm:text-5xl">
              Не всякий кадр из архива стоит рассматривать долго.
            </h2>
            <p className="reveal mt-5 max-w-md font-mono text-[12px] leading-relaxed text-ashlight">
              Свет идёт за курсором. Всё, что остаётся за кругом, вы не увидите —
              и в этом есть своя выгода.
            </p>
            <div className="reveal mt-8">
              <Link
                href="/booking"
                className="inline-block border border-blood/70 bg-blood/15 px-8 py-4 font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/30"
              >
                Войти
              </Link>
            </div>
          </div>
        </section>

        {/* MID_SECTIONS */}
        <HowItWorks />
        <Gallery />
        <Reviews />
        <Faq />
        <Location />

        {/* ============ ФИНАЛЬНЫЙ CTA ============ */}
        <section className="relative overflow-hidden border-t border-iron py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="orb orb-1 opacity-30" />
            <span className="orb orb-2 opacity-40" />
          </div>
          <div className="light-leak absolute inset-0" aria-hidden />
          <div className="scanlines absolute inset-0" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
            {/* Взгляд из темноты: зрачки идут за курсором. */}
            <Watcher className="reveal mx-auto mb-10 h-10 w-36 opacity-80" />
            <p className="reveal font-mono text-[10px] tracking-huge text-dust uppercase">
              Дверь открыта
            </p>
            <h2 className="reveal mt-6 font-display text-4xl leading-[0.98] font-bold tracking-wide text-bone sm:text-6xl">
              Ты уже здесь.
            </h2>
            <p className="reveal mx-auto mt-6 max-w-md font-serif text-lg leading-snug text-dust sm:text-xl">
              Остался один вопрос: ты правда хочешь узнать, что там внутри?
            </p>
            <div className="reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="w-full border border-blood/70 bg-blood/15 px-9 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/30 sm:w-auto"
              >
                Войти
              </Link>
              <a
                href={business.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-iron px-9 py-4 text-center font-mono text-[12px] tracking-[0.2em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone sm:w-auto"
              >
                Написать
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
