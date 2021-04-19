import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import Title from 'js/components/home-revision/Title';
import HuBMAPDescription from 'js/components/home-revision/HuBMAPDescription';
import EntityCounts from 'js/components/home-revision/EntityCounts';
import DataUseGuidelines from 'js/components/home-revision/DataUseGuidelines';
import TwitterTimeline from 'js/components/home-revision/TwitterTimeline';

import { GridAreaContainer, AboveTheFoldGrid, LowerContainerGrid, GridArea } from './homeRevisionStyle';

function HomeRevision() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      <AboveTheFoldGrid>
        <GridAreaContainer maxWidth="lg" $gridAreaTitle="title">
          <Title />
        </GridAreaContainer>
        <GridAreaContainer maxWidth="lg" $gridAreaTitle="description">
          <HuBMAPDescription />
        </GridAreaContainer>
        <GridAreaContainer maxWidth="lg" $gridAreaTitle="carousel">
          <ImageCarouselContainer />
        </GridAreaContainer>
        <EntityCounts />
      </AboveTheFoldGrid>
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
          <GridArea $gridAreaTitle="bar-chart">
            <AssayTypeBarChartContainer />
          </GridArea>
        )}
        <GridArea $gridAreaTitle="guidelines">
          <DataUseGuidelines />
        </GridArea>
        <GridArea $gridAreaTitle="external-links">External Links</GridArea>
        <GridArea $gridAreaTitle="timeline">
          <TwitterTimeline />
        </GridArea>
      </LowerContainerGrid>
    </>
  );
}

export default HomeRevision;
