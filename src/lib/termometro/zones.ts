export type ZoneId = 'blue' | 'green' | 'yellow' | 'red';

export type StrategyType =
  | 'breathing'
  | 'calm_sound'
  | 'pause_button'
  | 'custom_text';

export type StrategyIcon = 'heart' | 'water' | 'headphones' | 'hand' | 'wind';

export interface ZoneStrategyConfig {
  type: StrategyType;
  icon?: StrategyIcon;
  text?: string;
}

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

export const TERMOMETRO_STORAGE_KEY = 'movekit_termometro_config_v1';

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

export const DEFAULT_ZONE_STRATEGIES: Record<ZoneId, ZoneStrategyConfig> = {
  blue: { type: 'calm_sound', icon: 'headphones' },
  green: { type: 'breathing', icon: 'wind' },
  yellow: { type: 'breathing', icon: 'wind' },
  red: { type: 'pause_button', icon: 'hand' },
};
