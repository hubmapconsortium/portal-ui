import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import ImageCarouselContainer from 'js/components/home/ImageCarouselContainer';
import Title from 'js/components/home/Title';
import HuBMAPDescription from 'js/components/home/HuBMAPDescription';
import EntityCounts from 'js/components/home/EntityCounts';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import ExternalLinks from 'js/components/home/ExternalLinks';
import FacetSearch from 'js/components/home/FacetSearch';

import {
  GridAreaContainer,
  LowerContainerGrid,
  GridArea,
  SectionHeader,
  OffsetDatasetsHeader,
  UpperGrid,
} from './style';

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
        <GridAreaContainer maxWidth="lg" $gridAreaTitle="title">
          <Title />
          <HuBMAPDescription />
        </GridAreaContainer>
        <GridAreaContainer maxWidth="lg" $gridAreaTitle="carousel">
          <ImageCarouselContainer />
        </GridAreaContainer>
        <GridArea $gridAreaTitle="counts">
          <EntityCounts organsCount={organsCount} />
          <FacetSearch />
        </GridArea>
      </UpperGrid>
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
          <GridArea $gridAreaTitle="bar-chart">
            <OffsetDatasetsHeader variant="h4" component="h3" id="hubmap-datasets" ref={scrollToBarChart}>
              HuBMAP Datasets
            </OffsetDatasetsHeader>
            <HuBMAPDatasetsChart />
          </GridArea>
        )}
        <GridArea $gridAreaTitle="guidelines">
          <SectionHeader variant="h4" component="h3">
            Data Use Guidelines
          </SectionHeader>
          <DataUseGuidelines />
        </GridArea>
        <GridArea $gridAreaTitle="external-links">
          <SectionHeader variant="h4" component="h3">
            External Links
          </SectionHeader>
          <ExternalLinks />
        </GridArea>
      </LowerContainerGrid>
    </>
  );
}

export default Home;
