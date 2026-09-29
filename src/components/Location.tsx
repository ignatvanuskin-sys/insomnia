import Image from 'next/image';
import { business, quests } from '@/data/business';
import { facadePhoto, photoFocus, photoHref } from '@/data/photos';
import TwoGisMap from './TwoGisMap';

const GEO_URL = `https://2gis.kz/geo/${business.coords.lon},${business.coords.lat}`;
const ROUTE_URL = `https://2gis.kz/karaganda/route/${business.coords.lon},${business.coords.lat}`;

/** Единственная подтверждённая цена в прайс-листе 2ГИС. */
const PRICED = quests.find((q) => q.price);

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

            {/* Фасад: единственный дневной кадр в подборке. Он тут не для
                атмосферы, а чтобы человека не искали во дворах ночью. */}
            <figure className="mt-7">
              <div className="cctv relative aspect-4/3">
                <Image
                  src={photoHref(facadePhoto)}
                  alt={`Фасад здания по адресу ${business.addressShort}, Караганда`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={72}
                  className="object-cover"
                  style={{ objectPosition: photoFocus(facadePhoto) }}
                />
                <span className="absolute top-3 left-3 z-[5] font-mono text-[9px] tracking-[0.18em] text-bone/80 uppercase">
                  Вход · 2ГИС
                </span>
              </div>
              <figcaption className="mt-2 font-mono text-[9px] text-dust">
                Фасад: улица Новосёлов, 145/1 · фото Zhanara M · 2ГИС
              </figcaption>
            </figure>

            <address className="mt-7 font-body text-[15px] leading-relaxed text-ashlight not-italic">
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
                <dt className="text-dust">Оплата</dt>
                <dd className="text-right text-bone">{business.paymentMethods.join(', ')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Ориентир</dt>
                <dd className="text-right text-bone">
                  {business.nearestLandmark.name} · {business.nearestLandmark.walk},{' '}
                  {business.nearestLandmark.distance}
                </dd>
              </div>
              {business.parking ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-dust">Парковка</dt>
                  <dd className="text-right text-bone">{business.parking}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-dust">Помимо квеста</dt>
                <dd className="text-right text-bone">{business.extraServices.join(' · ')}</dd>
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
                href={ROUTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blood/60 bg-blood/12 px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
              >
                Построить маршрут в 2ГИС
              </a>
              <a
                href={GEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-iron px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                Карточка на 2ГИС
              </a>
              <a
                href={business.twoGisPricesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-iron px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                Прайс-лист на 2ГИС
                {PRICED?.price ? ` · ${PRICED.price}` : ''}
              </a>
            </div>
          </div>

          <TwoGisMap />
        </div>
      </div>
    </section>
  );
}
