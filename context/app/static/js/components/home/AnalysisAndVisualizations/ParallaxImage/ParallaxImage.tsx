import React from 'react';
import { useSpring } from '@react-spring/web';

import { SlideImage } from '../types';
import { ImageContainer, AnimatedImage } from './styles';

interface ParallaxImageProps extends SlideImage {
  /** Scroll progress value from 0 to 1 */
  progress: number;
  /** Whether user prefers reduced motion */
  isReducedMotion: boolean;
}

function ParallaxImage({ src, alt, delay = 0, progress, isReducedMotion }: ParallaxImageProps) {
  // Adjust progress to account for stagger delay
  const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

  const springProps = useSpring({
    opacity: isReducedMotion ? 1 : adjustedProgress,
    transform: isReducedMotion ? 'translateY(0px)' : `translateY(${(1 - adjustedProgress) * 40}px)`,
    config: { tension: 280, friction: 60 },
  });

  return (
    <ImageContainer>
      <AnimatedImage src={src} alt={alt} loading="lazy" style={springProps} />
    </ImageContainer>
  );
}

export default React.memo(ParallaxImage);
