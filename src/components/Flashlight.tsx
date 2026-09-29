'use client';

import { useEffect, useRef } from 'react';

/**
 * Фонарик: тьма, которая расходится вокруг курсора.
 *
 * Техника из подборки (flashlight mask cursor) — чёрный слой с прозрачным
 * отверстием в радиальном градиенте; координаты центра приходят из JS.
 *
 * Две детали, без которых эффект ломается:
 *  1. Позиция не приклеена к курсору, а догоняет его (линейная интерполяция
 *     в rAF). Ровно под курсором свет выглядит как маска, с задержкой —
 *     как живое пятно.
 *  2. Радиус дышит по синусу: тьма то подступает, то отходит.
 *
 * Включается только при точном указателе и включённом движении: на тач-экране
 * и при prefers-reduced-motion слой не создаётся вовсе (а не просто прячется),
 * чтобы не ловить лишние кадры.
 */
export default function Flashlight() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 50;
    let ty = 50;
    let x = 50;
    let y = 50;
    // Куда смещать пятно, когда указатель вне блока: к ближайшему краю.
    let outside = false;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;

      // ВАЖНО: без ограничения 0..100 пятно уезжало за пределы блока
      // (наблюдали --fl-y: 379 %), прозрачная зона оказывалась вне кадра,
      // и весь блок становился сплошным чёрным прямоугольником.
      tx = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      ty = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));

      outside =
        e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    // 0.9, а не 1: даже при полностью «чёрном» состоянии кадр читается.
    el.style.opacity = '0.9';

    // Когда указатель не над блоком, слой почти снимается — иначе блок,
    // мимо которого человек проскроллил, остаётся чёрной полосой.
    el.style.transition = 'opacity 0.6s ease';

    const loop = (now: number) => {
      if (!running) return;
      x += (tx - x) * 0.13;
      y += (ty - y) * 0.13;
      el.style.setProperty('--fl-x', `${x.toFixed(2)}%`);
      el.style.setProperty('--fl-y', `${y.toFixed(2)}%`);
      el.style.setProperty('--fl-r', `${(20 + Math.sin(now / 1700) * 2.4).toFixed(2)}rem`);
      el.style.opacity = outside ? '0.42' : '0.9';
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="flashlight"
      style={{ opacity: 0, transition: 'opacity 1.2s ease' }}
    />
  );
}
