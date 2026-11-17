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
  { id: 'vaso', label: 'Sentar no vaso', arasaacId: 15927 },
  { id: 'papel', label: 'Passar papel', arasaacId: 37261 },
  { id: 'descarga', label: 'Dar descarga', arasaacId: 10184 },
  { id: 'vestir', label: 'Vestir a roupa', arasaacId: 6627 },
  { id: 'lavar-maos', label: 'Lavar as mãos', arasaacId: 8975 },
  { id: 'sabonete', label: 'Passar sabonete', arasaacId: 8094 },
  { id: 'toalha', label: 'Secar as mãos', arasaacId: 4758 },
  { id: 'escovar-dentes', label: 'Escovar os dentes', arasaacId: 6971 },
  { id: 'banho', label: 'Tomar banho', arasaacId: 6058 },
  { id: 'comer', label: 'Hora de comer', arasaacId: 2349 },
  { id: 'guardar-brinquedos', label: 'Guardar os brinquedos', arasaacId: 34657 },
  { id: 'brincar', label: 'Tempo de brincar', arasaacId: 23392 },
  { id: 'escola', label: 'Ir para a escola', arasaacId: 32446 },
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

export function loadRoutinesData(): RoutinesStorageData {
  const defaults = getDefaultRoutinesData();
  const saved = getLocalJson<Partial<RoutinesStorageData>>(ROTINAS_STORAGE_KEY, {});
  return {
    cardBank:
      Array.isArray(saved.cardBank) && saved.cardBank.length > 0
        ? saved.cardBank
        : defaults.cardBank,
    fixedRoutines:
      Array.isArray(saved.fixedRoutines) && saved.fixedRoutines.length > 0
        ? saved.fixedRoutines
        : defaults.fixedRoutines,
    firstThen:
      saved.firstThen?.first && saved.firstThen?.then
        ? saved.firstThen
        : defaults.firstThen,
  };
}

export function saveRoutinesData(data: RoutinesStorageData): void {
  setLocalJson(ROTINAS_STORAGE_KEY, data);
}
