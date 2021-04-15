import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import Title from 'js/components/home-revision/Title';
import HuBMAPDescription from 'js/components/home-revision/HuBMAPDescription';
import EntityCounts from 'js/components/home-revision/EntityCounts';

import { GridArea, AboveTheFoldGrid } from './homeRevisionStyle';

function HomeRevision() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      <AboveTheFoldGrid>
        <GridArea maxWidth="lg" gridAreaTitle="title">
          <Title />
        </GridArea>
        <GridArea maxWidth="lg" gridAreaTitle="description">
          <HuBMAPDescription />
        </GridArea>
        <GridArea maxWidth="lg" gridAreaTitle="carousel">
          <ImageCarouselContainer />
        </GridArea>
        <EntityCounts />
      </AboveTheFoldGrid>
      {isLargerThanMd && (
        <Container maxWidth="lg">
          <AssayTypeBarChartContainer />
        </Container>
      )}
    </>
  );
}

export default HomeRevision;
