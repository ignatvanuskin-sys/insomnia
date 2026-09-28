import Link from 'next/link';
import { business, quests } from '@/data/business';

const MAP_URL = `https://yandex.ru/maps/?pt=${business.coords.lon},${business.coords.lat}&z=17&l=map`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacts" className="relative border-t border-iron bg-ash">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-xl font-black tracking-[0.22em] text-bone">ИНСОМНИЯ</p>
            <p className="mt-2 max-w-xs font-mono text-[11px] leading-relaxed text-dust">
              {business.tagline}
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[10px] tracking-huge text-dust uppercase">
              Квесты
            </h2>
            <ul className="space-y-2.5">
              {quests.map((q) => (
                <li key={q.slug}>
                  <Link
                    href={`/quests/${q.slug}`}
                    className="link-unfurl font-mono text-[12px] text-ashlight hover:text-bone"
                  >
                    {q.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/booking"
                  className="link-unfurl font-mono text-[12px] text-ashlight hover:text-bone"
                >
                  Забронировать
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[10px] tracking-huge text-dust uppercase">
              Контакты
            </h2>
            <ul className="space-y-2.5 font-mono text-[12px]">
              <li>
                <a href={business.phoneHref} className="link-unfurl text-ashlight hover:text-bone">
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={business.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-unfurl text-ashlight hover:text-bone"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={business.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-unfurl text-ashlight hover:text-bone"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={business.twoGisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-unfurl text-ashlight hover:text-bone"
                >
                  2ГИС
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[10px] tracking-huge text-dust uppercase">
              Адрес
            </h2>
            <address className="font-mono text-[12px] leading-relaxed text-ashlight not-italic">
              {business.address}
            </address>
            <p className="mt-3 font-mono text-[12px] text-dust">
              {business.schedule.days} {business.schedule.from} — {business.schedule.to}
            </p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-mono text-[11px] tracking-[0.14em] text-blood-bright uppercase underline underline-offset-4"
            >
              Открыть карту
            </a>
          </div>
        </div>

        <div className="rule my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] text-dust">
            © {year} Хоррор-квест «{business.name}», {business.addressShort}, Караганда
          </p>
          <p className="font-mono text-[10px] text-dust">
            Рейтинг и отзывы — 2ГИС. Не является официальным сайтом 2ГИС.
          </p>
        </div>
      </div>
    </footer>
  );
}
