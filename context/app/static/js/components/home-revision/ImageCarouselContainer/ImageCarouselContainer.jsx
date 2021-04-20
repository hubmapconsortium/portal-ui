import React, { useState } from 'react';

import ImageCarousel from '../ImageCarousel';
import ImageCarouselControlButtons from '../ImageCarouselControlButtons';
import ImageCarouselCallToAction from '../ImageCarouselCallToAction';
import { Flex, CallToActionWrapper } from './style';

function ImageCarouselContainer() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  return (
    <Flex>
      <CallToActionWrapper>
        <ImageCarouselCallToAction selectedImageIndex={selectedImageIndex} />
        <ImageCarouselControlButtons
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          numImages={3}
        />
      </CallToActionWrapper>
      <ImageCarousel selectedImageIndex={selectedImageIndex} setSelectedImageIndex={setSelectedImageIndex} />
    </Flex>
  );
}

export default ImageCarouselContainer;
