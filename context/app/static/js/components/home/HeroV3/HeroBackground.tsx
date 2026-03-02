import React, { useEffect, useState } from 'react';

import { BACKGROUND_CYCLE_INTERVAL_MS, BACKGROUND_FADE_DURATION_MS, HERO_CARDS } from './const';
import { BackgroundContainer, BackgroundImageLayer, BackgroundOverlay } from './styles';

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
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
              loading="eager"
            />
          </picture>
        </BackgroundImageLayer>
      ))}
      <BackgroundOverlay />
    </BackgroundContainer>
  );
}
