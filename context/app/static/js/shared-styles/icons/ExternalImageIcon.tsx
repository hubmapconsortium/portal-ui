import React from 'react';
import { externalIconMap } from './externalImageIcons';

interface ExternalImageIconProps {
  icon: keyof typeof externalIconMap;
}

export default function ExternalImageIcon({ icon }: ExternalImageIconProps) {
  const { src, alt } = externalIconMap[icon];
  return <img src={src} alt={alt} />;
}
