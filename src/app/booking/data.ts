export type Step = 'quest' | 'slot' | 'contact' | 'done';

export type Form = {
  quest: string;
  date: string;
  time: string;
  players: number;
  name: string;
  phone: string;
};

export const EMPTY: Form = {
  quest: '',
  date: '',
  time: '',
  players: 2,
  name: '',
  phone: '',
};

const RU_MONTHS = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
];
const RU_DAYS = ['вс','пн','вт','ср','чт','пт','сб'];

export function fmtDate(iso: string): { d: string; wd: string } {
  const dt = new Date(iso + 'T12:00:00');
  return {
    d: `${dt.getDate()} ${RU_MONTHS[dt.getMonth()]}`,
    wd: RU_DAYS[dt.getDay()],
  };
}

/** Слоты внутри подтверждённого графика работы 14:00 — 02:00. */
export const SLOT_TIMES = ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00'];

/** Ближайшие N дней, начиная с завтра. */
export function nextDays(n: number): string[] {
  const out: string[] = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let i = 1; i <= n; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`
    );
  }
  return out;
}
