import { Box } from '@mui/material';
import { width } from '@mui/system';
import PlaceholderImage from 'js/shared-styles/PlaceholderImage';
import React from 'react';
import { HeroPanelContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

export function HeroImageSlide({ title, index }: { title: string, index: number }) {
  const { activeTab } = useHeroTabContext();
  return (
    <HeroPanelContainer $index={index} $activeSlide={activeTab}>
      <PlaceholderImage title={title} alt={title} width={1280} height={320} />
    </HeroPanelContainer>
  );
}
