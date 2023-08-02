import React from 'react';
import { useTheme } from '@mui/material/styles';

import { routeContainerMaxWidth, routeContainerPadding } from 'js/components/Routes/Route/style';
import { callToActionMdOrLargerWidth } from 'js/components/home/ImageCarouselContainer/style';
import { StyledImage } from './style';

// Responsive images: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
// Setting height and width: https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/
// 1392 was the max resolution provided by the designer.

function Carouselmage({ src320w, src640w, src1280w, src1392w, alt }) {
  const theme = useTheme();
  const mdBreakpoint = theme.breakpoints.values.md;

  const maxImageWidth = routeContainerMaxWidth - callToActionMdOrLargerWidth;
  const maxImageHeight = (maxImageWidth * 9) / 16; // 16:9 aspect ratio

  return (
    <StyledImage
      srcSet={`${src320w} 320w, ${src640w} 640w,
        ${src1280w} 1280w,
        ${src1392w} 1392w`}
      sizes={`(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${callToActionMdOrLargerWidth}px - ${routeContainerPadding}px))`}
      width={maxImageWidth}
      height={maxImageHeight}
      alt={alt}
    />
  );
}

export default Carouselmage;
