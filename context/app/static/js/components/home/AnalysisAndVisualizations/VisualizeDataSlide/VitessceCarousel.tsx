import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import useEmblaCarousel from 'embla-carousel-react';

import { trackEvent } from 'js/helpers/trackers';
import { CarouselItem } from '../types';
import {
  CarouselRoot,
  MainImageWrapper,
  MainImage,
  ViewVizButton,
  CarouselViewport,
  CarouselContainer,
  ThumbSlide,
  ThumbButton,
  ThumbImage,
  ThumbCaption,
  CarouselButton,
} from './styles';

interface VitessceCarouselProps {
  items: CarouselItem[];
}

// Example Vitessce visualizations for the single-cell view: a large selected image
// (linking to the original visualization) above a scrollable strip of assay/analyte
// thumbnail previews. Selecting a thumbnail (or the arrows) changes the main image.
function VitessceCarousel({ items }: VitessceCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // `loop` wraps the preview strip so the first item reappears after the last (and vice versa).
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, loop: true });

  const selected = items[selectedIndex];

  const select = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const selectPrev = useCallback(
    () => select((selectedIndex - 1 + items.length) % items.length),
    [select, selectedIndex, items.length],
  );
  const selectNext = useCallback(
    () => select((selectedIndex + 1) % items.length),
    [select, selectedIndex, items.length],
  );

  return (
    <CarouselRoot>
      <MainImageWrapper>
        <MainImage src={selected.src} alt={selected.alt} />
        <CarouselButton $side="left" size="small" onClick={selectPrev} aria-label="Previous visualization">
          <ChevronLeftRounded />
        </CarouselButton>
        <CarouselButton $side="right" size="small" onClick={selectNext} aria-label="Next visualization">
          <ChevronRightRounded />
        </CarouselButton>
        <ViewVizButton
          href={selected.href}
          size="small"
          onClick={() =>
            trackEvent({
              category: 'Homepage',
              action: 'Analysis and Visualizations / visualize-data',
              label: `Visualize / Carousel / ${selected.assay}`,
            })
          }
        >
          View {selected.assay} Visualization
        </ViewVizButton>
      </MainImageWrapper>

      <CarouselViewport ref={emblaRef}>
        <CarouselContainer>
          {items.map((item, index) => (
            <ThumbSlide key={item.src}>
              <ThumbButton
                type="button"
                $isActive={index === selectedIndex}
                onClick={() => select(index)}
                aria-label={`Show ${item.assay} visualization`}
                aria-pressed={index === selectedIndex}
              >
                <ThumbImage src={item.src} alt="" />
                <ThumbCaption>
                  <Typography variant="caption" fontWeight={600} noWrap>
                    {item.assay}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {item.analyte}
                  </Typography>
                </ThumbCaption>
              </ThumbButton>
            </ThumbSlide>
          ))}
        </CarouselContainer>
      </CarouselViewport>
    </CarouselRoot>
  );
}

export default VitessceCarousel;
