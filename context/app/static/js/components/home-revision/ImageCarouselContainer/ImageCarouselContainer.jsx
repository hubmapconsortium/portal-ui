import React, { useState } from 'react';

import CarouselImage from 'js/components/home-revision/CarouselImage';
import VitessceSlide320w from 'portal-images/vitessce-slide-320w.png';
import VitessceSlide640w from 'portal-images/vitessce-slide-640w.png';
import VitessceSlide1280w from 'portal-images/vitessce-slide-1280w.png';
import VitessceSlide1392w from 'portal-images/vitessce-slide-1392w.png';
import AzimuthSlide320w from 'portal-images/azimuth-slide-320w.png';
import AzimuthSlide640w from 'portal-images/azimuth-slide-640w.png';
import AzimuthSlide1280w from 'portal-images/azimuth-slide-1280w.png';
import AzimuthSlide1392w from 'portal-images/azimuth-slide-1392w.png';
import CCFSlide320w from 'portal-images/ccf-slide-320w.png';
import CCFSlide640w from 'portal-images/ccf-slide-640w.png';
import CCFSlide1280w from 'portal-images/ccf-slide-1280w.png';
import CCFSlide1392w from 'portal-images/ccf-slide-1392w.png';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';

function ImageCarouselContainer() {
  const images = [
    <CarouselImage
      src320w={VitessceSlide320w}
      src640w={VitessceSlide640w}
      src1280w={VitessceSlide1280w}
      src1392w={VitessceSlide1392w}
      alt="Vitessce"
    />,
    <CarouselImage
      src320w={CCFSlide320w}
      src640w={CCFSlide640w}
      src1280w={CCFSlide1280w}
      src1392w={CCFSlide1392w}
      alt="CCF Portal"
    />,
    <CarouselImage
      src320w={AzimuthSlide320w}
      src640w={AzimuthSlide640w}
      src1280w={AzimuthSlide1280w}
      src1392w={AzimuthSlide1392w}
      alt="Azimuth"
    />,
  ];
  // set random intial image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * images.length));
  return (
    <Flex>
      <CallToActionWrapper>
        <ImageCarouselCallToAction selectedImageIndex={selectedImageIndex} />
        <ImageCarouselControlButtons
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          numImages={images.length}
        />
      </CallToActionWrapper>
      <ImageCarousel
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        images={images}
      />
    </Flex>
  );
}

export default ImageCarouselContainer;
