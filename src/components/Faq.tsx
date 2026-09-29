'use client';

import { useState } from 'react';
import { business } from '@/data/business';

type QA = { q: string; a: string };

/**
 * FAQ. Ответы строятся на подтверждённых данных.
 * Там, где условия не опубликованы, мы прямо отправляем к администратору,
 * а не сочиняем «возраст 16+» или «60 минут».
 */
const QA: QA[] = [
  {
    q: 'Это страшно?',
    a: '«Инсомния» — хоррор-квест, и это указано в самой карточке заведения. Рейтинг 5.0 на 2ГИС при 205 оценках: люди, которые уже были внутри, оценивают его так же высоко, насколько он пугает. Но насколько сильно пугает именно вас — вопрос личный, поэтому мы не публикуем выдуманную «шкалу страха».',
  },
  {
    q: 'Сколько стоит?',
    a: `В прайс-листе 2ГИС, обновлённом ${business.priceListUpdatedAt}, опубликована одна позиция: «забытые души» — от 4 000 ₸. Стоимость INSOMNIA CINEMA и итоговую сумму для вашей компании подтверждает администратор: она зависит от формата и состава группы.`,
  },
  {
    q: 'Как можно оплатить?',
    a: `Во вкладке «Инфо» на 2ГИС у заведения указаны такие способы оплаты: ${business.paymentMethods.join(
      ', '
    )}. Если вам нужен другой способ, уточните его у администратора заранее.`,
  },
  {
    q: 'Сколько человек нужно?',
    a: 'Точное количество игроков уточните у администратора — эта информация не опубликована в открытом доступе и зависит от выбранного формата. Мы не хотим назвать цифру, которая может оказаться неверной.',
  },
  {
    q: 'Можно ли детям и с какого возраста?',
    a: 'Возрастные ограничения уточните у администратора перед бронированием. Мы не указываем возраст наугад: если он не подходит вашей группе, это испортит впечатление.',
  },
  {
    q: 'Что взять с собой?',
    a: 'Удобную обувь и лёгкую одежду, в которой не жалко двигаться. Точный список вещей администратор пришлёт при подтверждении заявки.',
  },
  {
    q: 'Сколько длится игра?',
    a: 'Длительность уточните у администратора — публичных данных о хронометраже нет. Мы не придумываем «60 минут», чтобы квест выглядел стройнее на странице.',
  },
  {
    q: 'Что будет после?',
    a: 'Игровую часть завершает ведущий, после чего вы выходите из локации. Детали по формату завершения администратор расскажет на месте.',
  },
  {
    q: 'Можно ли отменить бронь?',
    a: 'Условия отмены уточните у администратора при подтверждении заявки. Мы не публикуем правила, которых нет в открытом доступе.',
  },
  {
    q: 'Опоздал(а) — что будет?',
    a: 'Опоздание может сократить игровое время, поэтому предупредите администратора заранее по телефону или в WhatsApp.',
  },
  {
    q: 'Где находится квест?',
    a: `${business.addressShort}, микрорайон Новый город, Казыбек Би район, Караганда. ${business.schedule.days} с ${business.schedule.from} до ${business.schedule.to}. Ориентир по 2ГИС — ${business.nearestLandmark.name} (${business.nearestLandmark.walk}, ${business.nearestLandmark.distance}).`,
  },
  {
    q: 'Как записаться?',
    a: `Оставьте заявку на сайте или позвоните: ${business.phone}. Администратор подтвердит дату и время.`,
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="reveal">
          <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
            Вопросы
          </p>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
            Что обычно спрашивают
          </h2>
        </div>

        <div className="reveal mt-10 border-t border-iron">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-iron">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-5 py-5 text-left"
                  >
                    <span className="font-display text-[15px] leading-snug font-bold tracking-wide text-bone sm:text-base">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-0.5 shrink-0 font-mono text-lg text-blood-bright transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className={`grid transition-all duration-400 ease-out ${
                    isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-mono text-[12px] leading-relaxed text-ashlight">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="reveal mt-8 font-mono text-[11px] leading-relaxed text-dust">
          Не нашли ответ? Прямой контакт с администратором —{' '}
          <a
            href={business.phoneHref}
            className="text-blood-bright underline underline-offset-2"
          >
            {business.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
