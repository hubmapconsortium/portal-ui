import React from 'react';
import { useTheme } from '@mui/material/styles';

import { routeContainerMaxWidth, routeContainerPadding } from 'js/components/Routes/Route/style';
import { callToActionMdOrLargerWidth } from 'js/components/home/ImageCarouselContainer/style';
import { StyledImage } from './style';
import { getCarouselImageSrcSet } from './utils';

// Responsive images: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
// Setting height and width: https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/
// 1392 was the max resolution provided by the designer.

interface CarouselImageProps {
  imageKey: string;
  alt: string;
}

const constructSrcSet = (key: string, fileType: string) => getCarouselImageSrcSet(key, CDN_URL, fileType);

function CarouselImage({ imageKey, alt }: CarouselImageProps) {
  const theme = useTheme();
  const mdBreakpoint = theme.breakpoints.values.md;

  const maxImageWidth = routeContainerMaxWidth - callToActionMdOrLargerWidth;
  const maxImageHeight = (maxImageWidth * 9) / 16; // 16:9 aspect ratio

  const sizes = `(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${callToActionMdOrLargerWidth}px - ${routeContainerPadding}px))`;

  const pngSrcSet = constructSrcSet(imageKey, 'png');
  const webpSrcSet = constructSrcSet(imageKey, 'webp');

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <StyledImage srcSet={pngSrcSet} sizes={sizes} width={maxImageWidth} height={maxImageHeight} alt={alt} />
    </picture>
  );
}

export default CarouselImage;
