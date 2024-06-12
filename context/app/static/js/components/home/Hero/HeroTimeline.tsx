import React from 'react';

import Timeline from 'js/shared-styles/Timeline';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { HOME_TIMELINE_ITEMS } from './const';
import { HeroImageSlide } from './HeroImageSlide';
import { HeroPanelContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

interface HeroTimelineProps {
  index: number;
}

export default function HeroTimeline({ index }: HeroTimelineProps) {
  const { activeTab } = useHeroTabContext();
  return (
    <HeroPanelContainer $index={index} $activeSlide={activeTab}>
      <Typography variant="h4" px={2} py={1} zIndex={2} bgcolor="#FBEEEB" position="sticky" top={0}>
        Latest Changes
      </Typography>
      <Timeline data={HOME_TIMELINE_ITEMS} />
    </HeroPanelContainer>
  );
}
