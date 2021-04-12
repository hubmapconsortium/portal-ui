import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import Title from 'js/components/home-revision/Title';
import HuBMAPDescription from 'js/components/home-revision/HuBMAPDescription';

import { GridArea, AboveTheFoldGrid } from './homeRevisionStyle';

function HomeRevision() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      <AboveTheFoldGrid maxWidth="lg">
        <GridArea gridAreaTitle="title">
          <Title />
        </GridArea>
        <GridArea gridAreaTitle="description">
          <HuBMAPDescription />
        </GridArea>
        <GridArea gridAreaTitle="carousel">
          <ImageCarouselContainer />
        </GridArea>
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
