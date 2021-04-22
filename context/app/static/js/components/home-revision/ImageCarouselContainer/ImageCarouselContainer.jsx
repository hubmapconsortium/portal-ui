import React, { useState } from 'react';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';

const numImages = 3;

function ImageCarouselContainer() {
  // set random intial image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(Math.floor(Math.random() * numImages));
  return (
    <Flex>
      <CallToActionWrapper>
        <ImageCarouselCallToAction selectedImageIndex={selectedImageIndex} />
        <ImageCarouselControlButtons
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          numImages={numImages}
        />
      </CallToActionWrapper>
      <ImageCarousel selectedImageIndex={selectedImageIndex} setSelectedImageIndex={setSelectedImageIndex} />
    </Flex>
  );
}

export default ImageCarouselContainer;
