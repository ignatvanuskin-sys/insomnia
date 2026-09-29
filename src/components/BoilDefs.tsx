/**
 * SVG-фильтры «кипения» — техника из подборки (doodle-icons).
 *
 * Как это работает: feTurbulence рисует шум, feDisplacementMap смещает
 * пиксели исходной графики по этому шуму. Ключевая деталь — `calcMode="discrete"`
 * на анимации `seed`: шум не интерполируется, а переключается шестью
 * дискретными кадрами. Именно скачок читается как дрожь нарисованной от руки
 * линии; плавная интерполяция выглядит как растекание и эффект теряется.
 *
 * Рендерится один раз из layout. Пока на странице нет элементов с классом
 * `.boil`, фильтр не участвует в рендере и ничего не стоит.
 * При prefers-reduced-motion CSS выключает сам `filter` — дрожания не будет,
 * хотя SMIL-анимация формально остаётся.
 */
export default function BoilDefs() {
  return (
    <svg aria-hidden focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="boil-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
            <animate
              attributeName="seed"
              values="1;2;3;4;5;6;1"
              dur="0.86s"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="boil-hard" x="-9%" y="-9%" width="118%" height="118%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="1" result="noise">
            <animate
              attributeName="seed"
              values="1;2;3;4;5;6;1"
              dur="0.62s"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
