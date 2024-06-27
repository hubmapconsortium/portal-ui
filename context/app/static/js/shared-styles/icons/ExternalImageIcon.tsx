import React from 'react';
import * as externalIcons from './externalImageIcons';

interface ExternalImageIconProps {
  icon: keyof typeof externalIcons;
}

export default function ExternalImageIcon({ icon }: ExternalImageIconProps) {
  const { src, alt } = externalIcons[icon];
  return <img src={src} alt={alt} />;
}
