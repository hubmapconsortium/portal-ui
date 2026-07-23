import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { trackEvent } from 'js/helpers/trackers';
import { ViewConfig } from '../types';
import VitessceCarousel from './VitessceCarousel';
import ViewMedia from './ViewMedia';
import { ViewOptionContainer, SwipeContainer, SwipeTrack, SwipePanel, PaginationDot } from './styles';

interface ViewSelectorProps {
  views: ViewConfig[];
  activeIndex: number;
  onViewChange: (index: number) => void;
  isDesktop: boolean;
  isReducedMotion: boolean;
}

const SWIPE_THRESHOLD = 50;

// Tracks deliberate view switches (click, keyboard, swipe, pagination dots). Hover also
// switches views on desktop but is intentionally untracked to avoid flooding analytics.
function trackViewSelect(view: ViewConfig) {
  trackEvent({
    category: 'Homepage',
    action: 'Analysis and Visualizations / Visualize',
    label: `Select View / ${view.title}`,
  });
}

function DesktopViewSelector({
  views,
  activeIndex,
  onViewChange,
}: Omit<ViewSelectorProps, 'isDesktop' | 'isReducedMotion'>) {
  return (
    <Stack spacing={1} divider={<Divider />} role="tablist" aria-label="Visualization tools">
      {views.map((view, index) => {
        const Icon = view.icon;
        const isActive = index === activeIndex;

        return (
          <ViewOptionContainer
            key={view.id}
            onMouseEnter={() => onViewChange(index)}
            onClick={() => {
              trackViewSelect(view);
              onViewChange(index);
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`visualize-tabpanel-${view.id}`}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e: React.KeyboardEvent) => {
              let nextIndex: number | null = null;
              if (e.key === 'ArrowDown') nextIndex = (index + 1) % views.length;
              else if (e.key === 'ArrowUp') nextIndex = (index - 1 + views.length) % views.length;
              else if (e.key === 'Enter' || e.key === ' ') nextIndex = index;

              if (nextIndex === null) return;
              e.preventDefault();
              trackViewSelect(views[nextIndex]);
              onViewChange(nextIndex);
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
              // Outlined (inactive) buttons use primary for legibility — themed outline colors
              // (e.g. warning/success) don't meet contrast against the light gradient.
              color={isActive ? view.theme : 'primary'}
              size="small"
              href={view.ctaButton.href}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                trackEvent({
                  category: 'Homepage',
                  action: 'Analysis and Visualizations / Visualize',
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
      // Swipe left - next view (wraps to first); swipe right - previous view (wraps to last)
      const nextIndex = diff > 0 ? (activeIndex + 1) % views.length : (activeIndex - 1 + views.length) % views.length;
      trackViewSelect(views[nextIndex]);
      onViewChange(nextIndex);
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
                        action: 'Analysis and Visualizations / Visualize',
                        label: view.ctaButton.trackingLabel,
                      })
                    }
                  >
                    {view.ctaButton.label}
                  </Button>
                  {view.carousel ? (
                    <VitessceCarousel items={view.carousel} />
                  ) : (
                    <ViewMedia view={view} isReducedMotion={isReducedMotion} />
                  )}
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
            onClick={() => {
              trackViewSelect(view);
              onViewChange(index);
            }}
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
