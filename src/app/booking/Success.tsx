'use client';

import Link from 'next/link';
import { business, getQuest } from '@/data/business';
import Header from '@/components/Header';
import { fmtDate, type Form } from './data';

export default function Success({ form, onShare }: { form: Form; onShare: () => void }) {
  const q = getQuest(form.quest);
  const { d, wd } = fmtDate(form.date);
  const dtf = new Date(`${form.date}T${form.time}:00`);

  const stamp = (dt: Date) =>
    `${dt.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Insomnia//Booking//RU',
    'BEGIN:VEVENT',
    `UID:${form.quest}-${form.date}-${form.time}@insomnia`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(dtf)}`,
    `DTEND:${stamp(new Date(dtf.getTime() + 3600000))}`,
    `SUMMARY:Инсомния — ${q?.name ?? 'Хоррор-квест'}`,
    `LOCATION:${business.address}`,
    `DESCRIPTION:Хоррор-квест. ${form.players} игрок(ов).`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const MAPS_URL = `https://yandex.ru/maps/?pt=${business.coords.lon},${business.coords.lat}&z=17&l=map`;

  return (
    <div className="min-h-dvh pb-16">
      <Header hideCta />
      <div className="mx-auto max-w-2xl px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="text-center">
          <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase flicker">
            Заявка принята
          </p>
          <h1 className="mt-5 font-display text-[2.5rem] leading-[0.98] font-bold tracking-wide text-bone sm:text-6xl">
            ТЫ ВНУТРИ.
          </h1>
          <p className="mx-auto mt-5 max-w-sm font-body text-[13px] leading-relaxed text-dust">
            Администратор свяжется с тобой и подтвердит время. Бронь закреплена за тобой.
          </p>
        </div>

        <div className="mt-12 border border-iron bg-ash">
          <p className="border-b border-iron px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-dust uppercase">
            Бронь
          </p>
          <dl className="divide-y divide-iron/60">
            {[
              { l: 'Квест', v: q?.name ?? '—' },
              { l: 'Дата', v: `${d} (${wd})` },
              { l: 'Время', v: form.time },
              { l: 'Игроки', v: String(form.players) },
              { l: 'Стоимость', v: 'Уточните у администратора' },
              { l: 'Имя', v: form.name },
              { l: 'Телефон', v: form.phone },
              { l: 'Адрес', v: `${business.addressShort}, Караганда` },
            ].map((r) => (
              <div key={r.l} className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-dust uppercase">
                  {r.l}
                </dt>
                <dd className="text-right font-mono text-[13px] text-bone">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <a
            href={business.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blood/60 bg-blood/12 px-5 py-4 text-center font-mono text-[11px] tracking-[0.16em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25"
          >
            WhatsApp
          </a>
          <a
            href={business.phoneHref}
            className="border border-iron px-5 py-4 text-center font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
          >
            Позвонить
          </a>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-iron px-5 py-4 text-center font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
          >
            Маршрут
          </a>
          <a
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
            download="insomnia.ics"
            className="border border-iron px-5 py-4 text-center font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
          >
            В календарь
          </a>
        </div>

        <button
          type="button"
          onClick={onShare}
          className="mt-2.5 w-full border border-iron px-5 py-4 font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
        >
          Поделиться с командой
        </button>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="link-unfurl font-mono text-[11px] tracking-[0.18em] text-dust uppercase"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
