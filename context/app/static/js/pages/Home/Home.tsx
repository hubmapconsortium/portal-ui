import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import Title from 'js/components/home/Title';
import EntityCounts from 'js/components/home/EntityCounts';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import RecentEntities from 'js/components/home/RecentEntities';
import ExploreTools from 'js/components/home/ExploreTools';

import Hero from 'js/components/home/Hero';
import { LowerContainerGrid, SectionHeader, OffsetDatasetsHeader, UpperGrid, GridAreaContainer } from './style';
import { PrivacyTipRounded } from '@mui/icons-material';
import RelatedToolsAndResources from 'js/components/home/RelatedToolsAndResources';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

function Home() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));

  const scrollToBarChart = useCallback((node: HTMLElement | null) => {
    if (node !== null && document.location.hash === '#hubmap-datasets') {
      node.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  return (
    <>
      <UpperGrid>
        <GridAreaContainer maxWidth="lg" $gridArea="title">
          <Title />
        </GridAreaContainer>
        <GridAreaContainer maxWidth="lg" $gridArea="carousel">
          <Hero />
        </GridAreaContainer>
        <Box gridArea="counts">
          <EntityCounts />
        </Box>
      </UpperGrid>
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
          <Box gridArea="bar-chart">
            <OffsetDatasetsHeader
              variant="h2"
              component="h3"
              id="hubmap-datasets"
              ref={scrollToBarChart}
              icon={entityIconMap.Dataset}
            >
              HuBMAP Datasets
            </OffsetDatasetsHeader>
            <HuBMAPDatasetsChart />
          </Box>
        )}
        <RecentEntities />
        <Box gridArea="explore-tools">
          <SectionHeader variant="h2" component="h3">
            Explore Tools and Resources for Data Visualization & Analysis
          </SectionHeader>
          <ExploreTools />
        </Box>
        <Box gridArea="guidelines">
          <SectionHeader variant="h2" component="h3" icon={PrivacyTipRounded}>
            Data Use Guidelines
          </SectionHeader>
          <DataUseGuidelines />
        </Box>
        <Box gridArea="related-tools-and-resources">
          <RelatedToolsAndResources />
        </Box>
      </LowerContainerGrid>
    </>
  );
}

export default Home;
