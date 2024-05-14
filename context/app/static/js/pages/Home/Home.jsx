import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import ImageCarouselContainer from 'js/components/home/ImageCarouselContainer';
import Title from 'js/components/home/Title';
import HuBMAPDescription from 'js/components/home/HuBMAPDescription';
import EntityCounts from 'js/components/home/EntityCounts';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import ExternalLinks from 'js/components/home/ExternalLinks';
import RecentEntities from 'js/components/home/RecentEntities';

import { LowerContainerGrid, SectionHeader, OffsetDatasetsHeader, UpperGrid } from './style';

function Home({ organsCount }) {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));

  const scrollToBarChart = useCallback((node) => {
    if (node !== null && document.location.hash === '#hubmap-datasets') {
      node.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  return (
    <>
      <UpperGrid>
        <Container maxWidth="lg" gridArea="title">
          <Title />
          <HuBMAPDescription />
        </Container>
        <Container maxWidth="lg" gridArea="carousel">
          <ImageCarouselContainer />
        </Container>
        <Box gridArea="counts">
          <EntityCounts organsCount={organsCount} />
        </Box>
      </UpperGrid>
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
          <Box gridArea="bar-chart">
            <OffsetDatasetsHeader variant="h4" component="h3" id="hubmap-datasets" ref={scrollToBarChart}>
              HuBMAP Datasets
            </OffsetDatasetsHeader>
            <HuBMAPDatasetsChart />
          </Box>
        )}
        <RecentEntities />
        <Box gridArea="guidelines">
          <SectionHeader variant="h4" component="h3">
            Data Use Guidelines
          </SectionHeader>
          <DataUseGuidelines />
        </Box>
        <Box gridArea="external-links">
          <SectionHeader variant="h4" component="h3">
            External Links
          </SectionHeader>
          <ExternalLinks />
        </Box>
      </LowerContainerGrid>
    </>
  );
}

export default Home;
