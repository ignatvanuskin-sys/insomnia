const STEPS = [
  { n: '01', t: 'Выбираете квест', d: '«Забытые души» или INSOMNIA CINEMA.' },
  { n: '02', t: 'Собираете команду', d: 'Отправьте ссылку друзьям — все увидят время и место.' },
  { n: '03', t: 'Выбираете время', d: 'Оставьте заявку, администратор подтвердит слот.' },
  { n: '04', t: 'Приезжаете', d: `${'ул. Новосёлов, 145/1'}, Казыбек Би район.` },
  { n: '05', t: 'Вас вводят в историю', d: 'Инструктаж администратора перед стартом.' },
  { n: '06', t: 'Дальше дверь закрывается', d: 'Обратный отсчёт пошёл.' },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-iron py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-[10px] tracking-huge text-blood-bright uppercase">
            Процесс
          </p>
          <h2 className="mt-5 font-display text-[1.75rem] leading-[1.08] font-bold tracking-wide text-bone sm:text-5xl">
            Как это работает
          </h2>
        </div>

        <ol className="mt-12 grid gap-px border border-iron bg-iron sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="reveal group relative bg-ash p-6 transition-colors duration-500 hover:bg-smoke sm:p-7"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-blood-bright">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-base font-bold tracking-[0.08em] text-bone">
                {s.t}
              </h3>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-dust">{s.d}</p>
              {i === STEPS.length - 1 && (
                <span className="flicker absolute top-5 right-5 h-1.5 w-1.5 rounded-full bg-blood-bright" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
