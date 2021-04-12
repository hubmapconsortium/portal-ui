import React from 'react';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import Title from 'js/components/home-revision/Title';
import HuBMAPDescription from 'js/components/home-revision/HuBMAPDescription';

import { GridArea, AboveTheFoldGrid } from './homeRevisionStyle';

function HomeRevision() {
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
      <AssayTypeBarChartContainer />
    </>
  );
}

export default HomeRevision;
