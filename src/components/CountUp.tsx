'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Счётчик, который «докручивается» до числа при появлении в кадре
 * (техника number ticker из подборки).
 *
 * Почему не CSS: число произвольное, а CSS-перебор цифр требует
 * известного набора кадров. Здесь один rAF-цикл длиной 1.1 с на элемент,
 * а не бесконечная анимация, поэтому нагрузка нулевая.
 *
 * При prefers-reduced-motion и при отсутствии IntersectionObserver
 * значение выставляется сразу — человек видит цифру, а не пустоту.
 */
type Props = {
  to: number;
  /** Знаков после запятой. */
  decimals?: number;
  duration?: number;
  className?: string;
};

export default function CountUp({ to, decimals = 0, duration = 1100, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Без наблюдателя число просто выставляется: показать ноль вместо
    // рейтинга хуже, чем показать рейтинг без анимации.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const started = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - started) / duration);
          // easeOutQuad: быстрый разгон и мягкая остановка
          setValue(to * (1 - (1 - p) * (1 - p)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
    </span>
  );
}
