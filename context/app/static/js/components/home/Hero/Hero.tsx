import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { DownloadIcon, LightbulbIcon, SearchIcon, VisualizationIcon } from 'js/shared-styles/icons';
import { OrganIcon } from 'js/shared-styles/icons/URLSvgIcon';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import HeroTimeline from './HeroTimeline';
import HeroTab from './HeroTab';
import { HeroImageSlide } from './HeroImageSlide';
import { HeroGridContainer, HeroPanelContainer } from './styles';
import theme from 'js/theme';
import { HeroTabContextProvider } from './HeroTabsContext';

const heroTabs = [
  {
    title: 'Discover',
    description: 'Find data with our faceted search or explore by biological entities of organs, molecules or cell types.',
    icon: <SearchIcon color="success" fontSize="1.5rem" />,
    actions: [
      {
        title: 'Explore organs',
        icon: <OrganIcon ariaLabel="View organ pages" />,
        href: '/organ',
      },
      {
        title: 'Explore molecules/cell types',
        icon: <entityIconMap.Gene />,
        href: '/cells',
      },
    ],
  },
  {
    title: 'Visualize',
    description: 'Explore spatial and single-cell data through powerful visualizations to gain deeper insights for your research.',
    icon: <VisualizationIcon color="primary" fontSize="1.5rem" />,
    actions: [
      {
        title: 'Visualize data with Workspaces',
        icon: <entityIconMap.Workspace />,
        href: '/workspaces',
      },
    ],
  },
  {
    title: 'Download',
    description: 'Preview files with our built-in file browser and download datasets from Globus or dbGaP straight to your device.',
    icon: <DownloadIcon color="info" fontSize="1.5rem" />,
    actions: [
      {
        title: 'Find datasets to download',
        icon: <entityIconMap.Dataset />,
        href: '/search?entity_type[0]=Dataset',
      },
    ],
  },
  {
    title: "What's New?",
    description: 'Stay up to date with the latest HuBMAP Data Portal developments.',
    icon: <LightbulbIcon color="warning" fontSize="1.5rem" />,
    bgColor: theme.palette.warning.light
  },
];

const heroImages = [
  { title: 'Discover' },
  { title: 'Visualize' },
  { title: 'Download' },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  return (
    <Paper>
      <HeroTabContextProvider activeTab={activeTab} setActiveTab={setActiveTab} >
        <HeroGridContainer $activeSlide={activeTab}>
          <HeroImageSlide title="Discover" index={0} />
          <HeroImageSlide title="Visualize" index={1} />
          <HeroImageSlide title="Download" index={2} />
          <HeroTimeline index={3} />
          <HeroTab
            title="Discover"
            activeBgColor="#F0F3EB"
            description="Find data with our faceted search or explore by biological entities of organs, molecules or cell types."
            icon={<SearchIcon color={theme.palette.success.main} fontSize="1.5rem" />}
            index={0}
            actions={[
              {
                title: 'Explore organs',
                icon: <OrganIcon ariaLabel="View organ pages" />,
                href: '/organ',
              },
              {
                title: 'Explore molecules/cell types',
                icon: <entityIconMap.Gene />,
                href: '/cells',
              },
            ]}
          />
          <HeroTab
            title="Visualize"
            activeBgColor="#FBEBF3"
            description="Explore spatial and single-cell data through powerful visualizations to gain deeper insights for your research."
            icon={<VisualizationIcon color="primary" fontSize="1.5rem" />}
            index={1}
            actions={[
              {
                title: 'Visualize data with Workspaces',
                icon: <entityIconMap.Workspace />,
                href: '/workspaces',
              },
            ]}
          />
          <HeroTab
            title="Download"
            activeBgColor="#EAF0F8"
            description="Preview files with our built-in file browser and download datasets from Globus or dbGaP straight to your device."
            icon={<DownloadIcon color="info" fontSize="1.5rem" />}
            index={2}
            actions={[
              {
                title: 'Find datasets to download',
                icon: <entityIconMap.Dataset />,
                href: '/search?entity_type[0]=Dataset',
              },
            ]}
          />
          <HeroTab
            title="What's New?"
            activeBgColor="#FBEEEB"
            description="Stay up to date with the latest HuBMAP Data Portal developments."
            icon={<LightbulbIcon color="warning" fontSize="1.5rem" />}
            index={3}
          />
        </HeroGridContainer>
      </HeroTabContextProvider>
    </Paper>
  );
}
