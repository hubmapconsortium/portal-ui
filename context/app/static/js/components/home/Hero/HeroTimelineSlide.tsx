import React, { useEffect, useRef } from 'react';

import Timeline from 'js/shared-styles/Timeline';

import Typography from '@mui/material/Typography';

import { useIsDesktop, useIsMobile } from 'js/hooks/media-queries';
import { HOME_TIMELINE_ITEMS } from './const';
import { HeroPanelContainer } from './styles';
import { useHeroTabContext } from './HeroTabsContext';

interface HeroTimelineProps {
  index: number;
}

export default function HeroTimelineSlide({ index }: HeroTimelineProps) {
  const { activeTab, setActiveTab } = useHeroTabContext();
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const onFocus = () => setActiveTab(index);
  const isMobile = useIsMobile();

  // Reset scroll position when switching tabs
  useEffect(() => {
    if (isDesktop && ref.current && activeTab === index) {
      ref.current.scrollTop = 0;
    }
  }, [activeTab, index, isDesktop]);
  return (
    <HeroPanelContainer
      ref={ref}
      onFocus={onFocus}
      $index={index}
      $activeSlide={activeTab}
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        background: 'white',
      }}
    >
      <Typography variant="h4" px={2} py={1} zIndex={2} bgcolor="#FBEEEB" position="sticky" top={0}>
        Latest Changes
      </Typography>
      <Timeline data={HOME_TIMELINE_ITEMS} expandable={isMobile} />
    </HeroPanelContainer>
  );
}
