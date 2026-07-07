import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSpring } from '@react-spring/web';

import { useScrollProgress, usePrefersReducedMotion } from '../hooks';
import { MultiViewSlideConfig } from '../types';
import { accentColorMap } from '../ParallaxSlide/styles';
import ParallaxImage from '../ParallaxImage';
import ViewSelector from './ViewSelector';
import VitessceCarousel from './VitessceCarousel';
import {
  VisualizeScrollRunway,
  VisualizeSlideContent,
  AnimatedGradientLayer,
  SlideContentGrid,
  ImageArea,
} from './styles';

interface VisualizeDataSlideProps {
  config: MultiViewSlideConfig;
  zIndex: number;
}

function VisualizeDataSlide({ config, zIndex }: VisualizeDataSlideProps) {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const progress = useScrollProgress(runwayRef);
  const isReducedMotion = usePrefersReducedMotion();

  const activeView = config.views[activeViewIndex];
  const accentKey = accentColorMap[activeView.theme] as keyof typeof theme.palette.accent;
  const targetColor = theme.palette.accent[accentKey];

  const Icon = config.icon;

  // Animate background gradient between view accent colors
  const backgroundSpring = useSpring({
    background: `linear-gradient(135deg, ${targetColor} 0%, ${theme.palette.common.white} 100%)`,
    config: { duration: 400 },
  });

  return (
    <VisualizeScrollRunway ref={runwayRef} sx={{ zIndex }}>
      <VisualizeSlideContent role="region" aria-label={config.sectionTitle}>
        <AnimatedGradientLayer style={backgroundSpring} />

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
            progress={progress}
            isReducedMotion={isReducedMotion}
          />

          {/* Desktop media area — a carousel for the single-cell view, otherwise the view's media */}
          {isDesktop &&
            (activeView.carousel ? (
              <Box
                role="tabpanel"
                id={`visualize-tabpanel-${activeView.id}`}
                aria-label={`${activeView.title} visualizations`}
                // Match ImageArea's height so this view's slide is the same height as the
                // others and the section title above doesn't shift when it becomes active.
                sx={{ display: 'flex', alignItems: 'center', minHeight: { md: 400 } }}
              >
                <VitessceCarousel items={activeView.carousel} />
              </Box>
            ) : (
              <ImageArea
                role="tabpanel"
                id={`visualize-tabpanel-${activeView.id}`}
                aria-label={`${activeView.title} media`}
              >
                {activeView.images.map((image) => (
                  <ParallaxImage
                    key={`${activeView.id}-${image.alt}`}
                    {...image}
                    progress={progress}
                    isReducedMotion={isReducedMotion}
                  />
                ))}
              </ImageArea>
            ))}
        </SlideContentGrid>
      </VisualizeSlideContent>
    </VisualizeScrollRunway>
  );
}

export default VisualizeDataSlide;
