import PlaceholderImage from 'js/shared-styles/PlaceholderImage';
import React from 'react';

export function HeroImageSlide({ title }: { title: string }) {
  return <PlaceholderImage title={title} alt={title} width={1232} height={22.5 * 16} />;
}
