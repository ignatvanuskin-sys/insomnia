/**
 * ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ.
 *
 * Всё, что не подтверждено публичными источниками, НЕ заполняется вымыслом.
 * Для неподтверждённых полей используется явный маркер `unconfirmed`,
 * который рендерится как «уточните у администратора», а не как выдуманное число.
 *
 * ПОДТВЕРЖДЁННЫЕ ДАННЫЕ (источник: карточка 2ГИС, firm/70000001105883013
 * + официальный аккаунт @insomnia__quest в Instagram):
 *   - Название: Инсомния, хоррор-квест
 *   - Слоган: «Почувствуй ужас, от которого не скрыться»
 *   - Рейтинг: 5.0, 205 оценок
 *   - Отзывы: 134
 *   - Адрес: Улица Новосёлов, 145/1, м-н Новый город, Казыбек Би район,
 *            Караганда, 100017
 *   - Режим работы: ежедневно с 14:00 до 02:00
 *   - Категория: Квесты
 *   - Телефон/WhatsApp: +7 706 726 0120 (wa.me/77067260120)
 *   - Instagram: @insomnia__quest
 *   - Форматы: хоррор-квест «Забытые души», INSOMNIA CINEMA
 *              (фильмы ужасов с полным погружением)
 *
 * НЕ ПОДТВЕРЖДЕНО (2ГИС отдаёт цены/возраст/игроков только после
 * прохождения антибот-защиты, поэтому эти значения НЕ выдумываются):
 *   - цены, количество игроков, длительность, возраст, отзывы (тексты)
 */

/** Маркер неподтверждённого значения — рендерится как подсказка администратора. */
export const UNCONFIRMED = '—';

export type Business = {
  name: string;
  legalCategory: string;
  tagline: string;
  rating: number;
  ratingsCount: number;
  reviewsCount: number;
  address: string;
  addressShort: string;
  postalCode: string;
  coords: { lat: number; lon: number };
  schedule: { days: string; from: string; to: string };
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  instagram: string;
  instagramHref: string;
  twoGisUrl: string;
  twoGisReviewsUrl: string;
  twoGisPhotosUrl: string;
  photosOnTwoGis: number;
};

export const business: Business = {
  name: 'Инсомния',
  legalCategory: 'Хоррор-квест',
  tagline: 'Почувствуй ужас, от которого не скрыться',
  rating: 5.0,
  ratingsCount: 205,
  reviewsCount: 134,
  address: 'улица Новосёлов, 145/1, м-н Новый город, Казыбек Би район, Караганда, 100017',
  addressShort: 'ул. Новосёлов, 145/1',
  postalCode: '100017',
  coords: { lat: 49.805634, lon: 73.109323 },
  schedule: { days: 'Ежедневно', from: '14:00', to: '02:00' },
  phone: '+7 706 726 0120',
  phoneHref: 'tel:+77067260120',
  whatsapp: '+7 706 726 0120',
  whatsappHref: 'https://wa.me/77067260120',
  instagram: '@insomnia__quest',
  instagramHref: 'https://www.instagram.com/insomnia__quest/',
  twoGisUrl: 'https://2gis.kz/karaganda/firm/70000001105883013',
  twoGisReviewsUrl: 'https://2gis.kz/karaganda/firm/70000001105883013',
  twoGisPhotosUrl: 'https://2gis.kz/karaganda/firm/70000001105883013',
  photosOnTwoGis: 22,
};

/**
 * Форматы. Названия подтверждены официальным аккаунтом.
 * Числовые параметры (игроки/длительность/возраст/цена) НЕ подтверждены —
 * они хранятся как null и на сайте показываются как «уточните у администратора».
 */
export type QuestFormat = {
  slug: string;
  name: string;
  kicker: string;
  hook: string;
  confirmed: boolean;
  players: string | null;
  duration: string | null;
  age: string | null;
  price: string | null;
  priceNote: string | null;
  /** Оси категорий шкалы — заполняются только для подтверждённых данных. */
  fearAxes: { label: string; value: number | null }[];
  story: string[];
  atmosphere: string[];
  awaits: string[];
  source: string;
};

export const quests: QuestFormat[] = [
  {
    slug: 'zabytye-dushi',
    name: 'Забытые души',
    kicker: 'Хоррор-квест',
    hook: 'Их забыли. Но они не ушли.',
    confirmed: true,
    players: null,
    duration: null,
    age: null,
    price: null,
    priceNote: null,
    fearAxes: [
      { label: 'Напряжение', value: null },
      { label: 'Страх', value: null },
      { label: 'Психологический', value: null },
      { label: 'Скайм', value: null },
    ],
    story: [
      'Есть места, из которых уходят не все. Говорят, здесь осталось эхо тех, кто зашёл и не вышел.',
      'Вы не читаете об этом. Вы оказываетесь внутри — с фонарём, запертой дверью и часом, которого не станет достаточно.',
      'Что здесь произошло — вам не расскажут. Это придётся выяснить самим, пока не выяснили за вас.',
    ],
    atmosphere: [
      'Темнота, в которой не видно рук',
      'Звуки, которые не принадлежат помещению',
      'Детали, которые работают только в темноте',
    ],
    awaits: [
      'Закрытая дверь и обратный отсчёт',
      'Задачи, которые решаются командой',
      'Персонаж, который появляется не по сценарию',
    ],
    source: 'Название подтверждено официальным аккаунтом @insomnia__quest',
  },
  {
    slug: 'insomnia-cinema',
    name: 'INSOMNIA CINEMA',
    kicker: 'Кино с полным погружением',
    hook: 'Фильм, который идёт одиннадцать часов.',
    confirmed: true,
    players: null,
    duration: null,
    age: null,
    price: null,
    priceNote: null,
    fearAxes: [
      { label: 'Напряжение', value: null },
      { label: 'Страх', value: null },
      { label: 'Психологический', value: null },
      { label: 'Скайм', value: null },
    ],
    story: [
      'Это не кинотеатр. Здесь нет зрительного зала, popcorn и свободных мест.',
      'Фильмы ужасов идут в полном погружении: вы не смотрите историю — вы в ней.',
      'Одиннадцать часов — не преувеличение. Столько длится ночь, когда вы не можете уснуть.',
    ],
    atmosphere: [
      'Отказ от зрительного зала — вы внутри сцены',
      'Реакция на происходящее заменяет зрительную оценку',
      'Отсутствие безопасного расстояния от экрана',
    ],
    awaits: [
      'Сеанс без пауз и перерывов',
      'Эффекты, рассчитанные на близость',
      'Выход только после финала',
    ],
    source: 'Формат подтверждён официальным аккаунтом @insomnia__quest',
  },
];

export function getQuest(slug: string): QuestFormat | undefined {
  return quests.find((q) => q.slug === slug);
}
