import { getArasaacPngUrl } from '@/lib/termometro/zones';
import { getLocalJson, setLocalJson } from '@/utils/storage';

export type SequencingLevel = 1 | 2 | 3;

export interface SequencingStep {
  id: string;
  label: string;
  arasaacId: number;
}

export interface SequencingChallenge {
  id: string;
  title: string;
  level: SequencingLevel;
  levelLabel: string;
  explanation: string;
  steps: SequencingStep[];
  isCustom?: boolean;
}

export const SEQUENCING_STORAGE_KEY = 'guiamove_sequenciamento_v1';

export function getSequencingPictogramUrl(arasaacId: number): string {
  return getArasaacPngUrl(arasaacId);
}

export const DEFAULT_SEQUENCING_CHALLENGES: SequencingChallenge[] = [
  {
    id: 'calcando-tenis',
    title: 'Calçar o tênis',
    level: 1,
    levelLabel: 'Nível 1 · 3 passos',
    explanation:
      'Muito bem! Primeiro ficamos com o pé descalço, depois colocamos a meia e por último calçamos o tênis.',
    steps: [
      { id: 'pe-descalco', label: 'Pé descalço', arasaacId: 7014 },
      { id: 'colocar-meia', label: 'Colocar a meia', arasaacId: 36573 },
      { id: 'calcar-tenis', label: 'Calçar o tênis', arasaacId: 14534 },
    ],
  },
  {
    id: 'lavar-maos',
    title: 'Lavar as mãos',
    level: 1,
    levelLabel: 'Nível 1 · 3 passos',
    explanation:
      'Isso mesmo! Primeiro abrimos a torneira, depois ensaboamos as mãos e por último secamos com a toalha.',
    steps: [
      { id: 'abrir-torneira', label: 'Abrir a torneira', arasaacId: 37017 },
      { id: 'ensaboar-maos', label: 'Ensaboar as mãos', arasaacId: 35729 },
      { id: 'secar-maos', label: 'Secar as mãos', arasaacId: 2566 },
    ],
  },
  {
    id: 'hora-da-sede',
    title: 'Hora da sede',
    level: 1,
    levelLabel: 'Nível 1 · 3 passos',
    explanation:
      'Perfeito! Primeiro pegamos o copo, depois colocamos a água da jarra e só então bebemos.',
    steps: [
      { id: 'pegar-copo', label: 'Copo', arasaacId: 4768 },
      { id: 'jarra-agua', label: 'Jarra de água', arasaacId: 2435 },
      { id: 'beber-agua', label: 'Beber água', arasaacId: 6061 },
    ],
  },
  {
    id: 'plantinha-crescendo',
    title: 'Plantinha crescendo',
    level: 1,
    levelLabel: 'Nível 1 · 3 passos',
    explanation:
      'Muito bem! Primeiro colocamos a semente na terra, depois regamos e aí a flor cresce.',
    steps: [
      { id: 'semente', label: 'Semente', arasaacId: 8689 },
      { id: 'regar', label: 'Regar', arasaacId: 2816 },
      { id: 'flor', label: 'Flor', arasaacId: 30522 },
    ],
  },
  {
    id: 'manha-escola',
    title: 'Manhã na escola',
    level: 2,
    levelLabel: 'Nível 2 · 4 passos',
    explanation:
      'Ótimo! De manhã levantamos da cama, tomamos café, colocamos a mochila e vamos para a escola.',
    steps: [
      { id: 'levantar-cama', label: 'Levantar da cama', arasaacId: 6549 },
      { id: 'cafe-manha', label: 'Tomar café da manhã', arasaacId: 4626 },
      { id: 'por-mochila', label: 'Pôr a mochila', arasaacId: 38265 },
      { id: 'ir-escola', label: 'Ir para a escola', arasaacId: 36473 },
    ],
  },
  {
    id: 'escovar-dentes',
    title: 'Escovar os dentes',
    level: 2,
    levelLabel: 'Nível 2 · 4 passos',
    explanation:
      'Parabéns! Pegamos a escova, colocamos a pasta, escovamos os dentes e enxaguamos a boca.',
    steps: [
      { id: 'escova', label: 'Escova de dentes', arasaacId: 38813 },
      { id: 'pasta', label: 'Colocar pasta de dentes', arasaacId: 30087 },
      { id: 'escovar', label: 'Escovar os dentes', arasaacId: 2326 },
      { id: 'enxaguar', label: 'Enxaguar a boca', arasaacId: 8560 },
    ],
  },
  {
    id: 'linha-tempo-dia',
    title: 'Linha do tempo do dia',
    level: 3,
    levelLabel: 'Nível 3 · Dia inteiro (5 passos)',
    explanation:
      'Muito bem! O dia começa de manhã, passa pelo almoço, pela brincadeira da tarde, pelo jantar e termina na hora de dormir.',
    steps: [
      { id: 'amanhecer', label: 'Amanhecer / Manhã', arasaacId: 3175 },
      { id: 'almoco', label: 'Almoço', arasaacId: 4611 },
      { id: 'brincar-tarde', label: 'Tarde / Brincar', arasaacId: 6537 },
      { id: 'jantar', label: 'Jantar', arasaacId: 4592 },
      { id: 'dormir-noite', label: 'Dormir / Noite', arasaacId: 6479 },
    ],
  },
];

export function shuffleSteps(steps: SequencingStep[]): SequencingStep[] {
  if (steps.length <= 1) return [...steps];
  const arr = [...steps];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const isSameOrder = arr.every((item, idx) => item.id === steps[idx].id);
  if (isSameOrder) {
    // Rotate by 1 so the puzzle never starts already solved
    const first = arr.shift()!;
    arr.push(first);
  }
  return arr;
}

export function loadCustomChallenges(): SequencingChallenge[] {
  const saved = getLocalJson<SequencingChallenge[]>(SEQUENCING_STORAGE_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

export function saveCustomChallenges(challenges: SequencingChallenge[]): void {
  setLocalJson(SEQUENCING_STORAGE_KEY, challenges);
}
