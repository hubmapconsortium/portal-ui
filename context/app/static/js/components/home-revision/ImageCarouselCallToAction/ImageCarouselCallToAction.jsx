import React from 'react';

import ImageCarouselButton from 'js/components/home-revision/ImageCarouselButton';
import { StyledTypography } from './style';

function ImageCarouselCallToAction({ title, body, buttonHref }) {
  return (
    <div>
      <StyledTypography variant="h3">{title}</StyledTypography>
      <StyledTypography variant="h6" component="p">
        {body}
      </StyledTypography>
      <ImageCarouselButton href={buttonHref} />
    </div>
  );
}

export default ImageCarouselCallToAction;
