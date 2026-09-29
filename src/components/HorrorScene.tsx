/**
 * Процедурный хоррор-арт на чистом SVG.
 *
 * ПОЧЕМУ ЗДЕСЬ НЕТ <img> С ФОТОГРАФИЯМИ:
 * стоковые снимки чужих помещений защищены авторским правом, а главное —
 * выдавали бы их за интерьер этого квеста. Реальные фотографии локаций
 * лежат на 2ГИС и в Instagram, на них ведут прямые ссылки в Gallery.
 * Вместо выдуманных снимков — сгенерированные сцены: они не врут
 * о помещении, но дают нужную атмосферу и стоят 0 байт трафика.
 *
 * Компонент остаётся серверным: уникальные id градиентов передаются
 * снаружи через `uid`, поэтому useId (и граница 'use client') не нужны.
 */

export type HorrorVariant = 'corridor' | 'figure' | 'eyes' | 'static' | 'lamp';

type Props = {
  /** Уникальный префикс для id градиентов — обязателен, если сцена на странице не одна. */
  uid: string;
  variant: HorrorVariant;
  className?: string;
};

const LABEL: Record<HorrorVariant, string> = {
  corridor: 'Тёмный коридор, уходящий в проём',
  figure: 'Силуэт в освещённом дверном проёме',
  eyes: 'Глаза, которые появляются в темноте',
  static: 'Срыв видеосигнала',
  lamp: 'Качающаяся лампа над полом',
};

