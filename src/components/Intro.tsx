'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Line = { text: string; delay: number; corrupted?: string };

/**
 * Протокол наблюдателя. Строки выводятся как служебный лог камеры,
 * но одна из них «ломается» — это и есть момент ужаса:
 * система фиксирует присутствие, которого быть не должно.
 */
const LINES: Line[] = [
  { text: 'АРХИВ 04 // КАМЕРА НАБЛЮДЕНИЯ', delay: 500 },
  { text: 'СИГНАЛ ВОССТАНОВЛЕН', delay: 1600 },
  { text: 'ОБЪЕКТ В КАДРЕ — ПУСТ', delay: 2700 },
  { text: 'ОБЪЕКТ В КАДРЕ — НЕ ПУСТ', delay: 3500, corrupted: 'ОБЪЕКТ В КАДРЕ — ПУСТ' },
  { text: 'РЕЗИДЕНТ ВНУТРИ НЕ ЗАРЕГИСТРИРОВАН', delay: 4600 },
];

const TITLE = 'ИНСОМНИЯ';
const SUBTITLE = 'Караганда · Хоррор-квест';
const DONE_KEY = 'insomnia-intro-seen';

/**
 * Вступительная сцена. Логика: зритель заходит на сайт и видит не сайт,
 * а кадр с камеры наблюдения, который постепенно выходит из строя.
 *
 * Требования, которые здесь соблюдаются:
 *  - кнопка «Пропустить» доступна с первой секунды;
 *  - при prefers-reduced-motion сцена не запускается вообще;
 *  - показывается один раз за сессию (sessionStorage), чтобы не преследовать;
 *  - анимации только CSS, без таймерных тиков на каждый кадр.
 */
export default function Intro() {
  const [phase, setPhase] = useState<'pending' | 'lines' | 'alarm' | 'title' | 'out' | 'done'>(
    'pending'
  );
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    try {
      window.sessionStorage.setItem(DONE_KEY, '1');
    } catch {
      /* приватный режим — покажем ещё раз при следующем заходе */
    }
    setPhase('done');
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }

    // Не мучаем того, кто уже это видел в этой сессии.
    try {
      if (window.sessionStorage.getItem(DONE_KEY) === '1') {
        setPhase('done');
        return;
      }
    } catch {
      /* нет доступа к sessionStorage — показываем */
    }

    const push = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    push(() => setPhase('lines'), 250);
    push(() => setPhase('alarm'), 5400);
    push(() => setPhase('title'), 6000);
    push(() => setPhase('out'), 8200);
    push(() => setPhase('done'), 9000);

    const scheduled = timers.current;
    return () => scheduled.forEach(clearTimeout);
  }, []);

  // Пробел / Enter / Escape — пропуск, как на настоящей камере.
  useEffect(() => {
    if (phase === 'pending' || phase === 'done' || phase === 'out') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, finish]);

  if (phase === 'pending' || phase === 'out' || phase === 'done') return null;

  const showLines = phase === 'lines';
  const showAlarm = phase === 'alarm';
  const showTitle = phase === 'title';

  return (
    <div
      role="dialog"
      aria-label="Заставка"
      className="fixed inset-0 z-[9999] flex flex-col justify-end overflow-hidden bg-void px-6 pb-16 sm:pb-24"
    >
      {/* Слои помех и света: ощущение дешёвой камеры наблюдения */}
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
      <div className="tear-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="light-leak pointer-events-none absolute inset-0" aria-hidden />

      {/* Виньетка медленно сжимается — зрителя будто затягивает */}
      <div
        className="vignette-close pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, transparent 25%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Красная вспышка в момент, когда «объект» появляется в кадре */}
      {showAlarm && (
        <div
          className="alarm-flash pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(168,28,28,0.55), transparent 70%)',
          }}
        />
      )}

      {/* Вся сцена вздрагивает в момент тревоги */}
      <div className={`relative z-10 mx-auto w-full max-w-md ${showAlarm ? 'shake' : ''}`}>
        {/* Служебный лог камеры */}
        {showLines && (
          <div className="mb-8 space-y-1.5 font-mono text-[10px] leading-relaxed tracking-[0.14em] uppercase">
            {LINES.map((l) => (
              <p
                key={l.text}
                className={`signal-in ${l.corrupted ? 'glitch text-blood-bright' : 'text-ashlight'}`}
                data-text={l.corrupted ?? l.text}
                style={{ animationDelay: `${l.delay}ms` }}
              >
                <span className="text-blood-bright">▸</span> {l.corrupted ?? l.text}
              </p>
            ))}

            {/* Строка, которая «печатается» и обрывается на полуслове */}
            <p className="signal-in text-dust" style={{ animationDelay: '5400ms' }}>
              <span className="text-blood-bright">▸</span> СВЯЗЬ С ОБЪЕКТОМ{' '}
              <span className="caret-hard" />
            </p>
          </div>
        )}

        {/* Предупреждение перед названием */}
        {showAlarm && (
          <p className="signal-in mb-6 font-mono text-[11px] tracking-[0.2em] text-blood-bright uppercase">
            ! Внимание: объект обнаружен
          </p>
        )}

        {/* Название врывается на экран */}
        {showTitle && (
          <div>
            <p className="title-slam mb-3 font-mono text-[10px] tracking-huge text-ashlight uppercase jitter">
              {SUBTITLE}
            </p>
            <h1
              className="title-slam glitch font-display text-[13vw] font-bold text-bone text-shadow-hard sm:text-[9vw] lg:text-[7vw]"
              data-text={TITLE}
              style={{ animationDelay: '120ms' }}
            >
              {TITLE}
            </h1>
            <p
              className="signal-in mt-5 font-serif text-lg text-dust"
              style={{ animationDelay: '700ms' }}
            >
              Дверь открыта. Входи.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={finish}
          className="mt-8 font-mono text-[10px] tracking-[0.2em] text-dust uppercase underline underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone"
        >
          Пропустить заставку
        </button>
      </div>
    </div>
  );
}
