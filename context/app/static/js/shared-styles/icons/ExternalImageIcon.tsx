import React from 'react';
import { CSSProperties } from 'styled-components';
import * as externalIcons from './externalImageIcons';

interface ExternalImageIconProps {
  icon: keyof typeof externalIcons;
  style?: CSSProperties;
}

export default function ExternalImageIcon({ icon, style }: ExternalImageIconProps) {
  const { src, alt } = externalIcons[icon];
  return <img src={src} alt={alt} style={style} />;
}
