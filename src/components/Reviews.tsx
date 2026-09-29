import { business, reviews } from '@/data/business';

/**
 * Социальное доказательство.
 * Публикуем агрегаты 2ГИС (рейтинг, количество) и реальные цитаты из вкладки
 * «Отзывы» — без правок текста: сокращения помечены многоточием.
 * Отзывы без текста и с бранью в выборку не попали, поэтому здесь восемь
 * цитат, а не все сто тридцать два отзыва.
 */
export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="reveal">
            <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
              Отзывы
            </p>
            <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
              {business.rating.toFixed(1)}
              <span className="ml-3 text-2xl text-blood-bright sm:text-3xl">
                ★★★★★
              </span>
            </h2>
            <p className="mt-4 font-mono text-[12px] leading-relaxed text-dust">
              {business.ratingsCount} оценок и {business.reviewsCount} отзывов на 2ГИС. Это
              единственный источник, который мы используем — цитаты ниже взяты из него
              и не переписаны.
            </p>
            <a
              href={business.twoGisReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block border border-blood/60 bg-blood/12 px-7 py-4 font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
            >
              Читать все отзывы
            </a>
          </div>

          <div className="reveal space-y-px border border-iron bg-iron">
            {[
              {
                t: 'Рейтинг',
                v: `${business.rating.toFixed(1)} / 5.0`,
                n: `${business.ratingsCount} оценок`,
              },
              {
                t: 'Отзывы',
                v: `${business.reviewsCount}`,
                n: `${business.reviewsShown} отображаются в списке 2ГИС`,
              },
              {
                t: 'Статус',
                v: 'Открыто',
                n: `${business.schedule.days} ${business.schedule.from} — ${business.schedule.to}`,
              },
            ].map((r) => (
              <div key={r.t} className="bg-ash p-6 sm:p-7">
                <p className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">
                  {r.t}
                </p>
                <p className="mt-2 font-display text-2xl font-black tracking-wide text-bone">
                  {r.v}
                </p>
                <p className="mt-1 font-mono text-[11px] text-dust">{r.n}</p>
              </div>
            ))}
            <div className="bg-ash p-6 sm:p-7">
              <p className="font-mono text-[11px] leading-relaxed text-dust">
                Каждый отзыв ниже помечен в 2ГИС как подтверждённый оплатой,
                посещением или бронированием. Стиль авторов сохранён намеренно.
              </p>
            </div>
          </div>
        </div>

        {/* Цитаты */}
        <div className="reveal mt-10 grid gap-px border border-iron bg-iron sm:grid-cols-2">
          {reviews.map((r) => (
            <figure key={`${r.author}-${r.date}`} className="flex flex-col bg-ash p-6 sm:p-7">
              <blockquote className="font-mono text-[12px] leading-relaxed text-ashlight">
                {r.text}
              </blockquote>
              <figcaption className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-5 font-mono text-[10px] text-dust">
                <span className="text-bone">{r.author}</span>
                <span>{r.date}</span>
                <span className="text-dust/70">{r.visits}</span>
                <span className="text-blood-bright/80">Отзыв подтверждён</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="reveal mt-6 font-mono text-[11px] leading-relaxed text-dust">
          Показаны восемь цитат из {business.reviewsCount}. Отзывы без текста
          (только оценка), отзывы с оскорблениями и спам в выборку не включены —
          агрегатный рейтинг на это не влияет, он берётся из карточки целиком.
          Остальное — по ссылке выше.
        </p>
      </div>
    </section>
  );
}
