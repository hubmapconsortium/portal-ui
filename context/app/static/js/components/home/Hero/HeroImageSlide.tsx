import React from 'react';
import { routeContainerMaxWidth, routeContainerPadding } from 'js/components/Routes/Route/style';
import { useTheme } from '@mui/material/styles';
import { useIsDesktop } from 'js/hooks/media-queries';
import { HeroPanelContainer, StyledImage } from './styles';
import { useHeroTabContext } from './HeroTabsContext';
import { HERO_IMAGE_SLIDES, isSlideTitle } from './const';
import { constructSrcSet } from './utils';

interface HeroImageSlideProps {
  title: string;
  index: number;
}

export function HeroImageSlide({ index, title }: HeroImageSlideProps) {
  const { activeTab } = useHeroTabContext();
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  if (!isSlideTitle(title)) {
    throw new Error(`Invalid title provided to homepage image slide: ${title}`);
  }

  const { imageBase, imageAlt } = HERO_IMAGE_SLIDES[title];
  const maxImageWidth = isDesktop ? routeContainerMaxWidth : window.innerWidth - routeContainerPadding;
  const maxImageHeight = (maxImageWidth * 9) / 32;
  const mdBreakpoint = theme.breakpoints.values.md;
  const sizes = `(max-width: ${mdBreakpoint}px) calc(100vw - ${routeContainerPadding}px), max(${maxImageWidth}px, calc(100vw - ${routeContainerPadding}px))`;

  const pngSrcSet = constructSrcSet(imageBase, 'png');
  const webpSrcSet = constructSrcSet(imageBase, 'webp');

  return (
    <HeroPanelContainer
      $index={index}
      $activeSlide={activeTab}
      $isImage
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      <picture>
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <StyledImage srcSet={pngSrcSet} sizes={sizes} width={maxImageWidth} height={maxImageHeight} alt={imageAlt} />
      </picture>
    </HeroPanelContainer>
  );
}
