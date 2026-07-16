import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSpring } from '@react-spring/web';

import { usePrefersReducedMotion } from '../hooks';
import { MultiViewSlideConfig } from '../types';
import { accentColorMap } from '../ParallaxSlide/styles';
import ViewSelector from './ViewSelector';
import VitessceCarousel from './VitessceCarousel';
import ViewMedia from './ViewMedia';
import { VisualizeScrollRunway, VisualizeSlideContent, AnimatedGradientLayer, SlideContentGrid } from './styles';

interface VisualizeDataSlideProps {
  config: MultiViewSlideConfig;
  zIndex: number;
  /** Ref to the sticky content, used to track slide prominence. */
  stickyRef?: (el: HTMLElement | null) => void;
}

function VisualizeDataSlide({ config, zIndex, stickyRef }: VisualizeDataSlideProps) {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isReducedMotion = usePrefersReducedMotion();

  const activeView = config.views[activeViewIndex];
  const targetColor = accentColorMap[activeView.theme];

  const Icon = config.icon;

  // Animate the accent color between views and build the gradient from it. react-spring
  // interpolates a color reliably but not a full `linear-gradient(...)` string, so we
  // animate the color and compose the gradient via `.to()`.
  const { color } = useSpring({ color: targetColor, config: { duration: 400 } });

  return (
    <VisualizeScrollRunway sx={{ zIndex }}>
      <VisualizeSlideContent ref={stickyRef} role="region" aria-label={config.sectionTitle}>
        <AnimatedGradientLayer
          style={{
            background: color.to((c) => `linear-gradient(135deg, ${c} 0%, ${theme.palette.common.white} 100%)`),
          }}
        />

        {/* Section title and description centered */}
        <Typography variant="h4" component="h3" align="center" gutterBottom fontWeight={400} sx={{ mb: 0.5 }}>
          <Icon color={activeView.theme} />
          {config.sectionTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          {config.sectionDescription}
        </Typography>

        <SlideContentGrid>
          <ViewSelector
            views={config.views}
            activeIndex={activeViewIndex}
            onViewChange={setActiveViewIndex}
            isDesktop={isDesktop}
            isReducedMotion={isReducedMotion}
          />

          {/* Desktop media area — a carousel for the single-cell view, otherwise the view's media.
              Fixed min-height keeps every view's slide the same height so the section title
              above doesn't shift when the active view changes. */}
          {isDesktop && (
            <Box
              role="tabpanel"
              id={`visualize-tabpanel-${activeView.id}`}
              aria-label={`${activeView.title} media`}
              sx={{ display: 'flex', alignItems: 'center', minHeight: { md: 400 } }}
            >
              {activeView.carousel ? (
                <VitessceCarousel items={activeView.carousel} />
              ) : (
                <ViewMedia view={activeView} isReducedMotion={isReducedMotion} />
              )}
            </Box>
          )}
        </SlideContentGrid>
      </VisualizeSlideContent>
    </VisualizeScrollRunway>
  );
}

// Memoized so prominence flips in the parent don't re-render the heavy carousel tree
// (all props are stable — this slide doesn't take isProminent).
export default React.memo(VisualizeDataSlide);
