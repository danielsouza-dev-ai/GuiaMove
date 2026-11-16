'use client';

import type { AvatarPhase } from '@/lib/temporizador/timerEngine';
import type { AvatarConfig } from '@/utils/storage';

interface CharacterAvatarProps {
  phase: AvatarPhase;
  config: AvatarConfig;
  photoData?: string;
  size?: number;
}

export function CharacterAvatar({
  phase,
  config,
  photoData,
  size = 96,
}: CharacterAvatarProps) {
  const { skinTone, hairStyle, hairColor, bodyBuild } = config;
  const bodyScaleX = bodyBuild === 'slim' ? 0.86 : bodyBuild === 'sturdy' ? 1.16 : 1;

  // Mouth shapes anchored near the right edge of the face (x ~ 86) to meet the food
  const renderMouth = () => {
    if (phase === 'mouth_open') {
      return (
        <ellipse
          cx="82"
          cy="56"
          rx="11"
          ry="12"
          fill="#7F1D1D"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
      );
    }
    if (phase === 'bite') {
      return (
        <g>
          <rect
            x="72"
            y="50"
            width="18"
            height="10"
            rx="4"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <line x1="72" y1="55" x2="90" y2="55" stroke="#0F172A" strokeWidth="2" />
        </g>
      );
    }
    if (phase === 'chewing') {
      return (
        <path
          d="M72 56 Q80 61 88 54"
          fill="none"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      );
    }
    if (phase === 'celebration') {
      return (
        <path
          d="M68 52 Q80 68 90 52 Z"
          fill="#EF4444"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
      );
    }
    // anticipation
    return (
      <path
        d="M72 55 Q80 60 88 55"
        fill="none"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  };

  const renderHair = () => {
    if (hairStyle === 'curly') {
      return (
        <g fill={hairColor}>
          <circle cx="34" cy="24" r="12" />
          <circle cx="50" cy="18" r="13" />
          <circle cx="68" cy="22" r="11" />
          <circle cx="24" cy="36" r="10" />
        </g>
      );
    }
    if (hairStyle === 'long') {
      return (
        <g fill={hairColor}>
          <path d="M22 44 C22 4, 78 4, 80 34 C68 27, 42 27, 30 40 L26 74 C18 72, 18 56, 22 44 Z" />
        </g>
      );
    }
    if (hairStyle === 'bun') {
      return (
        <g fill={hairColor}>
          <circle cx="28" cy="18" r="11" />
          <path d="M23 42 C23 4, 79 4, 80 34 C68 27, 42 26, 23 42 Z" />
        </g>
      );
    }
    // short
    return (
      <path
        d="M23 42 C23 4, 79 4, 80 34 C68 27, 42 26, 23 42 Z"
        fill={hairColor}
      />
    );
  };

  const armY = phase === 'celebration' ? 66 : 84;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Personagem do temporizador"
      className="overflow-visible select-none"
    >
      {/* Torso */}
      <g transform={`translate(50, 0) scale(${bodyScaleX}, 1) translate(-50, 0)`}>
        <rect
          x="26"
          y="72"
          width="44"
          height="26"
          rx="13"
          fill="#0284C7"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
      </g>

      {/* Raised or resting arm */}
      <path
        d={`M28 80 Q14 ${armY} 18 ${phase === 'celebration' ? 54 : 88}`}
        stroke={skinTone}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head */}
      <circle
        cx="52"
        cy="44"
        r="28"
        fill={skinTone}
        stroke="#0F172A"
        strokeWidth="2.5"
      />

      {/* Optional cropped child photo inside head */}
      {photoData ? (
        <g>
          <defs>
            <clipPath id="guiamove-avatar-clip">
              <circle cx="52" cy="44" r="26" />
            </clipPath>
          </defs>
          <image
            href={photoData}
            x="26"
            y="18"
            width="52"
            height="52"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#guiamove-avatar-clip)"
          />
        </g>
      ) : (
        <>
          {renderHair()}
          {/* Eye facing right toward food */}
          <circle cx="67" cy="39" r="3.8" fill="#0F172A" />
          <circle cx="68.2" cy="37.8" r="1.3" fill="#FFFFFF" />
          {/* Cheek */}
          <circle cx="58" cy="50" r="4.5" fill="#FB7185" opacity="0.45" />
          {renderMouth()}
        </>
      )}
    </svg>
  );
}
