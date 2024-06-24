import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { DownloadIcon, LightbulbIcon, SearchIcon, VisualizationIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import theme from 'js/theme/theme';
import HeroTimelineSlide from './HeroTimelineSlide';
import HeroTab, { HeroTabProps } from './HeroTab';
import { HeroImageSlide } from './HeroImageSlide';
import { HeroGridContainer } from './styles';
import { HeroTabContextProvider } from './HeroTabsContext';

const heroTabs = [
  {
    title: 'Discover',
    description:
      'Find data with our faceted search or explore by biological entities of organs, molecules or cell types.',
    icon: <SearchIcon color={theme.palette.success.main} fontSize="1.5rem" />,
    actions: [
      {
        title: 'Explore datasets',
        icon: <entityIconMap.Dataset fontSize="1.5rem" />,
        href: '/search?entity_type[0]=Dataset',
      },
      {
        title: 'Explore molecules/cell types',
        icon: <entityIconMap.Gene />,
        href: '/cells',
      },
    ],
    bgColor: '#F0F3EB', // success-90 in figma
    content: HeroImageSlide,
  },
  {
    title: 'Visualize',
    description:
      'Explore spatial and single-cell data through powerful visualizations to gain deeper insights for your research.',
    icon: <VisualizationIcon color="error" fontSize="1.5rem" />,
    actions: [
      {
        title: 'Visualize data with Workspaces',
        icon: <entityIconMap.Workspace />,
        href: '/workspaces',
      },
    ],
    bgColor: '#FBEBF3', // primary-90 in figma
    content: HeroImageSlide,
  },
  {
    title: 'Download',
    description:
      'Preview files with our built-in file browser and download datasets from Globus or dbGaP straight to your device.',
    icon: <DownloadIcon color="info" fontSize="1.5rem" />,
    actions: [
      {
        title: 'Find datasets to download',
        icon: <entityIconMap.Dataset fontSize="1.5rem" />,
        href: '/search?entity_type[0]=Dataset',
      },
    ],
    bgColor: '#EAF0F8', // info-90 in figma
    content: HeroImageSlide,
  },
  {
    title: "What's New?",
    description: 'Stay up to date with the latest HuBMAP Data Portal developments.',
    icon: <LightbulbIcon color="warning" fontSize="1.5rem" />,
    bgColor: '#FBEEEB', // warning-90 in figma
    content: HeroTimelineSlide,
  },
] satisfies Partial<HeroTabProps>[];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Paper component="section" role="tablist" aria-label="HuBMAP Introduction">
      <HeroTabContextProvider activeTab={activeTab} setActiveTab={setActiveTab}>
        <HeroGridContainer $activeSlide={activeTab} role="tablist">
          {heroTabs.map((tab, index) => (
            <HeroTab
              key={tab.title}
              title={tab.title}
              description={tab.description}
              icon={tab.icon}
              actions={tab.actions}
              index={index}
              bgColor={tab.bgColor}
              content={tab.content}
            />
          ))}
        </HeroGridContainer>
      </HeroTabContextProvider>
    </Paper>
  );
}
