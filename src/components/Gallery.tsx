import { business } from '@/data/business';

/**
 * Галерея. Реальные фотографии закрыты антибот-защитой 2ГИС,
 * поэтому мы НЕ подставляем сторонний сток и не выдаём его за квест.
 * Вместо этого — честный блок с прямой ссылкой на настоящие источники.
 */
const FRAMES = [
  { code: 'CAM 04', t: 'Входная зона' },
  { code: 'CAM 07', t: 'Основной зал' },
  { code: 'CAM 11', t: 'Реквизит' },
  { code: 'CAM 12', t: 'Интерьер' },
];

export default function Gallery() {
  return (
    <section className="border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
            Материалы
          </p>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
            Что там внутри
          </h2>
          <p className="mt-5 font-mono text-[12px] leading-relaxed text-dust">
            Настоящие фотографии локаций, реквизита и интерьера выложены на 2ГИС и в
            официальном аккаунте. Мы не ставим чужие стоковые снимки и не выдаём их за этот квест.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FRAMES.map((f) => (
            <div
              key={f.code}
              className="reveal relative aspect-4/5 overflow-hidden border border-iron bg-ash"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: [
                    'radial-gradient(ellipse 60% 50% at 40% 30%, #1b1b20 0%, transparent 65%)',
                    'linear-gradient(200deg, #0d0d10 0%, #060607 100%)',
                  ].join(','),
                }}
                aria-hidden
              />
              <div className="scanlines absolute inset-0" aria-hidden />
              <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.18em] text-dust/70 uppercase">
                {f.code}
              </span>
              <span className="absolute right-3 bottom-3 font-mono text-[9px] tracking-[0.18em] text-dust/50 uppercase">
                нет доступа
              </span>
              <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.12em] text-dust/70">
                {f.t}
              </span>
            </div>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={business.twoGisPhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-blood/60 bg-blood/12 px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
          >
            {business.photosOnTwoGis} фото на 2ГИС
          </a>
          <a
            href={business.instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-iron px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
