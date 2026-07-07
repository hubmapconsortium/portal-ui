import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { trackEvent } from 'js/helpers/trackers';
import { usePrefersReducedMotion } from '../hooks';
import { SlideConfig } from '../types';
import ParallaxImage from '../ParallaxImage';
import { ScrollRunway, StickySlideContent, GradientBackground, SlideGrid, TextContent, ImageGroup } from './styles';

interface ParallaxSlideProps {
  config: SlideConfig;
  zIndex: number;
  /** Whether this slide is the prominent one in view (gates video playback). */
  isProminent?: boolean;
  /** Ref to the sticky content, used to track slide prominence. */
  stickyRef?: (el: HTMLElement | null) => void;
}

function ParallaxSlide({ config, zIndex, isProminent = true, stickyRef }: ParallaxSlideProps) {
  const isReducedMotion = usePrefersReducedMotion();

  const { theme, icon: Icon, title, description, bulletPoints, ctaButtons, images, layout } = config;

  return (
    <ScrollRunway $zIndex={zIndex}>
      <StickySlideContent ref={stickyRef} role="region" aria-label={title}>
        <GradientBackground $theme={theme} />
        <SlideGrid $layout={layout}>
          <TextContent>
            <Icon color={theme} sx={{ fontSize: '2.5rem', mb: 1 }} />
            <Typography variant="h4" component="h3" gutterBottom fontWeight={400}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {description}
            </Typography>
            {bulletPoints && (
              // list-style is set on each <li> (a class selector) to override the global
              // `li { list-style: none }` reset in components/globalStyles.tsx.
              <Box component="ul" sx={{ m: 0, mb: 2, pl: 2.5 }}>
                {bulletPoints.map((point) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={point}
                    sx={{ display: 'list-item', listStyleType: 'disc', mb: 0.5 }}
                  >
                    {point}
                  </Typography>
                ))}
              </Box>
            )}
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              {ctaButtons.map((button) => (
                <Button
                  key={button.label}
                  variant={button.variant}
                  color={theme}
                  href={button.href}
                  onClick={() =>
                    trackEvent({
                      category: 'Homepage',
                      action: `Analysis and Visualizations / ${config.id}`,
                      label: button.trackingLabel,
                    })
                  }
                >
                  {button.label}
                </Button>
              ))}
            </Stack>
          </TextContent>
          <ImageGroup $layout={layout}>
            {images.map((image) => (
              <ParallaxImage key={image.alt} {...image} isReducedMotion={isReducedMotion} isProminent={isProminent} />
            ))}
          </ImageGroup>
        </SlideGrid>
      </StickySlideContent>
    </ScrollRunway>
  );
}

export default ParallaxSlide;
