import React from 'react';

import CarouselButton from 'js/components/home-revision/CarouselButton';
import { StyledTypography } from './style';

function ImageCarouselCallToAction({ title, body, buttonHref }) {
  return (
    <div>
      <StyledTypography variant="h3">{title}</StyledTypography>
      <StyledTypography variant="h6" component="p">
        {body}
      </StyledTypography>
      <CarouselButton href={buttonHref} />
    </div>
  );
}

export default ImageCarouselCallToAction;
