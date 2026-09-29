'use client';

import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  formatNational,
  isCompletePhone,
  nationalDigits,
  phoneDigits,
  phoneDigitsLeft,
  COUNTRY_CODE,
} from '@/lib/phone';

/**
 * Поле телефона с блокировкой ввода.
 *
 * Что именно блокируется и почему так:
 *
 *  1. `onKeyDown` не пропускает ни один печатный символ, кроме цифры. Это и
 *     есть «блокатор»: буква не появляется в поле даже на один кадр, а не
 *     исчезает после проверки. Служебные клавиши (Backspace, стрелки, Tab,
 *     Home/End) и сочетания с Ctrl/Cmd проходят — иначе поле нельзя ни
 *     отредактировать, ни вставить номер.
 *  2. `onChange` — второй контур, на случай вставки, автозаполнения и
 *     экранных клавиатур, где `keydown` приходит как «Unidentified».
 *     Значение всегда прогоняется через ту же нормализацию.
 *  3. `inputMode="numeric"` — на тач-устройстве поднимается цифровая
 *     клавиатура, где букв просто нет.
 *
 * «+7» набран вне поля и не редактируется. Так снимается двусмысленность:
 * маска не пытается угадать, набрал человек код страны или нет, и поэтому
 * не может дописать лишнюю цифру. В поле вводится ровно 10 цифр.
 *
 * Каретка переносится вручную: после переформатирования браузер ставит её
 * в конец, и правка середины номера превращалась бы в мучение.
 */
type Props = {
  id: string;
  /**
   * Национальная часть номера: ровно те 10 цифр, что человек набрал.
   *
   * Здесь хранится именно она, а не канонический `+7XXXXXXXXXX`, и это
   * принципиально. В первой версии в состояние писался уже собранный
   * канонический номер, а для показа он разбирался обратно — и на неполном
   * вводе разбор не мог отличить приставленную маской семёрку от набранной
   * человеком. В результате при посимвольном наборе в поле появлялись
   * «фантомные» семёрки: набор `7001234567` показывал `777 770 01`.
   * Пока в состоянии лежит только то, что набрал человек, угадывать нечего,
   * а код страны добавляется один раз — при отправке.
   */
  value: string;
  onChange: (national: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

export default function PhoneInput({ id, value, onChange, invalid, describedBy }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  // Сколько цифр было слева от каретки в момент правки.
  const pendingCaret = useRef<number | null>(null);

  const display = formatNational(value);
  const complete = isCompletePhone(value);
  const left = phoneDigitsLeft(value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) e.preventDefault();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    pendingCaret.current = phoneDigits(el.value.slice(0, caret)).length;
    // Отдаём наружу только национальные цифры — без кода страны.
    onChange(nationalDigits(el.value));
  };

  useLayoutEffect(() => {
    const el = ref.current;
    const target = pendingCaret.current;
    if (!el || target === null) return;
    pendingCaret.current = null;

    if (target === 0) {
      el.setSelectionRange(0, 0);
      return;
    }
    let seen = 0;
    let pos = el.value.length;
    for (let i = 0; i < el.value.length; i++) {
      const ch = el.value[i];
      if (ch >= '0' && ch <= '9') {
        seen += 1;
        if (seen === target) {
          pos = i + 1;
          break;
        }
      }
    }
    el.setSelectionRange(pos, pos);
  }, [value]);

  const hintId = `${id}-hint`;

  return (
    <>
      {/* Префикс — часть поля, но не часть ввода */}
      <div
        className={`flex items-stretch border bg-ash transition-colors ${
          invalid ? 'border-blood' : 'border-iron'
        } focus-within:border-blood-bright`}
      >
        <span
          className={`flex select-none items-center pl-4 font-mono text-[14px] tabular-nums ${
            display ? 'text-bone' : 'text-dust'
          }`}
          aria-hidden
        >
          +{COUNTRY_CODE}
        </span>
        <input
          ref={ref}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={13}
          value={display}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="700 000 00 00"
          aria-invalid={invalid || undefined}
          aria-describedby={`${hintId}${describedBy ? ` ${describedBy}` : ''}`}
          className="w-full bg-transparent py-3.5 pr-4 pl-2.5 font-mono text-[14px] text-bone tabular-nums outline-none placeholder:text-dust/50"
        />
      </div>

      {/* Живая подсказка вместо молчания: человек видит, сколько цифр не
          хватает, и не гадает, почему кнопка неактивна. */}
      <p
        id={hintId}
        className={`mt-2 font-mono text-[10px] tracking-[0.06em] ${
          complete ? 'text-ashlight' : 'text-dust'
        }`}
      >
        {!display ? (
          `Только цифры: код +${COUNTRY_CODE} уже подставлен`
        ) : complete ? (
          <span className="text-blood-bright">✓</span>
        ) : (
          `Введите ещё ${left} ${left === 1 ? 'цифру' : left < 5 ? 'цифры' : 'цифр'}`
        )}
      </p>
    </>
  );
}
