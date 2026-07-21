import React, { useEffect, useRef } from 'react';

import { SlideImage } from '../types';
import { ImageContainer, SlideImg, SlideVideo } from './styles';

interface ParallaxImageProps extends SlideImage {
  /** Whether the user prefers reduced motion (gates video autoplay) */
  isReducedMotion: boolean;
  /** Whether this media's slide is the prominent one in view (gates video playback) */
  isProminent?: boolean;
}

// A single media slot: an <img>, or an autoplaying, looping, muted <video> when
// `videoSrc` is provided.
function ParallaxImage({ src, alt, videoSrc, poster, isReducedMotion, isProminent = true }: ParallaxImageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play the video only while its slide is the prominent one (and never for
  // reduced-motion users). Pauses otherwise.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // Set imperatively — React's `muted` prop is not always applied to the element,
    // and muting is required for autoplay to be allowed.
    video.muted = true;

    try {
      if (isProminent && !isReducedMotion) {
        // play() returns a promise in browsers (undefined in jsdom); swallow autoplay rejections.
        void Promise.resolve(video.play()).catch(() => {});
      } else {
        video.pause();
      }
    } catch {
      // Environments without real media support (e.g. jsdom).
    }
  }, [videoSrc, isProminent, isReducedMotion]);

  return (
    <ImageContainer>
      {videoSrc ? (
        <SlideVideo
          ref={videoRef}
          src={videoSrc}
          poster={poster ?? src}
          aria-label={alt}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <SlideImg src={src} alt={alt} loading="lazy" />
      )}
    </ImageContainer>
  );
}

export default React.memo(ParallaxImage);
