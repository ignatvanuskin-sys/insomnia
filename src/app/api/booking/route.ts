import { NextResponse } from 'next/server';
import { getQuest } from '@/data/business';
import { appendBooking } from '@/lib/bookings';
import { canonicalPhone, isCompletePhone } from '@/lib/phone';

export const runtime = 'nodejs';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Не удалось прочитать данные. Обновите страницу и попробуйте снова.' },
      { status: 400 }
    );
  }

  const questSlug = clean(payload.quest, 64);
  const date = clean(payload.date, 10);
  const time = clean(payload.time, 5);
  const players = Number(payload.players);
  const name = clean(payload.name, 80);
  // Телефон приводится к каноническому виду теми же правилами, что и в форме:
  // сервер не доверяет клиенту и не хранит строку как есть.
  const phone = canonicalPhone(clean(payload.phone, 24));

  const errors: Record<string, string> = {};

  if (!getQuest(questSlug)) errors.quest = 'Выберите квест.';
  if (!DATE_RE.test(date)) errors.date = 'Выберите дату.';
  else if (Number.isNaN(Date.parse(date))) errors.date = 'Некорректная дата.';
  if (!TIME_RE.test(time)) errors.time = 'Выберите время.';
  if (!Number.isInteger(players) || players < 1 || players > 30)
    errors.players = 'Укажите количество игроков от 1 до 30.';
  if (name.length < 2) errors.name = 'Введите имя.';
  if (!isCompletePhone(phone))
    errors.phone = 'Укажите номер целиком — 11 цифр, например +7 700 000 00 00.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Проверьте заполненные поля.',
        fields: errors,
      },
      { status: 422 }
    );
  }

  const booking = {
    quest: questSlug,
    date,
    time,
    players,
    name,
    phone,
    createdAt: new Date().toISOString(),
  };

  try {
    await appendBooking(booking);
  } catch (e) {
    console.error('booking store failed', e);
    return NextResponse.json(
      {
        ok: false,
        error:
          'Не удалось принять заявку прямо сейчас. Позвоните нам — забронируем вручную.',
        fallbackPhone: '+77067260120',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, booking });
}
