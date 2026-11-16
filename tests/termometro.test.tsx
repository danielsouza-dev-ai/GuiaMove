import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import TermometroPage from '@/app/termometro/page';

describe('Termômetro Sensorial e de Emoções', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the 4 Zones of Regulation levels', () => {
    render(<TermometroPage />);
    expect(screen.getByRole('button', { name: /azul/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verde/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /amarelo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vermelho/i })).toBeInTheDocument();
  });

  it('opens the primary strategy directly in 1 click when a zone is tapped', () => {
    render(<TermometroPage />);
    fireEvent.click(screen.getByRole('button', { name: /vermelho/i }));
    expect(screen.getByTestId('regulation-view')).toBeInTheDocument();
  });

  it('supports custom parent text strategy saved in localStorage and safe SpeechSynthesis fallback', () => {
    localStorage.setItem(
      'guiamove_termometro_config_v1',
      JSON.stringify({
        red: {
          type: 'custom_text',
          icon: 'heart',
          text: 'Abraçar o urso no cantinho da calma',
        },
      }),
    );

    render(<TermometroPage />);
    fireEvent.click(screen.getByRole('button', { name: /vermelho/i }));

    expect(
      screen.getByText('Abraçar o urso no cantinho da calma'),
    ).toBeInTheDocument();

    const listenBtn = screen.getByRole('button', { name: /ouvir/i });
    expect(() => fireEvent.click(listenBtn)).not.toThrow();
  });

  it('opens calming movements from the Reel with ARASAAC pictograms and allows switching between all 3 movements', () => {
    render(<TermometroPage />);
    expect(screen.getByText(/ARASAAC/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /amarelo/i }));
    expect(
      screen.getByRole('heading', { name: /abraço da borboleta/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /girar e balançar/i }));
    expect(
      screen.getByRole('heading', { name: /girar e balançar/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /balanço dos braços/i }));
    expect(
      screen.getByRole('heading', { name: /balanço dos braços/i }),
    ).toBeInTheDocument();
  });
});
