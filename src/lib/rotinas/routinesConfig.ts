import { getArasaacPngUrl } from '@/lib/termometro/zones';
import { getLocalJson, setLocalJson } from '@/utils/storage';

export interface RoutineCardItem {
  id: string;
  label: string;
  arasaacId: number;
}

export interface FixedRoutine {
  id: string;
  title: string;
  description: string;
  steps: RoutineCardItem[];
}

export interface FirstThenConfig {
  first: RoutineCardItem;
  then: RoutineCardItem;
}

export interface RoutinesStorageData {
  cardBank: RoutineCardItem[];
  fixedRoutines: FixedRoutine[];
  firstThen: FirstThenConfig;
}

export const ROTINAS_STORAGE_KEY = 'guiamove_rotinas_v1';

/**
 * Returns the static ARASAAC 300px PNG URL for a given pictogram ID.
 */
export function getArasaacPictogramUrl(arasaacId: number): string {
  return getArasaacPngUrl(arasaacId);
}

export const DEFAULT_CARD_BANK: RoutineCardItem[] = [
  { id: 'banheiro', label: 'Ir ao banheiro', arasaacId: 5921 },
  { id: 'vaso', label: 'Sentar no vaso', arasaacId: 16709 },
  { id: 'papel', label: 'Passar papel', arasaacId: 37261 },
  { id: 'descarga', label: 'Dar descarga', arasaacId: 10184 },
  { id: 'vestir', label: 'Vestir a roupa', arasaacId: 37816 },
  { id: 'lavar-maos', label: 'Lavar as mãos', arasaacId: 8975 },
  { id: 'sabonete', label: 'Passar sabonete', arasaacId: 35729 },
  { id: 'toalha', label: 'Secar as mãos', arasaacId: 2566 },
  { id: 'escovar-dentes', label: 'Escovar os dentes', arasaacId: 2326 },
  { id: 'banho', label: 'Tomar banho', arasaacId: 26803 },
  { id: 'comer', label: 'Hora de comer', arasaacId: 2349 },
  { id: 'guardar-brinquedos', label: 'Guardar os brinquedos', arasaacId: 5514 },
  { id: 'brincar', label: 'Tempo de brincar', arasaacId: 6537 },
  { id: 'escola', label: 'Ir para a escola', arasaacId: 36473 },
  { id: 'dormir', label: 'Hora de dormir', arasaacId: 6479 },
];

function pickBankCard(id: string): RoutineCardItem {
  const found = DEFAULT_CARD_BANK.find((c) => c.id === id);
  return found ? { ...found } : { ...DEFAULT_CARD_BANK[0] };
}

export const DEFAULT_FIXED_ROUTINES: FixedRoutine[] = [
  {
    id: 'rotina-xixi',
    title: 'Rotina do Xixi',
    description: 'Passo a passo para usar o banheiro com autonomia',
    steps: [
      pickBankCard('banheiro'),
      pickBankCard('vaso'),
      pickBankCard('papel'),
      pickBankCard('descarga'),
      pickBankCard('vestir'),
      pickBankCard('lavar-maos'),
    ],
  },
  {
    id: 'rotina-maos',
    title: 'Lavar as Mãos',
    description: 'Higiene das mãos passo a passo',
    steps: [
      pickBankCard('lavar-maos'),
      pickBankCard('sabonete'),
      pickBankCard('toalha'),
    ],
  },
  {
    id: 'rotina-dormir',
    title: 'Hora de Dormir',
    description: 'Preparação tranquila para a noite',
    steps: [
      pickBankCard('guardar-brinquedos'),
      pickBankCard('banho'),
      pickBankCard('vestir'),
      pickBankCard('escovar-dentes'),
      pickBankCard('dormir'),
    ],
  },
];

export const DEFAULT_FIRST_THEN: FirstThenConfig = {
  first: pickBankCard('guardar-brinquedos'),
  then: pickBankCard('brincar'),
};

export function getDefaultRoutinesData(): RoutinesStorageData {
  return {
    cardBank: DEFAULT_CARD_BANK.map((c) => ({ ...c })),
    fixedRoutines: DEFAULT_FIXED_ROUTINES.map((r) => ({
      ...r,
      steps: r.steps.map((s) => ({ ...s })),
    })),
    firstThen: {
      first: { ...DEFAULT_FIRST_THEN.first },
      then: { ...DEFAULT_FIRST_THEN.then },
    },
  };
}

function syncDefaultCardPictogram(card: RoutineCardItem): RoutineCardItem {
  const defaultCard = DEFAULT_CARD_BANK.find((c) => c.id === card.id);
  if (!defaultCard) return card;
  return { ...card, arasaacId: defaultCard.arasaacId };
}

export function loadRoutinesData(): RoutinesStorageData {
  const defaults = getDefaultRoutinesData();
  const saved = getLocalJson<Partial<RoutinesStorageData>>(ROTINAS_STORAGE_KEY, {});
  const cardBank =
    Array.isArray(saved.cardBank) && saved.cardBank.length > 0
      ? saved.cardBank.map(syncDefaultCardPictogram)
      : defaults.cardBank;

  const fixedRoutines =
    Array.isArray(saved.fixedRoutines) && saved.fixedRoutines.length > 0
      ? saved.fixedRoutines.map((routine) => ({
          ...routine,
          steps: Array.isArray(routine.steps)
            ? routine.steps.map(syncDefaultCardPictogram)
            : [],
        }))
      : defaults.fixedRoutines;

  const firstThen =
    saved.firstThen?.first && saved.firstThen?.then
      ? {
          first: syncDefaultCardPictogram(saved.firstThen.first),
          then: syncDefaultCardPictogram(saved.firstThen.then),
        }
      : defaults.firstThen;

  return { cardBank, fixedRoutines, firstThen };
}

export function saveRoutinesData(data: RoutinesStorageData): void {
  setLocalJson(ROTINAS_STORAGE_KEY, data);
}
