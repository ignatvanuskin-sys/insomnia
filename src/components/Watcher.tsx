'use client';

import { useEffect, useRef } from 'react';

/**
 * Взгляд из темноты: две зрачка следят за курсором.
 *
 * Приём «глаз наоборот»: сами глаза почти не видны — видны только две
 * тлеющие точки и их смещение. Смещение маленькое (не более 5 px), потому
 * что большое движение читается как мультик, а малое — как внимание.
 *
 * Работает только при точном указателе: на тач-экране следить не за кем,
 * поэтому компонент остаётся статичным и не подписывается на события.
 */
export default function Watcher({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const left = el.querySelector<SVGGElement>('[data-pupil="l"]');
    const right = el.querySelector<SVGGElement>('[data-pupil="r"]');
    if (!left || !right) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Нормализуем до −1..1 и ограничиваем амплитуду.
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / Math.max(1, r.width)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / Math.max(1, r.height)));
      tx = nx * 5;
      ty = ny * 5;
    };

    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      const t = `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
      left.setAttribute('transform', t);
      right.setAttribute('transform', t);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 120 40" aria-hidden className={className}>
      <defs>
        <radialGradient id="watch-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6a44" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#a81c1c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a81c1c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* тёмные глазницы — почти сливаются с фоном */}
      <ellipse cx="36" cy="20" rx="17" ry="12" fill="#0b0b0d" />
      <ellipse cx="84" cy="20" rx="17" ry="12" fill="#0b0b0d" />
      <circle cx="36" cy="20" r="14" fill="url(#watch-glow)" />
      <circle cx="84" cy="20" r="14" fill="url(#watch-glow)" />
      <g data-pupil="l">
        <circle cx="36" cy="20" r="2.1" fill="#ff8a66" />
      </g>
      <g data-pupil="r">
        <circle cx="84" cy="20" r="2.1" fill="#ff8a66" />
      </g>
    </svg>
  );
}
