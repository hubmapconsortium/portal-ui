import React from 'react';

import AssayTypeBarChartContainer from 'js/components/home-revision/AssayTypeBarChartContainer';
import ImageCarouselContainer from 'js/components/home-revision/ImageCarouselContainer';
import { AboveTheFoldWrapper } from './style';

function HomeRevision() {
  return (
    <>
      <AboveTheFoldWrapper maxWidth="lg">
        <ImageCarouselContainer />
      </AboveTheFoldWrapper>
      <AssayTypeBarChartContainer />
    </>
  );
}

export default HomeRevision;
