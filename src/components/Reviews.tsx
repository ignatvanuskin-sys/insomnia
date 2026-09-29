import { business } from '@/data/business';

/**
 * Социальное доказательство.
 * Мы публикуем ТОЛЬКО подтверждённые данные 2ГИС (рейтинг и количество).
 * Тексты отзывов скрыты антибот-защитой 2ГИС — выдумывать цитаты нельзя,
 * поэтому блок ведёт в реальный раздел отзывов.
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
              единственный источник, который мы используем — без выдуманных цитат.
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
                n: 'с текстом и оценкой',
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
                Тексты отзывов мы не дублируем здесь: их публикует 2ГИС, и там же они
                обновляются. Кнопка выше ведёт к актуальным отзывам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
