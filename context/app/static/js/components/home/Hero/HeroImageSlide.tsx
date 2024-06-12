import PlaceholderImage from 'js/shared-styles/PlaceholderImage';
import React from 'react';
import { HeroPanelContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

export function HeroImageSlide({ title, index }: { title: string; index: number }) {
  const { activeTab } = useHeroTabContext();
  return (
    <HeroPanelContainer $index={index} $activeSlide={activeTab} $isImage>
      <PlaceholderImage
        title={title}
        alt={title}
        width={1232}
        height={320}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </HeroPanelContainer>
  );
}
