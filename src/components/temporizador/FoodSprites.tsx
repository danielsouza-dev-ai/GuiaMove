'use client';

interface WavyChipSvgProps {
  bitesTaken: number;
  maxBites?: number;
  size?: number;
}

export function WavyChipSvg({
  bitesTaken,
  maxBites = 10,
  size = 64,
}: WavyChipSvgProps) {
  const ratioLeft = Math.max(0, 1 - bitesTaken / maxBites);
  const clipX = (1 - ratioLeft) * 86 + 7;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-testid="wavy-chip-svg"
      data-bites={bitesTaken}
      aria-label="Batata chips ondulada"
    >
      <defs>
        <clipPath id={`chip-bite-${bitesTaken}-${maxBites}`}>
          <rect x={clipX} y="0" width={100 - clipX} height="100" />
        </clipPath>
      </defs>

      <g clipPath={`url(#chip-bite-${bitesTaken}-${maxBites})`}>
        {/* Wavy potato chip outer body */}
        <path
          d="M12 42 C18 22, 42 16, 62 20 C82 24, 92 38, 88 56 C84 74, 62 84, 38 80 C18 76, 8 60, 12 42 Z"
          fill="#FBBF24"
          stroke="#B45309"
          strokeWidth="3"
        />
        {/* Ridges (ondulações típicas de batata chips) */}
        <path
          d="M20 40 Q36 32 52 38 T82 36"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 53 Q34 45 52 51 T84 49"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20 66 Q38 58 56 64 T80 62"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Highlights / salt crystals */}
        <circle cx="34" cy="31" r="2" fill="#FEF3C7" />
        <circle cx="64" cy="43" r="2" fill="#FEF3C7" />
        <circle cx="48" cy="69" r="2" fill="#FEF3C7" />
      </g>
    </svg>
  );
}

export function ChipCrumbsSvg({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-testid="chip-crumbs-svg"
      aria-label="Rastro de migalhas de batata"
    >
      <circle
        cx="50"
        cy="52"
        r="28"
        fill="#FEF3C7"
        fillOpacity="0.45"
        stroke="#F59E0B"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <polygon points="34,46 42,42 40,51" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
      <polygon points="56,38 64,41 59,47" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <polygon points="48,58 57,55 54,64" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="38" cy="61" r="3" fill="#D97706" />
      <circle cx="64" cy="56" r="2.5" fill="#B45309" />
      <circle cx="48" cy="44" r="2" fill="#D97706" />
    </svg>
  );
}

interface ChocolateRewardSvgProps {
  size?: number;
  bitesTaken?: number;
  maxBites?: number;
}

export function ChocolateRewardSvg({
  size = 120,
  bitesTaken = 0,
  maxBites = 10,
}: ChocolateRewardSvgProps) {
  const ratioLeft = Math.max(0, 1 - bitesTaken / maxBites);
  const clipX = (1 - ratioLeft) * 72 + 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      data-testid="chocolate-reward-svg"
      data-bites={bitesTaken}
      aria-label="Barra de chocolate de recompensa"
    >
      <defs>
        <clipPath id={`choc-bite-${bitesTaken}-${maxBites}`}>
          <rect x={clipX} y="0" width={120 - clipX} height="64" />
        </clipPath>
      </defs>

      {/* Wrapper */}
      <path
        d="M22 60 L98 60 L102 104 L18 104 Z"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M18 60 L34 52 L52 62 L72 52 L88 62 L102 58"
        fill="#F59E0B"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Chocolate squares */}
      <g clipPath={bitesTaken > 0 ? `url(#choc-bite-${bitesTaken}-${maxBites})` : undefined}>
        <rect
          x="26"
          y="16"
          width="68"
          height="44"
          rx="6"
          fill="#6B3A1E"
          stroke="#0F172A"
          strokeWidth="3"
        />
        <line x1="60" y1="16" x2="60" y2="60" stroke="#4A2511" strokeWidth="3" />
        <line x1="26" y1="38" x2="94" y2="38" stroke="#4A2511" strokeWidth="3" />
        <rect x="31" y="21" width="24" height="12" rx="2" fill="#8B512D" />
        <rect x="65" y="21" width="24" height="12" rx="2" fill="#8B512D" />
        <rect x="31" y="43" width="24" height="12" rx="2" fill="#8B512D" />
        <rect x="65" y="43" width="24" height="12" rx="2" fill="#8B512D" />
      </g>
    </svg>
  );
}
