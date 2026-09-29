'use client';

import { useEffect, useRef, useState } from 'react';
import { business } from '@/data/business';

/**
 * Карта 2ГИС.
 *
 * ВАЖНО: официального keyless-embed у 2ГИС не существует.
 * Старый iframe-хост `map.2gis.ru` больше не существует в DNS, а все
 * страницы 2ГИС отдают `Content-Security-Policy: frame-ancestors 'none'`,
 * то есть встроить их в iframe нельзя технически. Поэтому используется
 * официальный MapGL JS API — для него нужен ключ.
 *
 * Ключ берётся из NEXT_PUBLIC_2GIS_KEY. Без ключа показывается
 * стилизованная заглушка с точными координатами и ссылками на 2ГИС —
 * страница остаётся полезной, ничего не «дорисовываем».
 */
const MAP_KEY = process.env.NEXT_PUBLIC_2GIS_KEY ?? '';

const { lat, lon } = business.coords;
const GEO_URL = `https://2gis.kz/geo/${lon},${lat}`;
const ROUTE_URL = `https://2gis.kz/karaganda/route/${lon},${lat}`;

const SCRIPT_ID = 'two-gis-mapgl';

type State = 'loading' | 'ready' | 'failed';

export default function TwoGisMap() {
  const holder = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>(MAP_KEY ? 'loading' : 'failed');

  useEffect(() => {
    if (!MAP_KEY || !holder.current) return;

    let cancelled = false;
    let instance: { destroy: () => void } | null = null;

    const boot = () => {
      if (cancelled || !holder.current) return;
      const DG = (window as unknown as { DG?: { MapGl?: unknown } }).DG;
      const MapGl = DG?.MapGl as
        | { Map: new (el: HTMLElement, opts: Record<string, unknown>) => { destroy: () => void } }
        | undefined;

      if (!MapGl?.Map) {
        setState('failed');
        return;
      }
      try {
        instance = new MapGl.Map(holder.current, {
          center: [lon, lat],
          zoom: 17,
          viewState: { animate: false },
        });
        // 2ГИС рисует светлые подписи — перекрашиваем карту под тёмную тему.
        holder.current.style.filter =
          'invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.85) contrast(1.05)';
        setState('ready');
      } catch {
        setState('failed');
      }
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if ((window as unknown as { DG?: unknown }).DG) boot();
      else existing.addEventListener('load', boot, { once: true });
    } else {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = `https://maps.api.2gis.ru/2.0/loader.js?key=${encodeURIComponent(MAP_KEY)}&modules=MapGL`;
      s.async = true;
      s.onload = boot;
      s.onerror = () => setState('failed');
      document.head.appendChild(s);
    }

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  return (
    <div className="reveal beam-border relative aspect-4/3 overflow-hidden border border-iron bg-ash sm:aspect-16/11">
      {MAP_KEY && <div ref={holder} className="absolute inset-0" aria-label="Карта 2ГИС" />}

      {state !== 'ready' && (
        <MapPlaceholder label={MAP_KEY ? 'Загрузка карты 2ГИС…' : 'Карта 2ГИС'} quiet={!MAP_KEY} />
      )}

      {/* Атмосферные слои поверх карты — тот же визуальный язык, что на сайте */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 50% 50%, transparent 40%, rgba(5,5,6,0.7) 100%)',
        }}
      />

      {/* Метка адреса */}
      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 border border-iron/80 bg-void/85 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-blood-bright" aria-hidden />
        <span className="font-mono text-[9px] tracking-[0.18em] text-ashlight uppercase">
          {business.addressShort}
        </span>
      </div>

      {/* Ссылки: карточка и маршрут в 2ГИС */}
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
        <a
          href={GEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border border-blood/60 bg-void/85 px-4 py-3 text-center font-mono text-[10px] tracking-[0.18em] text-bone uppercase backdrop-blur-sm transition-colors hover:border-blood-bright hover:bg-blood/25 sm:flex-none"
        >
          Открыть в 2ГИС
        </a>
        <a
          href={ROUTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border border-iron bg-void/85 px-4 py-3 text-center font-mono text-[10px] tracking-[0.18em] text-ashlight uppercase backdrop-blur-sm transition-colors hover:border-slate hover:text-bone sm:flex-none"
        >
          Маршрут
        </a>
      </div>
    </div>
  );
}

/**
 * Заглушка на случай отсутствия ключа или ошибки загрузки карты.
 * Показывает реальные координаты адреса, а не рисует выдуманную схему.
 */
function MapPlaceholder({ label, quiet = false }: { label: string; quiet?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 60% 50% at 50% 40%, #16161a 0%, transparent 70%)',
            'linear-gradient(180deg, #0a0a0c 0%, #050506 100%)',
          ].join(','),
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(85,85,95,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(85,85,95,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Перекрестье с пульсирующей точкой */}
      <div className="relative flex flex-col items-center" aria-hidden>
        <span className="h-7 w-px bg-gradient-to-b from-transparent to-blood-bright" />
        <span className="h-2.5 w-2.5 rounded-full border border-blood-bright bg-void shadow-[0_0_14px_var(--color-blood-bright)]" />
        <span className="h-7 w-px bg-gradient-to-t from-transparent to-blood-bright" />
      </div>

      <p
        className={`relative font-mono text-[10px] tracking-[0.2em] uppercase ${
          quiet ? 'text-dust' : 'text-ashlight'
        }`}
      >
        {label}
      </p>
      <p className="relative font-mono text-[9px] tracking-[0.14em] text-dust/70 uppercase tabular-nums">
        {lat}, {lon}
      </p>
    </div>
  );
}


