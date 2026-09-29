/**
 * Точечная матрица — индикатор «прибора» (техника из подборки dotmatrix).
 *
 * Каждая точка получает индекс через `--i`, а задержка анимации считается
 * в CSS как index × шаг × цикл. Одна переменная `--dmx-k` меняет рисунок
 * волны: 0.045 — косая «змейка», 0.09 — редкая волна, −0.045 — обратный ход.
 * Таймеров нет, кадры считает композитор.
 */
import type { CSSProperties } from 'react';

type Props = {
  cols?: number;
  rows?: number;
  /** Шаг задержки: задаёт направление и плотность волны. */
  k?: number;
  cycle?: number;
  className?: string;
};

export default function DotMatrix({ cols = 9, rows = 3, k = 0.045, cycle = 1.9, className }: Props) {
  const cells = cols * rows;
  return (
    <span
      aria-hidden
      className={`dmx ${className ?? ''}`}
      style={
        {
          '--dmx-cols': cols,
          '--dmx-k': k,
          '--dmx-cycle': `${cycle}s`,
        } as CSSProperties
      }
    >
      {Array.from({ length: cells }, (_, i) => (
        <i key={i} style={{ '--i': i } as CSSProperties} />
      ))}
    </span>
  );
}
