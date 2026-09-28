/**
 * Показывает подтверждённое значение. Если его нет — честный прочерк
 * и пояснение, без выдуманного числа. Формулировку «уточните у администратора»
 * не повторяем в каждой ячейке: это визуальный шум и давит на восприятие.
 */
export function Fact({
  label,
  value,
  note,
}: {
  label: string;
  value: string | null;
  note?: string;
}) {
  const known = Boolean(value);
  return (
    <div className="border-t border-iron/70 pt-3">
      <dt className="font-mono text-[9px] tracking-[0.2em] text-dust uppercase">{label}</dt>
      <dd
        className={`mt-1.5 font-display text-lg leading-tight font-bold tracking-wide ${
          known ? 'text-bone' : 'text-dust/70'
        }`}
      >
        {known ? value : '—'}
      </dd>
      {note && (
        <p className="mt-1 font-mono text-[10px] leading-relaxed text-dust/80">{note}</p>
      )}
    </div>
  );
}
