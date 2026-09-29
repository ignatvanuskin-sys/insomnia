'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  /** Текст на кнопке. */
  label: string;
  /** Что показать, если анимация отключена в системе. */
  reducedLabel?: string;
};

/**
 * Скример по нажатию.
 *
 * Сознательные ограничения, из-за которых он не вредит продукту:
 *  1. Вешается НЕ на кнопку записи/покупки. Человек, который пришёл
 *     оставить заявку, не должен получать по лицу картинкой.
 *  2. Полностью отключается при prefers-reduced-motion — там это
 *     не «эффект», а реальный дискомфорт и потенциальный триггер.
 *  3. Короткий (560 мс), не мигает быстро и не использует звук.
 *  4. aria-live не используется: экранный диктор не озвучивает крик,
 *     сцена помечена aria-hidden и для скринридера пуста.
 */
export default function Scare({ label, reducedLabel }: Props) {
  const [firing, setFiring] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const fire = useCallback(() => {
    if (reduced) return;
    if (timer.current) clearTimeout(timer.current);
    // Перезапуск анимации: снимаем класс и возвращаем через кадр.
    setFiring(false);
    requestAnimationFrame(() => setFiring(true));
    timer.current = setTimeout(() => setFiring(false), 560);
  }, [reduced]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={fire}
        className="border border-iron px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
      >
        {reduced ? (reducedLabel ?? label) : label}
      </button>

      {firing && (
        <span className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden>
          <span className="scare-flash" />
          {/*
            ЗДЕСЬ НЕТ ЛИЦА — И ЭТО СПЕЦИАЛЬНО.

            Три версии подряд читались как мультяшная маска: светлый овал,
            большие круглые зрачки, «улыбка». Меняя форму, я только
            отдалял карикатуру от «жуткой», но не убирал её: рисованное
            лицо в SVG почти всегда скатывается в маску или в emoji.

            Работает приём отсутствия: тёмная бесформенная масса, из
            глубины которой проступают две горящие точки. Мозг
            додумывает лицо сам, и оно всегда получается страшнее
            нарисованного. Плюс решение принципиально не устаревает:
            его невозможно принять за карикатуру.
          */}
          <div className="scare-stage">
            <svg viewBox="0 0 100 120" className="scare-face" aria-hidden>
              <defs>
                <radialGradient id="scare-mass" cx="50%" cy="46%" r="58%">
                  <stop offset="0%" stopColor="#1a1512" />
                  <stop offset="55%" stopColor="#0b0908" />
                  <stop offset="100%" stopColor="#050506" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="scare-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff5533" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#a81c1c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a81c1c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* бесформенная масса: контур неровный, края растворяются */}
              <path
                d="M50 4c21 0 33 15 35 36 1 12-3 18-4 27-1 8 2 13-1 21-4 12-15 20-30 20s-26-8-30-20c-3-8 0-13-1-21-1-9-5-15-4-27 2-21 14-36 35-36z"
                fill="url(#scare-mass)"
              />
              {/* точки глаз: маленькие, тусклые, с ореолом */}
              <circle cx="39" cy="52" r="7" fill="url(#scare-glow)" />
              <circle cx="61" cy="52" r="7" fill="url(#scare-glow)" />
              <circle cx="39" cy="52" r="1.6" fill="#ff7a55" />
              <circle cx="61" cy="52" r="1.6" fill="#ff7a55" />
            </svg>
          </div>
          <span className="scare-static" />
        </span>
      )}
    </div>
  );
}
