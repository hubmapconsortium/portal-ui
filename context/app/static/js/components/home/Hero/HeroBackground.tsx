import React, { useEffect, useState } from 'react';

import { BACKGROUND_CYCLE_INTERVAL_MS, BACKGROUND_FADE_DURATION_MS, HERO_CARDS } from './const';
import { BackgroundContainer, BackgroundImageLayer, BackgroundOverlay } from './styles';

function useReducedMotion() {
  // Read synchronously on mount so the effect only subscribes to later changes —
  // setting state inside the effect body trips react-hooks/set-state-in-effect.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

function buildSrcSet(imageName: string, ext: string): string {
  return [
    `${CDN_URL}/v3/${imageName}-25.${ext} 640w`,
    `${CDN_URL}/v3/${imageName}-50.${ext} 1280w`,
    `${CDN_URL}/v3/${imageName}-75.${ext} 1920w`,
    `${CDN_URL}/v3/${imageName}-100.${ext} 2560w`,
  ].join(', ');
}

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Auto-cycle — paused while any card is hovered
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_CARDS.length);
    }, BACKGROUND_CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <BackgroundContainer aria-hidden="true">
      {HERO_CARDS.map(({ imageName }, index) => (
        <BackgroundImageLayer
          key={imageName}
          $active={index === activeIndex}
          $transitionDuration={BACKGROUND_FADE_DURATION_MS}
        >
          <picture>
            <source type="image/webp" srcSet={buildSrcSet(imageName, 'webp')} sizes="100vw" />
            <img
              srcSet={buildSrcSet(imageName, 'png')}
              sizes="100vw"
              src={`${CDN_URL}/v3/${imageName}-100.png`}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </picture>
        </BackgroundImageLayer>
      ))}
      <BackgroundOverlay />
    </BackgroundContainer>
  );
}
