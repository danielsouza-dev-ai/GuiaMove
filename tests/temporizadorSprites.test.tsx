import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CharacterAvatar } from '@/components/temporizador/CharacterAvatar';
import { ChocolateRewardSvg, WavyChipSvg } from '@/components/temporizador/FoodSprites';
import type { AvatarConfig } from '@/utils/storage';

const sampleConfig: AvatarConfig = {
  skinTone: '#8D5524',
  hairStyle: 'curly',
  hairColor: '#1E1B18',
  bodyBuild: 'sturdy',
};

describe('Temporizador SVG sprites', () => {
  it('renders CharacterAvatar across all 5 phases with custom skinTone', () => {
    const phases = ['anticipation', 'mouth_open', 'bite', 'chewing', 'celebration'] as const;
    for (const phase of phases) {
      const { container, unmount } = render(
        <CharacterAvatar phase={phase} config={sampleConfig} size={96} />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(container.innerHTML).toContain('#8D5524');
      unmount();
    }
  });

  it('renders WavyChipSvg with progressive bites and ChocolateRewardSvg', () => {
    const { rerender } = render(<WavyChipSvg bitesTaken={0} maxBites={10} />);
    expect(screen.getByTestId('wavy-chip-svg')).toBeInTheDocument();

    rerender(<WavyChipSvg bitesTaken={5} maxBites={10} />);
    expect(screen.getByTestId('wavy-chip-svg')).toHaveAttribute('data-bites', '5');

    render(<ChocolateRewardSvg size={120} />);
    expect(screen.getByTestId('chocolate-reward-svg')).toBeInTheDocument();
  });
});
