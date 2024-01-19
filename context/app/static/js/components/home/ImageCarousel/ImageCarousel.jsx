import React, { useCallback } from 'react';
import Carousel from 'nuka-carousel';

function ImageCarousel({ autoplay, setAutoplay, selectedImageIndex, setSelectedImageIndex, images }) {
  const stopAutoplay = useCallback(() => setAutoplay(false), [setAutoplay]);
  return (
    <Carousel
      autoplay={autoplay}
      autoplayInterval={6000}
      disableAnimation
      slideIndex={selectedImageIndex}
      withoutControls
      swiping={false}
      dragging={false}
      wrapAround
      enableKeyboardControls
      // for key initiated change
      afterSlide={(slideIndex) => {
        if (selectedImageIndex !== slideIndex) {
          setSelectedImageIndex(slideIndex);
        }
      }}
      onUserNavigation={stopAutoplay}
    >
      {images}
    </Carousel>
  );
}

export default ImageCarousel;
