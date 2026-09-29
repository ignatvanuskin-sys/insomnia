'use client';

import { useCallback, useEffect, useState } from 'react';
import DotMatrix from './DotMatrix';
import HorrorScene from './HorrorScene';

/**
 * Заставка «протокол наблюдателя».
 *
 * ЧТО ИЗМЕНИЛОСЬ И ПОЧЕМУ.
 *
 * 1. Последовательность переехала из таймеров React в CSS (`animation-delay`).
 *    Причина не в экономии строк: пока сцена ждала гидратации, разметки на
 *    странице не было вообще. Пользователь видел первый экран, через секунду
 *    экран закрывался чёрным слоем, и только потом начинался текст. На
 *    телефоне это выглядело как сломанная страница — «просто чёрный экран».
 *    Теперь разметка приходит с сервера и первая же секунда занята движением:
 *    включение кинескопа, полоса развёртки, строки журнала.
 *
 * 2. Полная длительность — 3.2 с вместо 8.75 с. Прежняя версия держала
 *    зрителя на почти чёрном экране девять секунд; с телефона это
 *    неотличимо от незагрузившегося сайта.
 *
 * 3. Тревога получила повод. Раньше в момент «объект обнаружен» была только
 *    красная вспышка — то есть тревога без объекта. Теперь из темноты
 *    проступает силуэт в проёме и в конце кадра подаётся на шаг вперёд;
 *    вспышка и рывок камеры совпадают с его появлением.
 *
 * Что сохранено из прежних решений:
 *  - кнопка «Пропустить» доступна с первой секунды, а на телефоне это
 *    полноценная цель для нажатия (44 px), а не подчёркнутая строка 10 px;
 *  - тап по любому месту кадра тоже пропускает заставку;
 *  - при `prefers-reduced-motion` заставка не показывается вовсе (CSS);
 *  - при повторном заходе в ту же сессию она скрыта атрибутом на <html>,
 *    выставленным до первой отрисовки (см. layout.tsx);
 *  - вспышек не больше двух за 0.5 с — это ниже порога WCAG 2.3.1.
 */

type Line = { text: string; delay: number; corrupted?: string };

/** Строки журнала: 0.26 → 1.10 с. Дальше идёт тревога. */
const LINES: Line[] = [
  { text: 'АРХИВ 04 // КАМЕРА НАБЛЮДЕНИЯ', delay: 260 },
  { text: 'СИГНАЛ ВОССТАНОВЛЕН', delay: 470 },
  { text: 'ОБЪЕКТ В КАДРЕ — ПУСТ', delay: 680 },
  { text: 'ОБЪЕКТ В КАДРЕ — НЕ ПУСТ', delay: 890, corrupted: 'ОБЪЕКТ В КАДРЕ — ПУСТ' },
  { text: 'РЕЗИДЕНТ ВНУТРИ НЕ ЗАРЕГИСТРИРОВАН', delay: 1100 },
];

const TITLE = 'ИНСОМНИЯ';
const SUBTITLE = 'Караганда · Хоррор-квест';
const DONE_KEY = 'insomnia-intro-seen';

