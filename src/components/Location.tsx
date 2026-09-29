import { business } from '@/data/business';

const MAPS_URL = `https://yandex.ru/maps/?pt=${business.coords.lon},${business.coords.lat}&z=17&l=map`;
const YANDEX_EMBED = `https://yandex.ru/map-widget/v1/?ll=${business.coords.lon}%2C${business.coords.lat}&z=17&mode=search&text=${encodeURIComponent(
  business.address
)}`;

export default function Location() {
  return (
    <section className="border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="reveal">
            <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
              Где искать
            </p>
            <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
              Караганда
            </h2>

            <address className="mt-7 font-mono text-[13px] leading-relaxed text-ashlight not-italic">
              {business.address}
            </address>

            <dl className="mt-7 space-y-3 border-t border-iron pt-5 font-mono text-[12px]">
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Режим работы</dt>
                <dd className="text-right text-bone tabular-nums">
                  {business.schedule.days}, {business.schedule.from} — {business.schedule.to}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Телефон</dt>
                <dd>
                  <a href={business.phoneHref} className="link-unfurl text-bone tabular-nums">
                    {business.phone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Индекс</dt>
                <dd className="text-bone tabular-nums">{business.postalCode}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Координаты</dt>
                <dd className="text-bone tabular-nums">
                  {business.coords.lat}, {business.coords.lon}
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-col gap-2.5">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blood/60 bg-blood/12 px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
              >
                Построить маршрут
              </a>
              <a
                href={business.twoGisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-iron px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                Открыть в 2ГИС
              </a>
            </div>
          </div>

          <div className="reveal relative aspect-4/3 overflow-hidden border border-iron bg-ash sm:aspect-16/11">
            <iframe
              title={`Карта: ${business.name}, ${business.addressShort}`}
              src={YANDEX_EMBED}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
