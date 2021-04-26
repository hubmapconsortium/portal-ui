import React from 'react';
import Carousel from 'nuka-carousel';

function ImageCarousel({ selectedImageIndex, setSelectedImageIndex, images }) {
  return (
    <Carousel
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
    >
      {images}
    </Carousel>
  );
}

export default ImageCarousel;
