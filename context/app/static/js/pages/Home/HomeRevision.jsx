import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import Title from 'js/components/home-revision/Title';
import HuBMAPDescription from 'js/components/home-revision/HuBMAPDescription';
import EntityCounts from 'js/components/home-revision/EntityCounts';
import DataUseGuidelines from 'js/components/home-revision/DataUseGuidelines';
import TwitterTimeline from 'js/components/home-revision/TwitterTimeline';
import ExternalLinks from 'js/components/home-revision/ExternalLinks';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

import {
  GridAreaContainer,
  AboveTheFoldGrid,
  LowerContainerGrid,
  GridArea,
  SectionHeader,
  FlexGridArea,
  FlexGrowDiv,
} from './homeRevisionStyle';

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
            <SectionHeader variant="h4" component="h3">
              HuBMAP Data
            </SectionHeader>
            <AssayTypeBarChartContainer />
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
        <FlexGridArea $gridAreaTitle="timeline">
          <SectionHeader variant="h4" component="h3">
            Tweets{' '}
            <Typography variant="caption" component="span">
              by{' '}
            </Typography>
            <OutboundLink variant="caption" href="https://twitter.com/_hubmap">
              @_hubmap
            </OutboundLink>
          </SectionHeader>
          <FlexGrowDiv>
            <TwitterTimeline />
          </FlexGrowDiv>
        </FlexGridArea>
      </LowerContainerGrid>
    </>
  );
}

export default HomeRevision;
