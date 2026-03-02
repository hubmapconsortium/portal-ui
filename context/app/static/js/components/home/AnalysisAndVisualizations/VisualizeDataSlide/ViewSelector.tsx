import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { trackEvent } from 'js/helpers/trackers';
import { ViewConfig } from '../types';
import ParallaxImage from '../ParallaxImage';
import {
  ViewOptionContainer,
  SwipeContainer,
  SwipeTrack,
  SwipePanel,
  PaginationDot,
  ImageArea,
} from './styles';

interface ViewSelectorProps {
  views: ViewConfig[];
  activeIndex: number;
  onViewChange: (index: number) => void;
  isDesktop: boolean;
  progress: number;
  isReducedMotion: boolean;
}

const SWIPE_THRESHOLD = 50;

function DesktopViewSelector({ views, activeIndex, onViewChange }: Omit<ViewSelectorProps, 'isDesktop' | 'progress' | 'isReducedMotion'>) {
  return (
    <Stack spacing={1} role="tablist" aria-label="Visualization tools">
      {views.map((view, index) => {
        const Icon = view.icon;
        const isActive = index === activeIndex;

        return (
          <ViewOptionContainer
            key={view.id}
            $isActive={isActive}
            onMouseEnter={() => onViewChange(index)}
            onClick={() => onViewChange(index)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`visualize-tabpanel-${view.id}`}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                onViewChange((index + 1) % views.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                onViewChange((index - 1 + views.length) % views.length);
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewChange(index);
              }
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Icon color={view.theme} sx={{ fontSize: '1.5rem' }} />
              <Typography variant="subtitle1" component="h4" fontWeight={500}>
                {view.title}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {view.description}
            </Typography>
            <Button
              variant={isActive ? 'contained' : 'outlined'}
              color={view.theme}
              size="small"
              href={view.ctaButton.href}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                trackEvent({
                  category: 'Homepage',
                  action: 'Analysis and Visualizations / visualize-data',
                  label: view.ctaButton.trackingLabel,
                });
              }}
            >
              {view.ctaButton.label}
            </Button>
          </ViewOptionContainer>
        );
      })}
    </Stack>
  );
}

function MobileViewSelector({
  views,
  activeIndex,
  onViewChange,
  progress,
  isReducedMotion,
}: Omit<ViewSelectorProps, 'isDesktop'>) {
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - currentX.current;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Swipe left - next view (wraps to first)
        onViewChange((activeIndex + 1) % views.length);
      } else {
        // Swipe right - previous view (wraps to last)
        onViewChange((activeIndex - 1 + views.length) % views.length);
      }
    }
  };

  return (
    <>
      <SwipeContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="tabpanel"
        aria-label="Visualization tools"
      >
        <SwipeTrack $activeIndex={activeIndex}>
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <SwipePanel key={view.id}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon color={view.theme} sx={{ fontSize: '1.5rem' }} />
                    <Typography variant="subtitle1" component="h4" fontWeight={500}>
                      {view.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {view.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={view.theme}
                    size="small"
                    href={view.ctaButton.href}
                    onClick={() =>
                      trackEvent({
                        category: 'Homepage',
                        action: 'Analysis and Visualizations / visualize-data',
                        label: view.ctaButton.trackingLabel,
                      })
                    }
                  >
                    {view.ctaButton.label}
                  </Button>
                  <ImageArea>
                    {view.images.map((image) => (
                      <ParallaxImage
                        key={image.alt}
                        {...image}
                        progress={progress}
                        isReducedMotion={isReducedMotion}
                      />
                    ))}
                  </ImageArea>
                </Stack>
              </SwipePanel>
            );
          })}
        </SwipeTrack>
      </SwipeContainer>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {views.map((view, index) => (
          <PaginationDot
            key={view.id}
            $isActive={index === activeIndex}
            onClick={() => onViewChange(index)}
            aria-label={`View ${view.title}`}
          />
        ))}
      </Stack>
    </>
  );
}

function ViewSelector(props: ViewSelectorProps) {
  if (props.isDesktop) {
    return <DesktopViewSelector {...props} />;
  }
  return <MobileViewSelector {...props} />;
}

export default ViewSelector;