export default function Intro() {
  const [skipped, setSkipped] = useState(false);

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(DONE_KEY, '1');
    } catch {
      /* приватный режим — покажем ещё раз при следующем заходе */
    }
    setSkipped(true);
  }, []);

  /* Заставка гасит себя сама (CSS), но память о ней живёт в JS: без этой
     отметки каждый переход по сайту начинался бы с показа заново. Таймер
     ставится после гидратации, поэтому отметка появляется чуть позже
     реального конца сцены — на 3.3 с от монтирования. */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.sessionStorage.setItem(DONE_KEY, '1');
      } catch {
        /* приватный режим */
      }
    }, 3300);
    return () => clearTimeout(t);
  }, []);

  // Клавиатура: пробел / Enter / Escape — пропуск, как на настоящей камере.
  useEffect(() => {
    if (skipped) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skipped, finish]);

  if (skipped) return null;

  return (
    <div
      role="dialog"
      aria-label="Заставка"
      onClick={finish}
      /* crt-on: кадр включается из горизонтальной линии, как кинескоп.
         intro: собственный таймлайн — гашение на 2.86 с и снятие слоя на 3.2 с. */
      className="intro crt-on fixed inset-0 z-[9999] flex flex-col justify-center overflow-hidden bg-void px-6"
    >
      {/* Слои помех и света: ощущение дешёвой камеры наблюдения */}
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
      <div className="tear-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="light-leak pointer-events-none absolute inset-0" aria-hidden />

      {/* Объект в кадре: силуэт в проёме. Появляется вместе с тревогой. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="intro-figure h-[62vh] w-[70vw] max-w-[420px] sm:h-[70vh]">
          <HorrorScene uid="intro" variant="figure" />
        </div>
        <span
          className="intro-blood pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 46%, rgba(168,28,28,0.42), transparent 70%)',
          }}
        />
      </div>

      {/* Затемнение поверх фигуры. Без него проём оказывается ровно за
          строками журнала, и текст теряет читаемость (это поймал прогон
          на 390 px: строки ложились на самое светлое пятно кадра).
          Фигура должна угадываться, а не перекрывать протокол. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(5,5,6,0.42) 0%, rgba(5,5,6,0.6) 60%, rgba(5,5,6,0.8) 100%)',
        }}
      />

      {/* Полоса развёртки — проходит сверху вниз один раз */}
      <span
        className="crt-sweep pointer-events-none absolute inset-x-0 top-0 h-[14vh]"
        aria-hidden
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(201,201,196,0.16) 45%, rgba(168,28,28,0.22) 55%, transparent)',
        }}
      />

      {/* Индикатор записи — слева; справа дублируется обычной точкой REC,
          чтобы кадр читался как запись даже там, где матрица мелкая. */}
      <div className="pointer-events-none absolute top-6 left-6 flex items-center gap-3" aria-hidden>
        <DotMatrix className="w-20" cols={9} rows={2} cycle={0.9} />
        <span className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">запись</span>
      </div>
      <div
        className="pointer-events-none absolute top-6 right-6 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-blood-bright uppercase"
        aria-hidden
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blood-bright" />
        rec
      </div>

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
      <div
        className="alarm-flash pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,28,28,0.6), transparent 70%)',
        }}
      />

      {/* Вся сцена вздрагивает в момент тревоги */}
      <div className="shake-hard relative z-10 mx-auto w-full max-w-md">
        {/* Служебный лог камеры */}
        <div className="mb-6 space-y-1.5 font-mono text-[11px] leading-relaxed tracking-[0.14em] uppercase">
          {LINES.map((l) => (
            <p
              key={l.text}
              className={`intro-line ${l.corrupted ? 'glitch text-ember' : 'text-ashlight'}`}
              data-text={`▸ ${l.corrupted ?? l.text}`}
              style={{ animationDelay: `${l.delay}ms` }}
            >
              <span className="text-blood-bright">▸</span> {l.corrupted ?? l.text}
            </p>
          ))}

          {/* Строка, которая «печатается» и обрывается на полуслове:
              тревога начинается ровно в этот момент. */}
          <p className="intro-line text-ashlight" style={{ animationDelay: '1240ms' }}>
            <span className="text-blood-bright">▸</span> СВЯЗЬ С ОБЪЕКТОМ{' '}
            <span className="caret-hard" />
          </p>
        </div>

        {/* Предупреждение перед названием */}
        <p className="intro-warn mb-5 font-mono text-[11px] tracking-[0.2em] text-blood-bright uppercase">
          ! Внимание: объект обнаружен
        </p>

        {/* Название врывается на экран */}
        <p className="intro-sub mb-3 font-mono text-[10px] tracking-huge text-ashlight uppercase jitter">
          {SUBTITLE}
        </p>
        <h1
          className="intro-title glitch font-display text-[13vw] font-bold text-bone text-shadow-hard sm:text-[9vw] lg:text-[7vw]"
          data-text={TITLE}
        >
          {TITLE}
        </h1>
        <p className="intro-hint mt-5 font-serif text-lg text-dust">Дверь открыта. Входи.</p>
      </div>

      {/* Пропуск: цель не меньше 44 px по высоте — на телефоне прежняя
          подчёркнутая строка 10 px промахивалась мимо пальца. */}
      <button
        type="button"
        onClick={finish}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex min-h-11 w-fit items-center px-4 font-mono text-[11px] tracking-[0.2em] text-dust uppercase underline underline-offset-4 transition-colors hover:text-bone focus-visible:text-bone"
      >
        Пропустить заставку
      </button>
    </div>
  );
}
