export type ZoneId = 'blue' | 'green' | 'yellow' | 'red';

export type StrategyType =
  | 'breathing'
  | 'calm_sound'
  | 'pause_button'
  | 'butterfly_tapping'
  | 'twist_and_sway'
  | 'arm_swings'
  | 'custom_text';

export type StrategyIcon =
  | 'respirar'
  | 'fone'
  | 'parar'
  | 'abracar'
  | 'beber-agua'
  | 'borboleta'
  | 'girar'
  | 'levantar-bracos'
  // Legacy aliases kept for backward compatibility with saved localStorage configs
  | 'heart'
  | 'water'
  | 'headphones'
  | 'hand'
  | 'wind';

export interface ZoneStrategyConfig {
  type: StrategyType;
  icon?: StrategyIcon;
  arasaacId?: number;
  text?: string;
}

export interface ArasaacSearchResult {
  id: number;
  label: string;
  src: string;
}

export function getArasaacPngUrl(id: number): string {
  return `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
}

export function formatZoneHeading(label: string): string {
  if (label === 'Amarelo') return 'Zona Amarela';
  if (label === 'Vermelho') return 'Zona Vermelha';
  return `Zona ${label}`;
}

export function resolveStrategyIconSrc(strategy: ZoneStrategyConfig): string {
  if (typeof strategy.arasaacId === 'number' && strategy.arasaacId > 0) {
    return getArasaacPngUrl(strategy.arasaacId);
  }
  return ARASAAC_ICON_PATHS[strategy.icon ?? 'abracar'] ?? ARASAAC_ICON_PATHS.abracar;
}

export async function searchArasaacPictograms(
  query: string,
  signal?: AbortSignal,
): Promise<ArasaacSearchResult[]> {
  const clean = query.trim();
  if (!clean) return [];

  const res = await fetch(
    `https://api.arasaac.org/v1/pictograms/pt/search/${encodeURIComponent(clean)}`,
    { signal },
  );
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`ARASAAC HTTP ${res.status}`);
  }
  const data = (await res.json()) as Array<{
    _id?: number;
    keywords?: Array<{ keyword?: string }>;
  }>;
  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => typeof item._id === 'number' && item._id > 0)
    .slice(0, 12)
    .map((item) => ({
      id: item._id!,
      label: item.keywords?.[0]?.keyword ?? clean,
      src: getArasaacPngUrl(item._id!),
    }));
}

export const ARASAAC_ICON_PATHS: Record<StrategyIcon, string> = {
  respirar: '/arasaac/respirar.png',
  fone: '/arasaac/fone.png',
  parar: '/arasaac/parar.png',
  abracar: '/arasaac/abracar.png',
  'beber-agua': '/arasaac/beber-agua.png',
  borboleta: '/arasaac/borboleta.png',
  girar: '/arasaac/girar.png',
  'levantar-bracos': '/arasaac/levantar-bracos.png',
  heart: '/arasaac/abracar.png',
  water: '/arasaac/beber-agua.png',
  headphones: '/arasaac/fone.png',
  hand: '/arasaac/parar.png',
  wind: '/arasaac/respirar.png',
};

export interface ZoneDefinition {
  id: ZoneId;
  label: string;
  feelings: string;
  bgClass: string;
  borderHex: string;
  badgeBg: string;
  badgeText: string;
  emoji: string;
}

export const TERMOMETRO_STORAGE_KEY = 'guiamove_termometro_config_v1';

export const ZONES: ZoneDefinition[] = [
  {
    id: 'blue',
    label: 'Azul',
    feelings: 'Triste, cansado ou sem energia',
    bgClass: 'bg-[#EFF6FF]',
    borderHex: '#3B82F6',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    emoji: '💧',
  },
  {
    id: 'green',
    label: 'Verde',
    feelings: 'Calmo, focado e pronto',
    bgClass: 'bg-[#ECFDF5]',
    borderHex: '#10B981',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    emoji: '🌿',
  },
  {
    id: 'yellow',
    label: 'Amarelo',
    feelings: 'Agitado, frustrado ou em alerta',
    bgClass: 'bg-[#FFFBEB]',
    borderHex: '#F59E0B',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    emoji: '⚡',
  },
  {
    id: 'red',
    label: 'Vermelho',
    feelings: 'Sobrecarregado ou precisando parar',
    bgClass: 'bg-[#FEF2F2]',
    borderHex: '#EF4444',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    emoji: '🛑',
  },
];

export type CalmingMovementType =
  | 'butterfly_tapping'
  | 'twist_and_sway'
  | 'arm_swings';

export const CALMING_MOVEMENTS: Record<
  CalmingMovementType,
  {
    title: string;
    instruction: string;
    icon: StrategyIcon;
  }
> = {
  butterfly_tapping: {
    title: 'Abraço da Borboleta',
    instruction:
      'Cruze os braços sobre o peito e dê batidinhas leves, alternando um lado e depois o outro.',
    icon: 'borboleta',
  },
  twist_and_sway: {
    title: 'Girar e Balançar',
    instruction:
      'Cruze os braços no peito e gire o tronco devagar de um lado para o outro, como um balanço.',
    icon: 'girar',
  },
  arm_swings: {
    title: 'Balanço dos Braços',
    instruction:
      'Levante os dois braços lá no alto e balance para cima e para baixo, no seu ritmo.',
    icon: 'levantar-bracos',
  },
};

export const DEFAULT_ZONE_STRATEGIES: Record<ZoneId, ZoneStrategyConfig> = {
  blue: { type: 'calm_sound', icon: 'fone' },
  green: { type: 'breathing', icon: 'respirar' },
  yellow: { type: 'butterfly_tapping', icon: 'borboleta' },
  red: { type: 'pause_button', icon: 'parar' },
};
