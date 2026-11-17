'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Volume2 } from 'lucide-react';
import {
  ARASAAC_ICON_PATHS,
  CALMING_MOVEMENTS,
  formatZoneHeading,
  resolveStrategyIconSrc,
  type CalmingMovementType,
  type StrategyIcon,
  type ZoneDefinition,
  type ZoneStrategyConfig,
} from '@/lib/termometro/zones';
import { BigActionButton } from '@/components/shared/BigActionButton';

interface RegulationViewProps {
  zone: ZoneDefinition;
  strategy: ZoneStrategyConfig;
  muted: boolean;
  onBack: () => void;
}

function isCalmingMovement(type: ZoneStrategyConfig['type']): type is CalmingMovementType {
  return (
    type === 'butterfly_tapping' ||
    type === 'twist_and_sway' ||
    type === 'arm_swings'
  );
}

function ArasaacPictogram({
  icon,
  alt = '',
  size = 72,
}: {
  icon: StrategyIcon;
  alt?: string;
  size?: number;
}) {
  const src = ARASAAC_ICON_PATHS[icon] ?? ARASAAC_ICON_PATHS.abracar;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain select-none"
    />
  );
}

export function RegulationView({
  zone,
  strategy,
  muted,
  onBack,
}: RegulationViewProps) {
  const [pauseConfirmed, setPauseConfirmed] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [activeMovement, setActiveMovement] = useState<CalmingMovementType>(
    isCalmingMovement(strategy.type) ? strategy.type : 'butterfly_tapping',
  );
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
          {zone.emoji} {formatZoneHeading(zone.label)}
        </span>

        {strategy.type === 'breathing' ? (
          <div className="flex flex-col items-center gap-6 py-4">
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center animate-breathe bg-white"
              style={{
                border: `4px solid ${zone.borderHex}`,
              }}
            >
              <ArasaacPictogram icon="respirar" size={88} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] text-balance">
                Respire junto com o círculo
              </h2>
              <p className="mt-1 text-base text-[#475569] text-pretty">
                Puxe o ar devagar quando crescer. Solte quando diminuir.
              </p>
            </div>
          </div>
        ) : null}

        {strategy.type === 'calm_sound' ? (
          <div className="flex flex-col items-center gap-5 py-4">
            <div
              className="size-24 rounded-3xl bg-white border-2 flex items-center justify-center p-2"
              style={{ borderColor: zone.borderHex }}
            >
              <ArasaacPictogram icon="fone" size={76} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] text-balance">
                Som suave de chuva
              </h2>
              <p className="mt-1 text-base text-[#475569] text-pretty">
                Um som contínuo para diminuir o barulho ao redor.
              </p>
            </div>
            <BigActionButton
              onClick={isPlaying ? stopCalmAudio : startCalmAudio}
              variant={isPlaying ? 'amber' : 'primary'}
            >
              <Volume2 className="w-5 h-5" aria-hidden="true" />
              <span>{isPlaying ? 'Pausar som' : 'Tocar som suave'}</span>
            </BigActionButton>
          </div>
        ) : null}

        {strategy.type === 'pause_button' ? (
          <div className="flex flex-col items-center gap-5 py-4 w-full">
            <button
              type="button"
              onClick={() => setPauseConfirmed(true)}
              className="w-full max-w-xs min-h-[150px] rounded-3xl border-4 flex flex-col items-center justify-center gap-3 p-6 active:scale-95 transition touch-manipulation"
              style={{
                backgroundColor: pauseConfirmed ? '#ECFDF5' : '#FFFFFF',
                borderColor: pauseConfirmed ? '#10B981' : zone.borderHex,
              }}
            >
              {pauseConfirmed ? (
                <CheckCircle2 className="w-14 h-14 text-[#10B981]" aria-hidden="true" />
              ) : (
                <ArasaacPictogram icon="parar" size={76} />
              )}
              <span className="text-2xl font-bold text-[#0F172A]">
                {pauseConfirmed ? 'Pausa combinada!' : 'PRECISO DE PAUSA'}
              </span>
            </button>
            <p className="text-base text-[#475569] text-pretty">
              Mostre esta tela para quem está com você. Tudo bem parar um pouco.
            </p>
          </div>
        ) : null}

        {isCalmingMovement(strategy.type) ? (
          <div className="flex flex-col items-center gap-5 py-2 w-full">
            <div
              className="size-28 rounded-3xl bg-white border-2 flex items-center justify-center p-2"
              style={{ borderColor: zone.borderHex }}
            >
              <ArasaacPictogram
                icon={CALMING_MOVEMENTS[activeMovement].icon}
                size={92}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] text-balance">
                {CALMING_MOVEMENTS[activeMovement].title}
              </h2>
              <p className="mt-1.5 text-base text-[#475569] max-w-md text-pretty">
                {CALMING_MOVEMENTS[activeMovement].instruction}
              </p>
            </div>
            <BigActionButton
              variant="outline"
              onClick={() =>
                handleSpeakText(
                  `${CALMING_MOVEMENTS[activeMovement].title}. ${CALMING_MOVEMENTS[activeMovement].instruction}`,
                )
              }
            >
              <Volume2 className="w-5 h-5 text-[#0284C7]" aria-hidden="true" />
              <span>Ouvir instrução</span>
            </BigActionButton>

            <div className="w-full pt-2 border-t border-[#BAE6FD]/60 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#475569]">
                Outros movimentos calmantes:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {(Object.keys(CALMING_MOVEMENTS) as CalmingMovementType[]).map(
                  (movKey) => {
                    const mov = CALMING_MOVEMENTS[movKey];
                    const isActive = activeMovement === movKey;
                    return (
                      <button
                        key={movKey}
                        type="button"
                        onClick={() => setActiveMovement(movKey)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold border transition ${
                          isActive
                            ? 'bg-[#0284C7] text-white border-[#0284C7]'
                            : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD] hover:border-[#0284C7]'
                        }`}
                      >
                        <img
                          src={ARASAAC_ICON_PATHS[mov.icon]}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-md bg-white p-0.5 object-contain"
                        />
                        <span>{mov.title}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        ) : null}

        {strategy.type === 'custom_text' ? (
          <div className="flex flex-col items-center gap-5 py-2 w-full">
            <div
              className="size-24 rounded-3xl bg-white border-2 flex items-center justify-center p-2"
              style={{ borderColor: zone.borderHex }}
            >
              <img
                src={resolveStrategyIconSrc(strategy)}
                alt=""
                width={76}
                height={76}
                className="object-contain select-none"
              />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug max-w-md text-pretty">
              {strategy.text || 'Fazer uma pausa tranquila'}
            </p>
            <BigActionButton
              variant="outline"
              onClick={() =>
                handleSpeakText(strategy.text || 'Fazer uma pausa tranquila')
              }
            >
              <Volume2 className="w-5 h-5 text-[#0284C7]" aria-hidden="true" />
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
