'use client';

import { useEffect, useState } from 'react';

/**
 * Таймкод камеры наблюдения. Ночная смена 02:47.
 * Пасхалка: раз в несколько минут метка времени «сбоит».
 */
export default function CctvStamp({ className = '' }: { className?: string }) {
  const [time, setTime] = useState('02:47:00');
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fmt = (d: Date) =>
      [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, '0'))
        .join(':');

    const t = setInterval(() => {
      // базовая ночная смена: 02:47 + прошедшее время
      const base = new Date();
      base.setHours(2, 47, Math.floor(base.getSeconds() / 7) * 7);
      setTime(fmt(base));
    }, 1000);

    const g = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 420);
    }, 47000);

    return () => {
      clearInterval(t);
      clearInterval(g);
    };
  }, []);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        aria-hidden
        className={`inline-block h-1 w-1 rounded-full bg-blood-bright ${glitch ? 'opacity-0' : 'opacity-80'}`}
      />
      <span
        className="tabular-nums"
        style={glitch ? { filter: 'blur(1.5px)', opacity: 0.6 } : undefined}
      >
        {time}
      </span>
    </span>
  );
}
