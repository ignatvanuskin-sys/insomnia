'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Атмосферный звук. ПО УМОЛЧАНИЮ ВЫКЛЮЧЕН.
 * Звук синтезируется через Web Audio API (без внешних файлов),
 * поэтому ничего не грузится и нет риска autoplay-блокировки.
 * Громкость намеренно низкая: rumble + шум + редкий «скрип».
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ master: GainNode; lfo: OscillatorNode } | null>(null);

  const stop = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes) {
      try {
        nodes.master.gain.cancelScheduledValues(0);
        nodes.master.gain.setTargetAtTime(0, nodes.master.context.currentTime, 0.4);
        nodes.lfo.stop(nodes.master.context.currentTime + 1.2);
      } catch {
        /* уже остановлен */
      }
    }
    nodesRef.current = null;
  }, []);

  const start = useCallback(async () => {
    const Ctx: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    if (ctx.state === 'suspended') await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // низкочастотный гул
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 42;
    oscGain.gain.value = 0.5;
    osc.connect(oscGain).connect(master);

    // «дышащий» LFO — медленное нарастание гула
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.28;
    lfo.connect(lfoGain).connect(oscGain.gain);
    lfo.start();

    // тихий широкополосный шум (плёнка / вентиляция)
    const len = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 420;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);

    osc.start();
    noise.start();

    master.gain.setTargetAtTime(0.11, ctx.currentTime, 2.2);

    ctxRef.current = ctx;
    nodesRef.current = { master, lfo };
  }, []);

  const toggle = () => {
    if (on) {
      stop();
      const ctx = ctxRef.current;
      if (ctx) setTimeout(() => ctx.close().catch(() => {}), 1600);
      ctxRef.current = null;
      setOn(false);
    } else {
      start().then(() => setOn(true)).catch(() => setOn(false));
    }
  };

  useEffect(() => {
    return () => {
      stop();
      ctxRef.current?.close().catch(() => {});
    };
  }, [stop]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors"
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full transition-all ${
          on ? 'bg-blood-bright shadow-[0_0_8px_var(--color-blood-bright)]' : 'bg-dust'
        }`}
      />
      <span className={on ? 'text-ashlight' : 'text-dust group-hover:text-ashlight'}>
        Sound {on ? 'on' : 'off'}
      </span>
    </button>
  );
}
