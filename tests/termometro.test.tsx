import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import TermometroPage from '@/app/termometro/page';

describe('Termômetro Sensorial e de Emoções', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('allows searching ARASAAC API inside Texto dos Pais and saves chosen arasaacId', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { _id: 2456, keywords: [{ keyword: 'urso' }] },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<TermometroPage />);

    // Unlock parental editor (hold 2000ms)
    const editBtn = screen.getByRole('button', { name: /editar/i });
    fireEvent.pointerDown(editBtn);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();

    // Pick "Texto dos Pais" for first zone (Azul)
    const customTextBtns = screen.getAllByRole('button', {
      name: /texto dos pais/i,
    });
    fireEvent.click(customTextBtns[0]);

    const searchInput = screen.getByLabelText(
      /buscar pictograma arasaac para zona azul/i,
    );
    fireEvent.change(searchInput, { target: { value: 'urso' } });

    const searchBtns = screen.getAllByRole('button', { name: /^buscar$/i });
    fireEvent.click(searchBtns[0]);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /selecionar pictograma urso/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /selecionar pictograma urso/i }),
    );
    fireEvent.change(
      screen.getByLabelText(/texto personalizado da zona azul/i),
      { target: { value: 'Abraçar o urso' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /salvar estratégias/i }));

    fireEvent.click(screen.getByRole('button', { name: /azul/i }));
    const imgs = screen
      .getByTestId('regulation-view')
      .querySelectorAll('img');
    expect(
      Array.from(imgs).some((img) =>
        img.getAttribute('src')?.includes('/2456/2456_300.png'),
      ),
    ).toBe(true);
  });
});
