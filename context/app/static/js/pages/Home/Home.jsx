import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import AssayTypeBarChartContainer from 'js/components/home/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home/ImageCarouselContainer';
import Title from 'js/components/home/Title';
import HuBMAPDescription from 'js/components/home/HuBMAPDescription';
import EntityCounts from 'js/components/home/EntityCounts';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import TwitterTimeline from 'js/components/home/TwitterTimeline';
import ExternalLinks from 'js/components/home/ExternalLinks';
import FacetSearch from 'js/components/home/FacetSearch';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

import {
  GridAreaContainer,
  LowerContainerGrid,
  GridArea,
  SectionHeader,
  FlexGridArea,
  FlexGrowDiv,
  UpperGrid,
} from './style';

function Home() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
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
          <EntityCounts />
          <FacetSearch />
        </GridArea>
      </UpperGrid>
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
          <GridArea $gridAreaTitle="bar-chart">
            <SectionHeader variant="h4" component="h3">
              HuBMAP Datasets
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

export default Home;
