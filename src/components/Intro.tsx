'use client';

import { useEffect, useRef, useState } from 'react';

type Line = { text: string; delay: number };

const LINES: Line[] = [
  { text: 'ARCHIVE 04 // КАМЕРА НАБЛЮДЕНИЯ', delay: 400 },
  { text: 'СИГНАЛ ВОССТАНОВЛЕН', delay: 1500 },
  { text: 'ОБЪЕКТ В КАДРЕ — ПУСТ', delay: 2500 },
  { text: 'РЕЗИДЕНТ ВНУТРИ НЕ ЗАРЕГИСТРИРОВАН', delay: 3400 },
];

/**
 * Вступительная сцена. Показывает не «ещё один сайт»,
 * а последовательность: сигнал → шум → кадр → название.
 * Респект к пользователю: короткая, есть кнопка пропуска,
 * полностью отключается при prefers-reduced-motion.
 */
export default function Intro() {
  // 'pending' — ещё не решали, показывать ли вступление вообще.
  const [phase, setPhase] = useState<'pending' | 'black' | 'lines' | 'title' | 'out' | 'done'>(
    'pending'
  );
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // При отключённой анимации вступление не запускаем вовсе:
    // пользователь не должен ни ждать, ни закрывать его вручную.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }

    setPhase('black');
    const push = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    const last = LINES[LINES.length - 1].delay;

    push(() => setPhase('lines'), 200);
    push(() => setPhase('title'), last + 900);
    push(() => setPhase('out'), last + 2600);
    push(() => setPhase('done'), last + 3900);

    const scheduled = timers.current;
    return () => scheduled.forEach(clearTimeout);
  }, []);

  if (phase === 'pending' || phase === 'out' || phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-void px-6 pb-16 sm:pb-24"
      aria-hidden={phase === 'title'}
    >
      {/* мерцающий «объектив» */}
      <div
        className="pointer-events-none absolute inset-0 light-leak"
        style={{ opacity: phase === 'black' ? 0 : 1, transition: 'opacity 1.2s ease' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-md">
        {phase !== 'black' && (
          <div className="mb-8 space-y-1.5 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-ashlight uppercase">
            {LINES.map((l) => (
              <p
                key={l.text}
                className="scanlines"
                style={{
                  opacity: 0,
                  animation: `revealLine 0.5s var(--ease-slow) ${l.delay}ms forwards`,
                }}
              >
                <span className="text-blood-bright">▸</span> {l.text}
              </p>
            ))}
          </div>
        )}

        {phase === 'title' && (
          <div className="anim-title">
            <p className="mb-3 font-mono text-[10px] tracking-huge text-ashlight uppercase flicker">
              Караганда · Хоррор-квест
            </p>
            <h1 className="font-display text-[13vw] leading-[0.85] font-black tracking-[0.06em] text-bone text-shadow-hard sm:text-[9vw] lg:text-[7vw]">
              ИНСОМНИЯ
            </h1>
          </div>
        )}

        {phase !== 'black' && (
          <button
            type="button"
            onClick={() => {
              timers.current.forEach(clearTimeout);
              setPhase('done');
            }}
            className="mt-8 font-mono text-[10px] tracking-[0.2em] text-dust uppercase underline underline-offset-4 transition-colors hover:text-ashlight"
          >
            Пропустить
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes revealLine {
          from {
            opacity: 0;
            transform: translateX(-6px);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
        .anim-title {
          animation: titleIn 1.5s var(--ease-slow) both;
        }
        @keyframes titleIn {
          from {
            opacity: 0;
            letter-spacing: 0.5em;
            filter: blur(10px);
          }
          to {
            opacity: 1;
            letter-spacing: 0.06em;
            filter: none;
          }
        }
      `}</style>
    </div>
  );
}
