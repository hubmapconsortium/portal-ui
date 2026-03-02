import React from 'react';
import { render } from 'test-utils/functions';
import { BACKGROUND_CYCLE_INTERVAL_MS, HERO_CARDS } from './const';
import HeroBackground from './HeroBackground';

function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn((query: string) => ({
      matches: prefersReducedMotion && query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

beforeEach(() => {
  mockMatchMedia(false);
});

describe('HeroBackground', () => {
  it('renders one background image per hero card', () => {
    render(<HeroBackground />);
    expect(document.querySelectorAll('img')).toHaveLength(HERO_CARDS.length);
  });

  it('generates the correct webp srcset for the first card', () => {
    render(<HeroBackground />);
    const firstWebpSource = document.querySelector('source[type="image/webp"]') as HTMLSourceElement;
    expect(firstWebpSource.srcset).toContain(`${CDN_URL}/v3/hero_organ-25.webp 640w`);
    expect(firstWebpSource.srcset).toContain('1280w');
    expect(firstWebpSource.srcset).toContain('1920w');
    expect(firstWebpSource.srcset).toContain('2560w');
  });

  it('generates the correct png srcset for the first card', () => {
    render(<HeroBackground />);
    const firstImg = document.querySelector('img') as HTMLImageElement;
    expect(firstImg).toHaveAttribute('srcset', expect.stringContaining(`${CDN_URL}/v3/hero_organ-25.png 640w`));
  });

  it('uses sizes="100vw" on all images and sources', () => {
    render(<HeroBackground />);
    document.querySelectorAll('source').forEach((source) => {
      expect(source).toHaveAttribute('sizes', '100vw');
    });
    document.querySelectorAll('img').forEach((img) => {
      expect(img).toHaveAttribute('sizes', '100vw');
    });
  });

  describe('auto-cycling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it('starts a setInterval with BACKGROUND_CYCLE_INTERVAL_MS', () => {
      const spy = jest.spyOn(global, 'setInterval');
      render(<HeroBackground />);
      expect(spy).toHaveBeenCalledWith(expect.any(Function), BACKGROUND_CYCLE_INTERVAL_MS);
    });

    it('clears and does not restart the interval when prefers-reduced-motion is active', () => {
      // useReducedMotion initialises to false, then updates via matchMedia effect.
      // That causes the running interval to be cleaned up and not restarted.
      mockMatchMedia(true);
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      render(<HeroBackground />);
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
