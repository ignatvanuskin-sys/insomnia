'use client';

import { useEffect, useMemo, useState } from 'react';
import { quests, getQuest, business } from '@/data/business';
import Header from '@/components/Header';
import PhoneInput from '@/components/PhoneInput';
import Success from './Success';
import { canonicalPhone, formatPhone, isCompletePhone } from '@/lib/phone';
import { fmtDate, nextDays, SLOT_TIMES, type Form, EMPTY, type Step } from './data';

export default function BookingPage() {
  const days = useMemo(() => nextDays(21), []);
  const [step, setStep] = useState<Step>('quest');
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // предзаполнение ?quest=slug
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('quest');
    if (p && getQuest(p)) {
      setForm((f) => ({ ...f, quest: p }));
      setStep('slot');
    }
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k as string]) return e;
      const next = { ...e };
      delete next[k as string];
      return next;
    });
  };

  const selectedQuest = form.quest ? getQuest(form.quest) : undefined;
  const canContinueSlot = Boolean(form.quest && form.date && form.time);
  // Номер считается введённым только когда он полный и приведён к
  // каноническому виду (+7XXXXXXXXXX) — «десять цифр» больше не пропуск.
  const canSubmitContact = form.name.trim().length >= 2 && isCompletePhone(form.phone);

  async function submit() {
    if (sending) return;
    setSending(true);
    setServerError(null);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // В форме телефон лежит как 10 национальных цифр; код страны
        // добавляется ровно здесь — на сервер уходит только +7XXXXXXXXXX.
        body: JSON.stringify({ ...form, phone: canonicalPhone(form.phone) }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        if (data?.fields) setErrors(data.fields);
        setServerError(
          data?.error || 'Не удалось забронировать время. Попробуйте ещё раз или позвоните нам.'
        );
        return;
      }
      setDone(true);
      setStep('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError(
        'Нет связи с сервером. Проверьте интернет или позвоните нам — забронируем вручную.'
      );
    } finally {
      setSending(false);
    }
  }

  function share() {
    const text = `Инсомния — ${getQuest(form.quest)?.name}. Дата: ${fmtDate(form.date).d}, ${form.time}. Игроков: ${form.players}. Адрес: ${business.addressShort}, Караганда.`;
    const url = `${window.location.origin}/booking?quest=${form.quest}&d=${form.date}&t=${form.time}&p=${form.players}`;
    if (navigator.share) {
      navigator.share({ title: 'Инсомния', text, url }).catch(() => {});
    } else {
      navigator.clipboard
        ?.writeText(url)
        .then(() => setCopied(true))
        .catch(() => {});
    }
  }

  if (step === 'done' && done) return <Success form={form} onShare={share} />;

  return (
    <div id="main" className="min-h-dvh pb-28 sm:pb-16">
      <Header hideCta />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-10 sm:px-6 sm:pt-28">
        <h1 className="font-display text-[1.75rem] leading-[1.02] font-bold tracking-wide text-bone sm:text-5xl">
          Бронь
        </h1>
        <p className="mt-3 font-mono text-[12px] leading-relaxed text-dust">
          Три коротких шага. Слот подтвердит администратор.
        </p>

        <ol className="mt-8 flex items-center gap-2" aria-label="Прогресс">
          {(['quest', 'slot', 'contact'] as Step[]).map((s, i) => {
            const order = ['quest', 'slot', 'contact'];
            const active = order.indexOf(step) >= i;
            return (
              <li key={s} className="flex-1">
                <div className={`h-px w-full ${active ? 'bg-blood-bright' : 'bg-iron'}`} />
                <span
                  className={`mt-2 block font-mono text-[9px] tracking-[0.16em] uppercase ${
                    active ? 'text-blood-bright' : 'text-dust'
                  }`}
                >
                  0{i + 1}
                </span>
              </li>
            );
          })}
        </ol>

        {/* ШАГ 1 */}
        {step === 'quest' && (
          <fieldset className="mt-10">
            <legend className="font-mono text-[10px] tracking-huge text-dust uppercase">
              Выбери квест
            </legend>
            <div className="mt-5 space-y-3">
              {quests.map((q) => {
                const on = form.quest === q.slug;
                return (
                  <label
                    key={q.slug}
                    className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                      on ? 'border-blood-bright bg-blood/12' : 'border-iron hover:border-slate'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quest"
                      value={q.slug}
                      checked={on}
                      onChange={() => set('quest', q.slug)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`h-4 w-4 shrink-0 border ${
                        on ? 'border-blood-bright bg-blood-bright' : 'border-dust'
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-base font-bold tracking-wide text-bone">
                        {q.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] text-dust">
                        {q.kicker}
                        {q.price ? ` · ${q.price}` : ''}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.quest && <FieldError text={errors.quest} />}

            <button
              type="button"
              disabled={!form.quest}
              onClick={() => {
                setStep('slot');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-8 w-full border border-blood/70 bg-blood/15 py-4 font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all enabled:hover:border-blood-bright enabled:hover:bg-blood/30 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Далее
            </button>
            {/* Кнопка без объяснения — та же проблема, что была у поля
                телефона: непонятно, чего не хватает. */}
            {!form.quest && (
              <p className="mt-3 text-center font-mono text-[10px] text-dust">
                Выберите квест — кнопка станет активной
              </p>
            )}
          </fieldset>
        )}

        {/* ШАГ 2 */}
        {step === 'slot' && (
          <div className="mt-10">
            <p className="font-mono text-[10px] tracking-huge text-dust uppercase">
              Дата и время
            </p>

            <div className="mt-5 -mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
              <div className="flex gap-2 sm:grid sm:grid-cols-5">
                {days.map((iso) => {
                  const on = form.date === iso;
                  const { d, wd } = fmtDate(iso);
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => set('date', iso)}
                      aria-pressed={on}
                      className={`flex min-w-[4.5rem] shrink-0 flex-col items-center gap-1 border px-3 py-3 transition-colors ${
                        on ? 'border-blood-bright bg-blood/15' : 'border-iron hover:border-slate'
                      }`}
                    >
                      <span className="font-mono text-[9px] tracking-[0.14em] text-dust uppercase">
                        {wd}
                      </span>
                      <span className="font-display text-sm font-bold text-bone">{d}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.date && <FieldError text={errors.date} />}

            <fieldset className="mt-8">
              <legend className="font-mono text-[10px] tracking-huge text-dust uppercase">
                Время
              </legend>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {SLOT_TIMES.map((t) => {
                  const on = form.time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('time', t)}
                      aria-pressed={on}
                      className={`border py-3 font-mono text-[12px] tabular-nums transition-colors ${
                        on
                          ? 'border-blood-bright bg-blood/15 text-bone'
                          : 'border-iron text-ashlight hover:border-slate hover:text-bone'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {errors.time && <FieldError text={errors.time} />}
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-dust">
                Слоты предложены в рамках графика работы {business.schedule.from} —{' '}
                {business.schedule.to}. Свободное время подтвердит администратор.
              </p>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-mono text-[10px] tracking-huge text-dust uppercase">
                Игроков
              </legend>
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => set('players', Math.max(1, form.players - 1))}
                  aria-label="Меньше игроков"
                  className="h-11 w-11 border border-iron font-mono text-lg text-ashlight transition-colors hover:border-slate hover:text-bone"
                >
                  −
                </button>
                <span className="font-display text-2xl font-black text-bone tabular-nums">
                  {form.players}
                </span>
                <button
                  type="button"
                  onClick={() => set('players', Math.min(30, form.players + 1))}
                  aria-label="Больше игроков"
                  className="h-11 w-11 border border-iron font-mono text-lg text-ashlight transition-colors hover:border-slate hover:text-bone"
                >
                  +
                </button>
              </div>
              {errors.players && <FieldError text={errors.players} />}
            </fieldset>

            <div className="mt-9 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep('quest')}
                className="border border-iron px-6 py-4 font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                Назад
              </button>
              <button
                type="button"
                disabled={!canContinueSlot}
                onClick={() => {
                  setStep('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 border border-blood/70 bg-blood/15 py-4 font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all enabled:hover:border-blood-bright enabled:hover:bg-blood/30 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Далее
              </button>
            </div>
            {!canContinueSlot && (
              <p className="mt-3 text-center font-mono text-[10px] text-dust">
                {!form.date ? 'Выберите дату' : 'Выберите время'}
              </p>
            )}
          </div>
        )}

        {/* ШАГ 3 */}
        {step === 'contact' && (
          <div className="mt-10">
            <p className="font-mono text-[10px] tracking-huge text-dust uppercase">
              Кто идёт
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="bk-name"
                  className="mb-2 block font-mono text-[10px] tracking-[0.16em] text-dust uppercase"
                >
                  Имя
                </label>
                <input
                  id="bk-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Как к тебе обращаться"
                  aria-invalid={Boolean(errors.name)}
                  className="w-full border border-iron bg-ash px-4 py-3.5 font-mono text-[14px] text-bone outline-none transition-colors placeholder:text-dust/50 focus:border-blood-bright"
                />
                {/* Та же логика, что у телефона: пока кнопка неактивна,
                    человек должен видеть, чего не хватает. */}
                {form.name.trim().length === 1 && (
                  <p className="mt-2 font-mono text-[10px] text-dust">
                    Имя из одной буквы — уточните, как обращаться
                  </p>
                )}
                {errors.name && <FieldError text={errors.name} />}
              </div>

              <div>
                <label
                  htmlFor="bk-phone"
                  className="mb-2 block font-mono text-[10px] tracking-[0.16em] text-dust uppercase"
                >
                  Телефон
                </label>
                <PhoneInput
                  id="bk-phone"
                  value={form.phone}
                  onChange={(v) => set('phone', v)}
                  invalid={Boolean(errors.phone)}
                />
                {errors.phone && <FieldError text={errors.phone} />}
              </div>
            </div>

            <div className="mt-9 border border-iron bg-ash">
              <p className="border-b border-iron px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-dust uppercase">
                Итог
              </p>
              <dl className="divide-y divide-iron/60">
                {[
                  { l: 'Квест', v: selectedQuest?.name },
                  { l: 'Дата', v: form.date ? fmtDate(form.date).d : '—' },
                  { l: 'Время', v: form.time || '—' },
                  { l: 'Игроки', v: String(form.players) },
                  {
                    l: 'Стоимость',
                    v: selectedQuest?.price ?? 'Уточните у администратора',
                  },
                  { l: 'Имя', v: form.name || '—' },
                  { l: 'Телефон', v: formatPhone(form.phone) || '—' },
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

            {serverError && (
              <div role="alert" className="mt-5 border border-blood/60 bg-blood/10 px-5 py-4">
                <p className="font-mono text-[12px] leading-relaxed text-bone">{serverError}</p>
                <a
                  href={business.phoneHref}
                  className="mt-2 inline-block font-mono text-[12px] text-blood-bright underline underline-offset-2"
                >
                  {business.phone}
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmitContact || sending}
              className="mt-7 w-full border border-blood-bright bg-blood/25 py-4 font-mono text-[12px] tracking-[0.2em] text-bone uppercase transition-all enabled:hover:bg-blood/40 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {sending ? 'Отправляем…' : 'Забронировать'}
            </button>

            <div className="mt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep('slot')}
                className="border border-iron px-5 py-3.5 font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={share}
                className="flex-1 border border-iron px-5 py-3.5 font-mono text-[11px] tracking-[0.16em] text-ashlight uppercase transition-colors hover:border-slate hover:text-bone"
              >
                {copied ? 'Ссылка скопирована' : 'Поделиться с друзьями'}
              </button>
            </div>

            <p className="mt-5 font-mono text-[10px] leading-relaxed text-dust">
              Нажимая «Забронировать», вы оставляете заявку. Окончательное подтверждение
              времени делает администратор.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p role="alert" className="mt-2 font-mono text-[11px] text-blood-bright">
      {text}
    </p>
  );
}
