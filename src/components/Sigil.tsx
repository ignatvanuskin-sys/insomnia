'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Разделитель-«царапина»: линия не появляется, а прочерчивается.
 *
 * Техника из подборки (stroke draw-on): в разметке у пути стоит
 * `pathLength="1"`, поэтому длина нормализована и dasharray/dashoffset
 * равны единице — не нужно вычислять длину пути в JS.
 *
 * Второй слой — `.boil`: контур дрожит по шуму, как перерисованный
 * от руки. Дрожание включается только после того, как линия прочерчена,
 * иначе смещение мешает самой отрисовке.
 */
type Props = {
  className?: string;
  /** Наклон зубцов: больше — злее линия. */
  jag?: number;
};

export default function Sigil({ className, jag = 3 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setDrawn(true);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Зубчатая линия: мелкие сломы по вертикали, как след от ножа по плёнке.
  const d = Array.from({ length: 26 }, (_, i) => {
    const x = i * 40;
    const y = 12 + (i % 3 === 0 ? -jag : i % 3 === 1 ? jag : 0);
    return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');

  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 24"
      preserveAspectRatio="none"
      aria-hidden
      className={`h-6 w-full ${drawn ? 'boil' : ''} ${className ?? ''}`}
    >
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="var(--color-blood-bright)"
        strokeOpacity="0.5"
        strokeWidth="1"
        className={drawn ? 'draw' : undefined}
        style={drawn ? { animationDelay: '80ms' } : { strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  );
}
