import React from 'react';
import { CSSProperties } from 'styled-components';
import { externalIconMap } from './externalImageIcons';

interface ExternalImageIconProps {
  icon: keyof typeof externalIconMap;
  style?: CSSProperties;
}

export default function ExternalImageIcon({ icon, style }: ExternalImageIconProps) {
  const { src, alt } = externalIconMap[icon];
  return <img src={src} alt={alt} style={style} />;
}
