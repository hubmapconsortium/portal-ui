import React, { CSSProperties } from 'react';
import { externalIconMap } from './externalImageIcons';

interface ExternalImageIconProps {
  icon: keyof typeof externalIconMap;
  style?: CSSProperties;
}

// Clipped to the content box, so the backdrop stays the size of the logo inside padded icon slots.
export const whiteBackgroundStyle: CSSProperties = {
  backgroundColor: 'white',
  backgroundClip: 'content-box',
  borderRadius: 4,
};

export default function ExternalImageIcon({ icon, style }: ExternalImageIconProps) {
  const { src, alt, whiteBackground } = externalIconMap[icon];
  return <img src={src} alt={alt} style={whiteBackground ? { ...whiteBackgroundStyle, ...style } : style} />;
}
