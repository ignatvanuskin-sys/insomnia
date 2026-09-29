/**
 * ФОТОГРАФИИ — реальные кадры из галереи 2ГИС (firm/70000001105883013,
 * 22 объекта: 21 фото + 1 видео; снято 29.09.2026).
 *
 * Как получены файлы: исходники скачаны с CDN 2ГИС, пережаты в 1500 px /
 * JPEG q80 и сохранены в `public/photos/`. EXIF срезан полностью — в снимках
 * гостей бывают геометки, публиковать их нельзя.
 *
 * ЧТО ОТБРАНО И ЧТО ВЫБРОШЕНО (осознанно, а не «что попалось»):
 *   - выбрасываем кадры с узнаваемыми лицами (групповое фото гостей,
 *     съёмка на улице) — это приватность людей, а не контент заведения;
 *   - выбрасываем крупные планы QR-табличек 2ГИС/Instagram — это реклама
 *     площадки, а не атмосфера квеста;
 *   - выбрасываем пустой потолок и заведомо чёрный кадр-обложку видео;
 *   - видео с 2ГИС отдаётся только HLS/DASH-манифестом, файла mp4 нет,
 *     поэтому в проект оно не встроено: ссылка ведёт на галерею 2ГИС.
 *
 * АТРИБУЦИЯ ОБЯЗАТЕЛЬНА. `source` различает кадры владельца и кадры гостей:
 * под гостевыми на сайте стоит имя автора и дата. Юридически чистый набор —
 * это `owner`; гостевые кадры публикуются как цитата источника 2ГИС и требуют
 * согласия авторов (см. RESEARCH.md, раздел про права).
 */

export type PhotoSource = 'owner' | 'user' | 'entrance';

export type Photo = {
  /** Имя файла в public/photos/. */
  file: string;
  /** Подпись кадра — что в нём видно. */
  scene: string;
  /** Автор кадра: имя гостя либо «владелец». */
  credit: string;
  /** Дата съёмки в формате ДД.ММ.ГГГГ. */
  date: string;
  source: PhotoSource;
  /** Ориентация исходника — от неё зависит раскладка в сетке. */
  portrait: boolean;
  /**
   * Точка фокуса для `object-position`.
   *
   * Зачем это поле. Кадры вертикальные (3:4), а карточки квестов и шапки
   * страниц — широкие (примерно 2.4:1). `object-cover` в таком контейнере
   * оставляет узкую горизонтальную полосу, и по умолчанию это СЕРЕДИНА
   * кадра. У «красного неона» (14.jpg) середина — чёрная, поэтому карточка
   * INSOMNIA CINEMA выходила сплошным чёрным прямоугольником, хотя сама
   * фотография нормальная: её верхняя треть имеет яркость ~91/255.
   * Значения ниже — не на глаз, а по замеру самой яркой полосы для
   * соответствующего соотношения сторон.
   */
  focus: string;
};

export const photos: Photo[] = [
  { file: '20.jpg', scene: 'Лестница вниз', credit: 'владелец', date: '15.12.2025', source: 'owner', portrait: true, focus: 'center 20%' },
  { file: '12.jpg', scene: 'Каменная стена, канделябр', credit: 'владелец', date: '15.12.2025', source: 'owner', portrait: true, focus: 'center 6%' },
  { file: '13.jpg', scene: 'Зал с пианино и свечами', credit: 'владелец', date: '15.12.2025', source: 'owner', portrait: true, focus: 'center 70%' },
  { file: '16.jpg', scene: 'Фигура в красном свете', credit: 'владелец', date: '03.12.2025', source: 'owner', portrait: true, focus: 'center 12%' },
  { file: '14.jpg', scene: 'Красный неон над входом', credit: 'владелец', date: '11.01.2026', source: 'owner', portrait: true, focus: 'center 4%' },
  { file: '03.jpg', scene: 'Стол учёного: лампа, радио, бумаги', credit: 'владелец', date: '15.12.2025', source: 'owner', portrait: true, focus: 'center 55%' },
  { file: '01.jpg', scene: 'Холл с багажом INSOMNIA', credit: 'Polina M', date: '22.11.2025', source: 'user', portrait: true, focus: 'center 10%' },
  { file: '11.jpg', scene: 'Комната с лампами накаливания', credit: 'Polina M', date: '22.11.2025', source: 'user', portrait: true, focus: 'center 12%' },
  { file: '18.jpg', scene: 'Реквизит: рука, свечи, растения', credit: 'Айжана А.', date: '28.02.2026', source: 'user', portrait: true, focus: 'center 70%' },
  { file: '19.jpg', scene: 'Красное на чёрном — крупный план', credit: 'matvey gostevskih', date: '17.05.2026', source: 'user', portrait: true, focus: 'center 8%' },
  { file: '10.jpg', scene: 'Полумрак: три лампы и вывеска', credit: 'Denis Mukhamedzyanov', date: '21.12.2025', source: 'user', portrait: true, focus: 'center 14%' },
  { file: '15.jpg', scene: 'Комната с рамами и стойкой', credit: 'Сабина Калимова', date: '07.01.2026', source: 'user', portrait: true, focus: 'center 16%' },
  { file: '02.jpg', scene: 'Вход ночью, вывеска горит', credit: 'Denis Mukhamedzyanov', date: '21.12.2025', source: 'user', portrait: true, focus: 'center 8%' },
  { file: '08.jpg', scene: 'Дверной проём со светящейся вывеской', credit: 'Raushan Dosken', date: '14.01.2026', source: 'user', portrait: true, focus: 'center 8%' },
  { file: '17.jpg', scene: 'Фасад: улица Новосёлов, 145/1', credit: 'Zhanara M', date: '31.03.2026', source: 'entrance', portrait: true, focus: 'center 8%' },
];

/** Ключевые кадры для блоков страницы. */
export const heroPhoto = '20.jpg';
export const questPhotos: Record<string, string> = {
  'zabytye-dushi': '12.jpg',
  'insomnia-cinema': '14.jpg',
};
export const facadePhoto = '17.jpg';

/** Точка фокуса конкретного кадра — для широких контейнеров. */
export function photoFocus(file: string): string {
  return photos.find((p) => p.file === file)?.focus ?? 'center';
}

export const SOURCE_LABEL: Record<PhotoSource, string> = {
  owner: 'от владельца',
  user: 'от гостей',
  entrance: 'официальное фото входа',
};

export function photoHref(file: string) {
  return `/photos/${file}`;
}
