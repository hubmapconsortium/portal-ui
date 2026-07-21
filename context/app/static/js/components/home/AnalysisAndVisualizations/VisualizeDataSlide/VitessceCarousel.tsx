import React, { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
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

// Visually-hidden style for the live-region status (mirrors MUI's `visuallyHidden`).
const srOnly = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;

// Example Vitessce visualizations for the single-cell view: a large selected image
// (linking to the original visualization) above a scrollable strip of assay/analyte
// thumbnail previews. Selecting a thumbnail (or the arrows) changes the main image.
function VitessceCarousel({ items }: VitessceCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // `loop` wraps the preview strip so the first item reappears after the last (and vice versa).
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, loop: true });
  // Refs to the thumbnail buttons so arrow-key navigation can move focus (roving tabindex).
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Arrow keys move between thumbnails (Home/End jump to the ends), moving focus and
  // selection together so the main image follows.
  const handleThumbKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const lastIndex = items.length - 1;
      let nextIndex: number | null = null;
      if (e.key === 'ArrowRight') nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;
      else if (e.key === 'ArrowLeft') nextIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
      else if (e.key === 'Home') nextIndex = 0;
      else if (e.key === 'End') nextIndex = lastIndex;

      if (nextIndex === null) return;
      e.preventDefault();
      select(nextIndex);
      thumbRefs.current[nextIndex]?.focus();
    },
    [items.length, selectedIndex, select],
  );

  return (
    <CarouselRoot role="group" aria-roledescription="carousel" aria-label="Example Vitessce visualizations">
      <MainImageWrapper
        role="group"
        aria-roledescription="slide"
        aria-label={`${selectedIndex + 1} of ${items.length}`}
      >
        <MainImage src={selected.src} alt={selected.alt} loading="lazy" decoding="async" />
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

      {/* Announce slide changes — including via the arrows, which don't move focus. */}
      <Box sx={srOnly} role="status">
        {`Showing ${selectedIndex + 1} of ${items.length}: ${selected.assay}, ${selected.analyte}`}
      </Box>

      <CarouselViewport ref={emblaRef}>
        <CarouselContainer role="group" aria-label="Select a visualization to view" onKeyDown={handleThumbKeyDown}>
          {items.map((item, index) => (
            <ThumbSlide key={item.src}>
              <ThumbButton
                type="button"
                ref={(el: HTMLButtonElement | null) => {
                  thumbRefs.current[index] = el;
                }}
                tabIndex={index === selectedIndex ? 0 : -1}
                $isActive={index === selectedIndex}
                onClick={() => select(index)}
                aria-label={`${item.assay}, ${item.analyte}, ${index + 1} of ${items.length}`}
                aria-pressed={index === selectedIndex}
              >
                <ThumbImage src={item.src} alt="" $isActive={index === selectedIndex} loading="lazy" decoding="async" />
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
