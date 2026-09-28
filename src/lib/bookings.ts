import { promises as fs } from 'node:fs';
import path from 'node:path';

export type Booking = {
  quest: string;
  date: string;
  time: string;
  players: number;
  name: string;
  phone: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'bookings.json');

/**
 * Хранилище заявок. В проде сюда подставляется реальная БД или CRM.
 * Формат — JSON-файл, чтобы заявки не терялись между перезапусками.
 */
export async function appendBooking(booking: Booking): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing: Booking[] = [];
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) existing = parsed;
  } catch {
    /* файла ещё нет — начинаем с чистого листа */
  }

  existing.push(booking);
  await fs.writeFile(FILE, JSON.stringify(existing, null, 2), 'utf8');
}
