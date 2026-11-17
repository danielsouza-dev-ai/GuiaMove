import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SequenciamentoPage from '@/app/sequenciamento/page';
import { DEFAULT_CARD_BANK } from '@/lib/rotinas/routinesConfig';
import { DEFAULT_SEQUENCING_CHALLENGES } from '@/lib/sequenciamento/sequencingConfig';

describe('Sequenciamento Lógico do Dia (/sequenciamento)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses all user-approved ARASAAC IDs across presets and updated escovar-dentes (2326) in Rotinas', () => {
    expect(
      DEFAULT_CARD_BANK.find((c) => c.id === 'escovar-dentes')?.arasaacId,
    ).toBe(2326);

    const byId = new Map(DEFAULT_SEQUENCING_CHALLENGES.map((c) => [c.id, c]));
    expect(byId.get('calcando-tenis')?.steps.map((s) => s.arasaacId)).toEqual([
      7014, 36573, 14534,
    ]);
    expect(byId.get('lavar-maos')?.steps.map((s) => s.arasaacId)).toEqual([
      37017, 35729, 2566,
    ]);
    expect(byId.get('hora-da-sede')?.steps.map((s) => s.arasaacId)).toEqual([
      4768, 2435, 6061,
    ]);
    expect(
      byId.get('plantinha-crescendo')?.steps.map((s) => s.arasaacId),
    ).toEqual([8689, 2816, 30522]);
    expect(byId.get('manha-escola')?.steps.map((s) => s.arasaacId)).toEqual([
      6549, 4626, 38265, 36473,
    ]);
    expect(byId.get('escovar-dentes')?.steps.map((s) => s.arasaacId)).toEqual([
      38813, 30087, 2326, 8560,
    ]);
    expect(byId.get('linha-tempo-dia')?.steps.map((s) => s.arasaacId)).toEqual([
      3175, 4611, 6537, 4592, 6479,
    ]);
  });

  it('locks correct cards, returns misplaced cards without punishment, and celebrates when solved', () => {
    render(<SequenciamentoPage />);

    // Start "Calçar o tênis" (3 steps: pe-descalco, colocar-meia, calcar-tenis)
    const card = screen.getByTestId('seq-card-calcando-tenis');
    fireEvent.click(card.querySelector('button')!);

    expect(screen.getByTestId('sequencing-game')).toBeInTheDocument();

    // Place 1st card right (pe-descalco), but swap 2nd and 3rd
    fireEvent.click(screen.getByTestId('seq-tray-pe-descalco'));
    fireEvent.click(screen.getByTestId('seq-tray-calcar-tenis'));
    fireEvent.click(screen.getByTestId('seq-tray-colocar-meia'));

    fireEvent.click(screen.getByTestId('verify-sequence-btn'));

    // Slot 0 should lock green; slots 1 and 2 return to tray with supportive feedback
    expect(screen.getByTestId('seq-slot-0')).toHaveAttribute(
      'data-locked',
      'true',
    );
    expect(screen.getByTestId('seq-slot-1')).toHaveAttribute(
      'data-locked',
      'false',
    );
    expect(screen.getByTestId('sequencing-feedback')).toHaveTextContent(
      /quase lá/i,
    );

    // Hint points to colocar-meia for 2º lugar
    fireEvent.click(screen.getByRole('button', { name: /me dá uma dica/i }));
    expect(screen.getByTestId('sequencing-feedback')).toHaveTextContent(
      /colocar a meia/i,
    );

    // Complete remaining slots in the right order
    fireEvent.click(screen.getByTestId('seq-tray-colocar-meia'));
    fireEvent.click(screen.getByTestId('seq-tray-calcar-tenis'));
    fireEvent.click(screen.getByTestId('verify-sequence-btn'));

    expect(screen.getByTestId('sequencing-celebration')).toBeInTheDocument();
  });

  it('filters challenges by difficulty level', () => {
    render(<SequenciamentoPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /nível 3 · dia inteiro/i }),
    );
    expect(screen.getByTestId('seq-card-linha-tempo-dia')).toBeInTheDocument();
    expect(
      screen.queryByTestId('seq-card-calcando-tenis'),
    ).not.toBeInTheDocument();
  });
});
