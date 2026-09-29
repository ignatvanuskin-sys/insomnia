import Image from 'next/image';
import { photoHref, SOURCE_LABEL, type Photo } from '@/data/photos';

/**
 * Кадр из галереи под «камерой наблюдения».
 *
 * Разметка разделена на две части намеренно: рамка с соотношением сторон
 * и подпись под ней. Если повесить `aspect-*` на общий контейнер, то подпись
 * попадает внутрь зафиксированной высоты и вылезает за кадр — поэтому
 * соотношение сторон живёт на внутреннем элементе, а не на внешнем.
 *
 * Снимок отдаётся через next/image (локальные файлы из public/photos,
 * поэтому remotePatterns не нужны). Подпись автора обязательна: 8 из 15
 * кадров загрузили гости, публиковать их безымянно нельзя.
 */
type Props = {
  photo: Photo;
  /** Метка камеры: CAM 04 и т. п. */
  hud?: string;
  /** Соотношение сторон рамки. */
  frameClassName?: string;
  /** Размеры для srcset — от них зависит, какой файл скачает браузер. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Показывать подпись с автором под кадром. */
  withCredit?: boolean;
  /** Увеличить кадр (в галерее) — накладывает кнопку на всю рамку. */
  onZoom?: () => void;
};

export default function CctvPhoto({
  photo,
  hud,
  frameClassName = 'aspect-3/4',
  sizes = '(max-width: 640px) 50vw, 25vw',
  priority = false,
  className,
  withCredit = true,
  onZoom,
}: Props) {
  return (
    <div className={className}>
      <div className={`cctv relative ${frameClassName}`}>
        <Image
          src={photoHref(photo.file)}
          alt={`${photo.scene} — хоррор-квест «Инсомния», Караганда`}
          fill
          sizes={sizes}
          priority={priority}
          quality={72}
          className="object-cover"
          /* Точка фокуса из данных кадра: без неё object-cover берёт
             середину, а у части снимков середина — чёрная. */
          style={{ objectPosition: photo.focus }}
        />

        {hud ? (
          <span className="pointer-events-none absolute top-3 left-3 z-[5] font-mono text-[9px] tracking-[0.18em] text-bone/80 uppercase">
            {hud}
          </span>
        ) : null}
        <span className="pointer-events-none absolute top-3 right-3 z-[5] font-mono text-[9px] tracking-[0.18em] text-blood-bright/90 uppercase">
          REC ●
        </span>

        {onZoom ? (
          <button
            type="button"
            onClick={onZoom}
            className="absolute inset-0 z-[6] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blood-bright"
            aria-label={`Открыть кадр «${photo.scene}» во весь экран`}
          >
            <span className="sr-only">Увеличить</span>
          </button>
        ) : null}
      </div>

      {withCredit ? (
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 font-mono text-[9px] leading-relaxed text-dust">
          <span className="text-ashlight">{photo.scene}</span>
          <span className="text-dust/70">
            {photo.source === 'owner' ? 'фото владельца' : photo.credit} · {photo.date}
          </span>
          <span className="text-dust/45">{SOURCE_LABEL[photo.source]}</span>
        </p>
      ) : null}
    </div>
  );
}
