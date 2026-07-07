import React, { useEffect, useRef } from 'react';
import { useSpring } from '@react-spring/web';

import { SlideImage } from '../types';
import { ImageContainer, AnimatedImage, AnimatedVideo } from './styles';

interface ParallaxImageProps extends SlideImage {
  /** Scroll progress value from 0 to 1 */
  progress: number;
  /** Whether user prefers reduced motion */
  isReducedMotion: boolean;
}

// Renders a single scroll-animated media slot: an <img>, or an autoplaying,
// looping, muted <video> when `videoSrc` is provided.
function ParallaxImage({ src, alt, delay = 0, videoSrc, poster, progress, isReducedMotion }: ParallaxImageProps) {
  // Adjust progress to account for stagger delay
  const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

  const springProps = useSpring({
    opacity: isReducedMotion ? 1 : adjustedProgress,
    transform: isReducedMotion ? 'translateY(0px)' : `translateY(${(1 - adjustedProgress) * 40}px)`,
    config: { tension: 280, friction: 60 },
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay the video only while it is scrolled into view (and never for
  // reduced-motion users). Pauses when it leaves the viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || isReducedMotion) return undefined;

    // Set imperatively — React's `muted` prop is not always applied to the element,
    // and muting is required for autoplay to be allowed.
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        try {
          if (entry.isIntersecting) {
            // play() returns a promise in browsers (undefined in jsdom); swallow autoplay rejections.
            void Promise.resolve(video.play()).catch(() => {});
          } else {
            video.pause();
          }
        } catch {
          // Environments without real media support (e.g. jsdom).
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoSrc, isReducedMotion]);

  return (
    <ImageContainer>
      {videoSrc ? (
        <AnimatedVideo
          ref={videoRef}
          src={videoSrc}
          poster={poster ?? src}
          aria-label={alt}
          muted
          loop
          playsInline
          preload="metadata"
          style={springProps}
        />
      ) : (
        <AnimatedImage src={src} alt={alt} loading="lazy" style={springProps} />
      )}
    </ImageContainer>
  );
}

export default React.memo(ParallaxImage);