function Scene({ uid, variant }: { uid: string; variant: HorrorVariant }) {
  switch (variant) {
    /* --- Коридор: перспектива с освещённым проёмом в конце ---
       Перспектива строится от точек схода (50, 71) — центра проёма.
       Чтобы кадр читался как помещение, а не как тёмный ромб, на
       стенах идут линии-рельсы, сходящиеся к проёму. */
    case 'corridor':
      return (
        <>
          <rect width="100" height="140" fill="#0a0a0d" />
          {/* потолок */}
          <path d="M0 0h100L62 54H38Z" fill="#0d0d11" />
          {/* стены: заметно светлее потолка, иначе перспектива не читается */}
          <path d="M0 0l38 54v34L0 140Z" fill="#1a1a20" />
          <path d="M100 0L62 54v34l38 52Z" fill="#16161b" />
          {/* пол — ловит отсвет от проёма */}
          <path d="M0 140l38-52h24l38 52Z" fill="#131318" />
          {/* рельсы на стенах: сходятся к точке схода */}
          <g stroke="#4a4a55" strokeWidth="0.5" fill="none" opacity="0.55">
            <path d="M0 105 38 79.5" />
            <path d="M0 70 38 71" />
            <path d="M0 35 38 62.5" />
            <path d="M100 105 62 79.5" />
            <path d="M100 70 62 71" />
            <path d="M100 35 62 62.5" />
          </g>
          {/* швы пола, сходящиеся к проёму */}
          <g stroke="#3a3a44" strokeWidth="0.4" fill="none" opacity="0.5">
            <path d="M6 140 39 88" />
            <path d="M28 140 45 88" />
            <path d="M72 140 55 88" />
            <path d="M94 140 61 88" />
          </g>
          {/* проём в конце — единственный источник света в кадре */}
          <rect
            x="38"
            y="54"
            width="24"
            height="34"
            fill={`url(#${uid}-door)`}
            className="hs-breathe"
          />
          {/* свет, падающий из проёма на пол */}
          <path d="M38 88h24l10 20H28z" fill={`url(#${uid}-spill)`} opacity="0.55" />
          {/* тёплый отсвет на косяке — мягкий, не неоновый контур */}
          <rect
            x="37"
            y="53"
            width="26"
            height="36"
            fill="none"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="1.6"
            opacity="0.5"
          />
        </>
      );

    /* --- Силуэт в проёме ---
       Важно: фигура намеренно НЕ симметрична и смазана. Идеальный круг
       с равными плечами читается как иконка «аватар», а не как живой
       человек — поэтому голова смещена, линия плеч ломается, а поверх
       кладётся шум, чтобы край «рассыпался». */
    case 'figure':
      return (
        <>
          <rect width="100" height="140" fill="#08080b" />
          {/* проём со светом из-за двери */}
          <rect x="24" y="12" width="52" height="112" fill={`url(#${uid}-glow)`} />
          <g className="hs-breathe">
            {/* Голова — эллипс, смещённый влево, с «капюшоном» */}
            <ellipse cx="46" cy="66" rx="8.5" ry="10.5" fill="#08080a" />
            <path d="M46 54c8 0 11 6 11 12 0 5-2 9-4 11-1-8-3-16-7-23z" fill="#08080a" />
            {/* Плечи: асимметричны и уходят вниз за край проёма —
                фигура обрезана кадром, а не «закончена» контуром.
                Ровная дуга с круглой головой читалась бы как иконка аватара. */}
            <path
              d="M46 78c-10 0-17 8-19 19l-3 27h18l2-14 3 14h14l1-15 4 15h20l-2-30c-1-10-9-16-18-16z"
              fill="#08080a"
            />
          </g>
          {/* створка двери справа — перекрывает часть света */}
          <rect x="70" y="12" width="6" height="112" fill="#1c1c22" />
          {/* шум поверх: край фигуры не должен быть «вырезан» из кадра */}
          <rect
            width="100"
            height="140"
            filter={`url(#${uid}-noise)`}
            opacity="0.3"
            className="hs-grain"
          />
          {/* затемнение по краям кадра — имитация плохой экспозиции */}
          <rect width="100" height="140" fill={`url(#${uid}-edge)`} />
        </>
      );

    /* --- Глаза в темноте ---
       Череп намеренно рисуется неровным многоугольником, а не овалом:
       ровная эллипсоидная форма читается как иконка профиля. */
    case 'eyes':
      return (
        <>
          <rect width="100" height="140" fill="#08080b" />
          <path
            d="M50 26c16 0 27 12 29 27 2 16-4 24-9 33-4 7-6 22-20 22s-16-15-20-22c-5-9-11-17-9-33 2-15 13-27 29-27z"
            fill="#0e0e12"
          />
          <circle cx="39" cy="66" r="11" fill={`url(#${uid}-halo)`} />
          <circle cx="61" cy="66" r="11" fill={`url(#${uid}-halo)`} />
          <g className="hs-blink">
            {/* зрачки смещены вбок: взгляд не смотрит в объектив */}
            <ellipse cx="40.5" cy="66" rx="4.2" ry="2.6" fill="#e6e0d4" opacity="0.92" />
            <ellipse cx="62.5" cy="66" rx="4.2" ry="2.6" fill="#e6e0d4" opacity="0.92" />
          </g>
          <rect
            width="100"
            height="140"
            filter={`url(#${uid}-noise)`}
            opacity="0.22"
            className="hs-grain"
          />
          <rect width="100" height="140" fill={`url(#${uid}-edge)`} />
        </>
      );

    /* --- Помехи: кадр, который рассыпается ---
       Шум feTurbulence сам по себе тёмный, поэтому поверх него кладём
       светлый слой: без него «помехи» не видны на чёрном фоне. */
    case 'static':
      return (
        <>
          <rect width="100" height="140" fill="#0a0a0d" />
          <rect
            width="100"
            height="140"
            filter={`url(#${uid}-noise)`}
            opacity="0.85"
            className="hs-grain"
          />
          <rect
            width="100"
            height="140"
            filter={`url(#${uid}-noise)`}
            opacity="0.13"
            className="hs-grain"
          />
          <rect
            width="100"
            height="140"
            fill="#050507"
            opacity="0.45"
          />
          {/* сильное затемнение по краям: «помехи» не должны быть
              самым ярким пятном страницы — это фон, а не фокус */}
          <rect width="100" height="140" fill={`url(#${uid}-edge)`} />
          <rect x="6" y="30" width="88" height="1.4" fill="#f0ece2" opacity="0.7" className="hs-tear" />
          <rect
            x="0"
            y="92"
            width="100"
            height="2.5"
            fill="#ff5a3c"
            opacity="0.5"
            className="hs-tear hs-tear--late"
          />
        </>
      );

    /* --- Лампа: конус света, который мигает --- */
    case 'lamp':
      return (
        <>
          <rect width="100" height="140" fill="#0f0f13" />
          <path d="M50 0v21" stroke="#3a3a44" strokeWidth="0.8" />
          <path d="M40 29h20l7 12H33z" fill="#2a2a33" />
          <path
            d="M33 41h34l27 99H6z"
            fill={`url(#${uid}-cone)`}
            className="hs-flicker"
          />
          <ellipse cx="50" cy="128" rx="30" ry="9" fill="#33333d" opacity="0.5" />
        </>
      );
  }
}
export default function HorrorScene({ uid, variant, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 100 140"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={LABEL[variant]}
      className={`h-full w-full ${className}`}
    >
      <defs>
        <radialGradient id={`${uid}-door`} cx="50%" cy="42%">
          <stop offset="0%" stopColor="#9a978f" />
          <stop offset="40%" stopColor="#5e5c58" />
          <stop offset="80%" stopColor="#26262c" />
          <stop offset="100%" stopColor="#101014" />
        </radialGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a6a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6a4030" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${uid}-spill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8d2c4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d8d2c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b3a89a" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#7d7164" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#39332e" />
        </linearGradient>
        <radialGradient id={`${uid}-edge`} cx="50%" cy="45%" r="72%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
        </radialGradient>
        {/* Мягкость кадра: реальное видеонаблюдение никогда не бывает
            резким, а без размытия сцены читаются как плоские иконки. */}
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0%" stopColor="#d03a2a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#a81c1c" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-noise`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`${uid}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6cdbe" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#8c8378" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#6a6058" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Содержимое сцены слегка размыто: кадр с камеры наблюдения
          не бывает резким, и без этого графика читается как иконка. */}
      <g filter={`url(#${uid}-soft)`}>
        <Scene uid={uid} variant={variant} />
      </g>
    </svg>
  );
}
