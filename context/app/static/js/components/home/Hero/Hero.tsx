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

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState('1');
  const theme = useTheme();
  return (
    <Paper>
      <Box
        maxHeight="22.5rem"
        position="relative"
        sx={{
          overflowY: 'auto',
        }}
      >
        <HeroImageSlide title="Discover" />
        <HeroImageSlide title="Visualize" />
        <HeroImageSlide title="Download" />
        <HeroTimeline />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr 1fr"
        sx={{
          '& > *': {
            // cursor: 'pointer',
            // transition: 'background-color 0.3s',
            // '&:hover': {
            //   backgroundColor: theme.palette.grey[100],
            // },
            borderRight: `1px solid ${theme.palette.grey[200]}`,
            '&:last-child': {
              borderRight: '0px solid transparent',
            },
          },
        }}
      >
        <HeroTab
          title="Discover"
          activeBgColor="#F0F3EB"
          description="Find data with our faceted search or explore by biological entities of organs, molecules or cell types."
          icon={<SearchIcon color={theme.palette.success.main} fontSize="1.5rem" />}
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
        />
      </Box>
    </Paper>
  );
}
