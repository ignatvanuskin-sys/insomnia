'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { business } from '@/data/business';
import { dossier } from '@/data/copy';
import { photos, photoHref, type PhotoSource } from '@/data/photos';
import CctvPhoto from './CctvPhoto';
import DotMatrix from './DotMatrix';
import HorrorScene from './HorrorScene';
import Scare from './Scare';

/**
 * МАТЕРИАЛЫ — реальные кадры заведения.
 *
 * Раньше здесь стояли процедурные SVG-сцены с подписью «визуализация»:
 * фотографий не было, а подставлять сток нельзя. Теперь есть настоящие
 * кадры из галереи 2ГИС (файлы лежат в public/photos), поэтому блок честно
 * называется тем, чем является.
 *
 * Три решения, которые здесь важнее вёрстки:
 *  1. Подпись автора под каждым кадром. 8 из 15 кадров загрузили гости —
 *     публиковать их безымянно нельзя.
 *  2. Фильтр «от владельца / от гостей» отделяет юридически чистый набор
 *     от гостевого. Владелец может выключить гостевые кадры одной строкой
 *     в photos.ts, не трогая вёрстку.
 *  3. Лайтбокс открывается по клику и закрывается Esc — кадр можно
 *     рассмотреть, но он остаётся в рамке наблюдения.
 */

type Filter = 'all' | PhotoSource;

const ORDER: Filter[] = ['all', 'owner', 'user', 'entrance'];
const LABEL: Record<Filter, string> = {
  all: 'Все',
  owner: 'От владельца',
  user: 'От гостей',
  entrance: 'Вход',
};

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(
    () => (filter === 'all' ? photos : photos.filter((p) => p.source === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: photos.length, owner: 0, user: 0, entrance: 0 };
    photos.forEach((p) => {
      c[p.source] += 1;
    });
    return c;
  }, []);

  const step = useCallback(
    (dir: number) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        return (cur + dir + shown.length) % shown.length;
      });
    },
    [shown.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  // Смена фильтра не должна оставлять лайтбокс с чужим индексом.
  useEffect(() => {
    setOpen(null);
  }, [filter]);

  const current = open === null ? null : shown[open];

  return (
    <section className="border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
              Материалы
            </p>
            <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
              Что там внутри
            </h2>
            <p className="mt-5 font-mono text-[12px] leading-relaxed text-dust">
              Это настоящие снимки заведения из галереи 2ГИС — {business.photosOnTwoGis} кадра,
              из них {photos.length} мы показываем здесь. Автор указан под каждым кадром.
              Кадры с узнаваемыми лицами гостей и съёмку на улице мы не публикуем: это личное,
              а не интерьер.
            </p>
          </div>
          <DotMatrix className="w-24 shrink-0 sm:w-32" cols={9} rows={3} />
        </div>

        {/* Фильтр по источнику кадра */}
        <div className="reveal mt-8 flex flex-wrap gap-2" role="group" aria-label="Источник кадров">
          {ORDER.map((f) => {
            const on = f === filter;
            if (f !== 'all' && counts[f] === 0) return null;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={on}
                className={`border px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                  on
                    ? 'border-blood-bright bg-blood/15 text-bone'
                    : 'border-iron text-ashlight hover:border-slate hover:text-bone'
                }`}
              >
                {LABEL[f]} <span className="text-dust">{counts[f]}</span>
              </button>
            );
          })}
        </div>

        <div className="reveal mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => (
            <figure key={p.file} className="beam-border">
              <CctvPhoto
                photo={p}
                hud={`CAM ${String(i + 4).padStart(2, '0')}`}
                frameClassName="aspect-3/4"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={i < 4}
                onZoom={() => setOpen(i)}
              />
            </figure>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={business.twoGisPhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-blood/60 bg-blood/12 px-6 py-4 text-center font-mono text-[11px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
          >
            Все {business.photosOnTwoGis} фото и видео на 2ГИС
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

        {/* ---------- ЖУРНАЛ НАБЛЮДЕНИЯ + СКРИМЕР ---------- */}
        <div className="reveal relative mt-20 overflow-hidden border border-iron bg-ash/60">
          {/* «Кипящая» рамка: контур дрожит, как перерисованный от руки */}
          <span
            aria-hidden
            className="boil pointer-events-none absolute inset-0 z-[1] border border-blood/25"
          />
          <div className="scanlines absolute inset-0" aria-hidden />
          <div className="light-leak absolute inset-0" aria-hidden />

          <div className="relative z-10 grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
                Внутренний журнал
              </p>
              <h3 className="mt-4 font-display text-2xl leading-[1.1] font-bold tracking-wide text-bone sm:text-3xl">
                Извлечено из записей камер
              </h3>
              <dl className="mt-7 space-y-4">
                {dossier.map((d) => (
                  <div key={d.code} className="border-l border-iron pl-4">
                    <dt className="font-mono text-[9px] tracking-[0.2em] text-dust/70 uppercase">
                      {d.code}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[12px] leading-relaxed text-ashlight">
                      {d.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col justify-center gap-6 lg:border-l lg:border-iron lg:pl-10">
              <div className="relative aspect-4/3 overflow-hidden border border-iron">
                <HorrorScene uid="dossier-eyes" variant="eyes" />
                <div className="scanlines absolute inset-0" aria-hidden />
                <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.18em] text-dust/60 uppercase">
                  CAM 09 · остаточный кадр
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-dust">
                Фрагмент сохранился не полностью. Кнопка ниже показывает,
                что было в вырезанной части кадра.
              </p>
              <Scare
                label="Показать остаток записи"
                reducedLabel="Запись недоступна — анимация отключена в системе"
              />
              <p className="font-mono text-[10px] leading-relaxed text-dust/70">
                Без звука, короткое затухание. Если в системе включено
                «уменьшить движение», кнопка ничего не покажет.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- ЛАЙТБОКС ---------- */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Кадр: ${current.scene}`}
          className="lb-backdrop fixed inset-0 z-[9990] flex flex-col p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Закрыть кадр"
          />

          <div className="lb-in relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
            <div className="relative min-h-0 flex-1 border border-iron">
              <Image
                src={photoHref(current.file)}
                alt={current.scene}
                fill
                sizes="90vw"
                quality={80}
                className="object-contain"
              />
              <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
              <span className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] text-bone/80 uppercase">
                CAM {String((open ?? 0) + 4).padStart(2, '0')} · архив
              </span>
              <span className="pointer-events-none absolute top-3 right-3 font-mono text-[10px] tracking-[0.18em] text-blood-bright uppercase">
                REC ●
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-[10px] leading-relaxed text-dust">
                <p className="text-ashlight">{current.scene}</p>
                <p>
                  {current.source === 'owner' ? 'фото владельца' : current.credit} ·{' '}
                  {current.date} · источник: 2ГИС
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="border border-iron px-4 py-2.5 font-mono text-[11px] text-ashlight transition-colors hover:border-slate hover:text-bone"
                  aria-label="Предыдущий кадр"
                >
                  ←
                </button>
                <span className="font-mono text-[11px] text-dust tabular-nums">
                  {(open ?? 0) + 1} / {shown.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="border border-iron px-4 py-2.5 font-mono text-[11px] text-ashlight transition-colors hover:border-slate hover:text-bone"
                  aria-label="Следующий кадр"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="border border-blood/60 bg-blood/15 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-bone uppercase transition-colors hover:bg-blood/30"
                >
                  Esc
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
