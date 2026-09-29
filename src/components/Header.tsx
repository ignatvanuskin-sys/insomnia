'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { business } from '@/data/business';
import SoundToggle from './SoundToggle';

const NAV = [
  { href: '/#quests', label: 'Квесты' },
  { href: '/#how', label: 'Как это работает' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/#contacts', label: 'Контакты' },
];

export default function Header({ hideCta = false }: { hideCta?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // блокируем прокрутку фона при открытом меню
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[9990] transition-all duration-500 ${
          scrolled
            ? 'border-b border-iron/80 bg-void/92 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[0.26em] text-bone transition-colors hover:text-white sm:text-base"
          >
            ИНСОМНИЯ
          </Link>

          <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="link-unfurl font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase hover:text-bone"
              >
                {n.label}
              </a>
            ))}
            <SoundToggle />
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={business.phoneHref}
              className="hidden font-mono text-[11px] tracking-[0.12em] text-ashlight tabular-nums lg:block"
            >
              {business.phone}
            </a>
            {!hideCta && (
              <Link
                href="/booking"
                className="hidden border border-blood/60 bg-blood/10 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-bone uppercase transition-all hover:border-blood-bright hover:bg-blood/25 sm:block"
              >
                Забронировать
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span className="block h-px w-5 bg-ashlight" />
              <span className="block h-px w-5 bg-ashlight" />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 z-[9995] md:hidden ${open ? '' : 'pointer-events-none invisible'}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-void/97 backdrop-blur-sm transition-opacity duration-400 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <nav
          aria-label="Мобильная навигация"
          className={`relative flex h-full flex-col justify-center px-7 transition-all duration-500 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center"
          >
            <span className="text-ashlight text-2xl leading-none">×</span>
          </button>

          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-iron/60 py-4 font-display text-2xl font-bold tracking-[0.1em] text-bone"
                >
                  <span className="font-mono text-[10px] text-blood-bright">
                    0{i + 1}
                  </span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-5">
            {!hideCta && (
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="block border border-blood/60 bg-blood/15 py-4 text-center font-mono text-[11px] tracking-[0.2em] text-bone uppercase"
              >
                Забронировать
              </Link>
            )}
            <a
              href={business.phoneHref}
              className="block text-center font-mono text-sm text-ashlight tabular-nums"
            >
              {business.phone}
            </a>
            <div className="flex justify-center">
              <SoundToggle />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
