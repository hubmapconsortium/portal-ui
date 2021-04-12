import React from 'react';
import Carousel from 'nuka-carousel';
import { useTheme } from '@material-ui/core/styles';

import VitessceSlide640w from 'images/vitessce-slide-640w.png';
import VitessceSlide800w from 'images/vitessce-slide-800w.png';
import VitessceSlide1024w from 'images/vitessce-slide-1024w.png';
import VitessceSlide1280w from 'images/vitessce-slide-1280w.png';
import VitessceSlide1392w from 'images/vitessce-slide-1392w.png';
import AzimuthSlide640w from 'images/azimuth-slide-640w.png';
import AzimuthSlide800w from 'images/azimuth-slide-800w.png';
import AzimuthSlide1024w from 'images/azimuth-slide-1024w.png';
import AzimuthSlide1280w from 'images/azimuth-slide-1280w.png';
import AzimuthSlide1392w from 'images/azimuth-slide-1392w.png';
import CCFSlide640w from 'images/ccf-slide-640w.png';
import CCFSlide800w from 'images/ccf-slide-800w.png';
import CCFSlide1024w from 'images/ccf-slide-1024w.png';
import CCFSlide1280w from 'images/ccf-slide-1280w.png';
import CCFSlide1392w from 'images/ccf-slide-1392w.png';
import { routeContainerMaxWidth, routeContainerPadding } from 'js/components/Routes/Route/style';
import { callToActionMdOrLargerWidth } from 'js/components/home-revision/ImageCarouselContainer/style';
import { StyledImage } from './style';

// Responsive images: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
// Setting height and width: https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/

function ImageCarousel({ selectedImageIndex }) {
  const theme = useTheme();
  const mdBreakpoint = theme.breakpoints.values.md;

  const maxImageWidth = routeContainerMaxWidth - callToActionMdOrLargerWidth;
  // 16:9 aspect ratio
  const maxImageHeight = (maxImageWidth * 9) / 16;

  return (
    <Carousel
      disableAnimation
      slideIndex={selectedImageIndex}
      withoutControls
      swiping={false}
      dragging={false}
      enableKeyboardControls
      wrapAround
    >
      <StyledImage
        srcSet={`${VitessceSlide640w} 640w,
          ${VitessceSlide800w} 800w,${VitessceSlide1024w} 1024w,
        ${VitessceSlide1280w} 1280w,
        ${VitessceSlide1392w} 1392w`}
        sizes={`(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${callToActionMdOrLargerWidth}px - ${routeContainerPadding}px))`}
        width={maxImageWidth}
        height={maxImageHeight}
        alt="CCF Portal"
      />
      <StyledImage
        srcSet={`${AzimuthSlide640w} 640w,
          ${AzimuthSlide800w} 800w,${AzimuthSlide1024w} 1024w,
        ${AzimuthSlide1280w} 1280w,
        ${AzimuthSlide1392w} 1392w`}
        sizes={`(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${callToActionMdOrLargerWidth}px - ${routeContainerPadding}px))`}
        width={maxImageWidth}
        height={maxImageHeight}
        alt="Azimuth Tool"
      />

      <StyledImage
        srcSet={`${CCFSlide640w} 640w,
          ${CCFSlide800w} 800w,${CCFSlide1024w} 1024w,
        ${CCFSlide1280w} 1280w,
        ${CCFSlide1392w} 1392w`}
        sizes={`(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${callToActionMdOrLargerWidth}px - ${routeContainerPadding}px))`}
        width={maxImageWidth}
        height={maxImageHeight}
        alt="CCF Portal"
      />
    </Carousel>
  );
}

export default ImageCarousel;
