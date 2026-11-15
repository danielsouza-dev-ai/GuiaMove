'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  Hand,
  Headphones,
  Heart,
  Volume2,
  Wind,
} from 'lucide-react';
import type {
  StrategyIcon,
  ZoneDefinition,
  ZoneStrategyConfig,
} from '@/lib/termometro/zones';
import { BigActionButton } from '@/components/shared/BigActionButton';

interface RegulationViewProps {
  zone: ZoneDefinition;
  strategy: ZoneStrategyConfig;
  muted: boolean;
  onBack: () => void;
}

function renderStrategyIcon(icon: StrategyIcon = 'heart', color: string) {
  const props = { className: 'w-12 h-12', style: { color } };
  switch (icon) {
    case 'water':
      return <Droplets {...props} />;
    case 'headphones':
      return <Headphones {...props} />;
    case 'hand':
      return <Hand {...props} />;
    case 'wind':
      return <Wind {...props} />;
    default:
      return <Heart {...props} />;
  }
}

export function RegulationView({
  zone,
  strategy,
  muted,
  onBack,
}: RegulationViewProps) {
  const [pauseConfirmed, setPauseConfirmed] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const cleanupAudioNodes = () => {
    try {
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
    } catch {
      // Ignore
    }
    sourceRef.current = null;
    try {
      audioCtxRef.current?.close();
    } catch {
      // Ignore
    }
    audioCtxRef.current = null;
  };

  const stopCalmAudio = () => {
    cleanupAudioNodes();
    setSoundPlaying(false);
  };

  useEffect(() => {
    return () => {
      cleanupAudioNodes();
    };
  }, []);

  useEffect(() => {
    if (muted) {
      cleanupAudioNodes();
    }
  }, [muted]);

  const isPlaying = soundPlaying && !muted;

  const startCalmAudio = () => {
    if (muted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 480;
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      audioCtxRef.current = ctx;
      sourceRef.current = source;
      setSoundPlaying(true);
    } catch {
      // Fail silently on restricted browsers
    }
  };

  const handleSpeakText = (text: string) => {
    if (muted || typeof window === 'undefined') return;
    try {
      if (!('speechSynthesis' in window) || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'pt-BR';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      // Fail silently when speechSynthesis is unavailable
    }
  };

  return (
    <div
      data-testid="regulation-view"
      className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-center"
    >
      <div
        className="rounded-3xl bg-white border-4 p-6 sm:p-8 flex flex-col items-center text-center gap-6 shadow-sm"
        style={{ borderColor: zone.borderHex }}
      >
        <span
          className="px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ backgroundColor: zone.badgeBg, color: zone.badgeText }}
        >
          {zone.emoji} Zona {zone.label}
        </span>

        {strategy.type === 'breathing' ? (
          <div className="flex flex-col items-center gap-6 py-4">
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center animate-breathe"
              style={{
                backgroundColor: zone.badgeBg,
                border: `4px solid ${zone.borderHex}`,
              }}
            >
              <Wind className="w-12 h-12" style={{ color: zone.borderHex }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Respire junto com o círculo
              </h2>
              <p className="mt-1 text-base text-[#475569]">
                Puxe o ar devagar quando crescer. Solte quando diminuir.
              </p>
            </div>
          </div>
        ) : null}

        {strategy.type === 'calm_sound' ? (
          <div className="flex flex-col items-center gap-5 py-4">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: zone.badgeBg }}
            >
              <Headphones
                className="w-12 h-12"
                style={{ color: zone.borderHex }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Som suave de chuva
              </h2>
              <p className="mt-1 text-base text-[#475569]">
                Um som contínuo para diminuir o barulho ao redor.
              </p>
            </div>
            <BigActionButton
              onClick={isPlaying ? stopCalmAudio : startCalmAudio}
              variant={isPlaying ? 'amber' : 'primary'}
            >
              <Volume2 className="w-5 h-5" />
              <span>{isPlaying ? 'Pausar som' : 'Tocar som suave'}</span>
            </BigActionButton>
          </div>
        ) : null}

        {strategy.type === 'pause_button' ? (
          <div className="flex flex-col items-center gap-5 py-4 w-full">
            <button
              type="button"
              onClick={() => setPauseConfirmed(true)}
              className="w-full max-w-xs min-h-[140px] rounded-3xl border-4 flex flex-col items-center justify-center gap-3 p-6 active:scale-95 transition touch-manipulation"
              style={{
                backgroundColor: pauseConfirmed ? '#ECFDF5' : zone.badgeBg,
                borderColor: pauseConfirmed ? '#10B981' : zone.borderHex,
              }}
            >
              {pauseConfirmed ? (
                <CheckCircle2 className="w-14 h-14 text-[#10B981]" />
              ) : (
                <Hand className="w-14 h-14" style={{ color: zone.borderHex }} />
              )}
              <span className="text-2xl font-bold text-[#0F172A]">
                {pauseConfirmed ? 'Pausa combinada!' : 'PRECISO DE PAUSA'}
              </span>
            </button>
            <p className="text-base text-[#475569]">
              Mostre esta tela para quem está com você. Tudo bem parar um pouco.
            </p>
          </div>
        ) : null}

        {strategy.type === 'custom_text' ? (
          <div className="flex flex-col items-center gap-5 py-2 w-full">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: zone.badgeBg }}
            >
              {renderStrategyIcon(strategy.icon, zone.borderHex)}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug max-w-md">
              {strategy.text || 'Fazer uma pausa tranquila'}
            </p>
            <BigActionButton
              variant="outline"
              onClick={() =>
                handleSpeakText(strategy.text || 'Fazer uma pausa tranquila')
              }
            >
              <Volume2 className="w-5 h-5 text-[#0284C7]" />
              <span>Ouvir em voz alta</span>
            </BigActionButton>
          </div>
        ) : null}

        <BigActionButton
          variant="primary"
          onClick={() => {
            stopCalmAudio();
            onBack();
          }}
          className="w-full max-w-xs"
        >
          Já estou melhor · Voltar
        </BigActionButton>
      </div>
    </div>
  );
}
