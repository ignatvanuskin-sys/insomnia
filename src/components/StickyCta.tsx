'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { business } from '@/data/business';

/**
 * Ненавязчивый sticky CTA. Появляется после первого экрана и только на
 * маршрутах, где его ещё нет в контексте. На странице бронирования
 * он скрыт — там уже есть форма и постоянная кнопка отправки.
 */
export default function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  const onBooking = pathname?.startsWith('/booking');

  useEffect(() => {
    setMounted(true);
    if (onBooking) { setShow(false); return; }
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onBooking]);

  if (!mounted || onBooking) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[9980] border-t border-iron/70 bg-void/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-all duration-500 sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2.5">
        <Link
          href="/booking"
          className="flex-1 border border-blood/60 bg-blood/15 py-3 text-center font-mono text-[11px] tracking-[0.18em] text-bone uppercase"
        >
          Забронировать
        </Link>
        <a
          href={business.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-iron text-ashlight"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.03-5.16-2.9-7.04A9.9 9.9 0 0 0 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.71-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.02 0 1.19.87 2.35.99 2.51.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

