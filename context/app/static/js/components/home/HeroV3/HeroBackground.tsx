import React, { useEffect, useState } from 'react';

import { BACKGROUND_COLORS, BACKGROUND_CYCLE_INTERVAL_MS } from './const';
import { BackgroundContainer, BackgroundLayer } from './styles';

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

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BACKGROUND_COLORS.length);
    }, BACKGROUND_CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <BackgroundContainer aria-hidden="true">
      {BACKGROUND_COLORS.map((color, index) => (
        <BackgroundLayer key={color} $active={index === activeIndex} $color={color} />
      ))}
    </BackgroundContainer>
  );
}
