import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';
import CctvStamp from '@/components/CctvStamp';
import RevealOnScroll from '@/components/RevealOnScroll';
import StickyCta from '@/components/StickyCta';
import { business, quests } from '@/data/business';
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
          <div className="light-leak absolute inset-0" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.55]"
            aria-hidden
            style={{
              backgroundImage:
                'radial-gradient(ellipse 80% 60% at 50% 40%, #16161a 0%, #08080a 55%, #050506 100%)',
            }}
          />
          <div className="scanlines absolute inset-0" aria-hidden />

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
                <p className="mt-2 font-display text-4xl font-black text-bone">
                  {business.rating.toFixed(1)}
                  <span className="ml-1 text-lg text-blood-bright">★</span>
                </p>
                <p className="mt-1 font-mono text-[10px] text-dust">
                  {business.ratingsCount} оценок
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">Отзывы</p>
                <p className="mt-2 font-display text-4xl font-black text-bone">
                  {business.reviewsCount}
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
              <div className="rule-blood mt-8" />
            </div>

            <div className="reveal mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { t: 'Вы', d: 'Команда, которая решает выйти.' },
                { t: 'Пространство', d: 'Замкнуто. Обратной дороги нет.' },
                { t: 'История', d: 'Уже происходила. Без вас.' },
                { t: 'Решения', d: 'Ваши. И они имеют вес.' },
                { t: 'Страх', d: 'Не эффект, а состояние.' },
                { t: 'Тишина', d: 'Работает громче крика.' },
              ].map((b) => (
                <div key={b.t} className="border-t border-iron pt-4">
                  <h3 className="font-display text-base font-bold tracking-[0.1em] text-bone">
                    {b.t}
                  </h3>
                  <p className="mt-2 font-mono text-[12px] leading-relaxed text-dust">{b.d}</p>
                </div>
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
                  className="reveal group relative flex flex-col border border-iron bg-ash transition-colors duration-500 hover:border-slate"
                >
                  <div
                    className="relative h-44 overflow-hidden border-b border-iron sm:h-56"
                    aria-hidden
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      style={{
                        backgroundImage: [
                          'radial-gradient(ellipse 70% 90% at 30% 25%, #1d1518 0%, transparent 60%)',
                          'radial-gradient(ellipse 60% 70% at 78% 78%, #1a1412 0%, transparent 62%)',
                          'linear-gradient(160deg, #0e0e11 0%, #070708 100%)',
                        ].join(','),
                      }}
                    />
                    <div className="scanlines absolute inset-0" />
                    <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-dust uppercase">
                      CAM 0{i + 4}
                    </span>
                    <span className="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.2em] text-dust uppercase tabular-nums">
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
              Количество игроков, длительность, возраст и стоимость уточните у администратора —
              мы не публикуем цифры, которые не можем подтвердить.
            </p>
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
          <div className="light-leak absolute inset-0" aria-hidden />
          <div className="scanlines absolute inset-0" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
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
