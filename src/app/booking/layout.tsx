import type { Metadata } from 'next';
import { business } from '@/data/business';

/**
 * Метаданные страницы бронирования живут здесь, а не в `page.tsx`:
 * page — клиентский компонент ('use client'), а `metadata` разрешено
 * экспортировать только из серверных файлов.
 */
export const metadata: Metadata = {
  title: `Забронировать квест — ${business.name}`,
  description: `Оставьте заявку на хоррор-квест «${business.name}» в Караганде — ${business.addressShort}. ${business.schedule.days} с ${business.schedule.from} до ${business.schedule.to}. Администратор подтвердит дату и время.`,
  alternates: { canonical: '/booking' },
  openGraph: {
    title: `Забронировать квест — ${business.name}`,
    description: `Заявка на бронирование хоррор-квеста в Караганде, ${business.addressShort}. ${business.schedule.days} с ${business.schedule.from} до ${business.schedule.to}.`,
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
