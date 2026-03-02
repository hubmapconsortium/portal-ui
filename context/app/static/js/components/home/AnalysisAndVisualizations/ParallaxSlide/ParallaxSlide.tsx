import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { trackEvent } from 'js/helpers/trackers';
import { useScrollProgress, usePrefersReducedMotion } from '../hooks';
import { SlideConfig } from '../types';
import ParallaxImage from '../ParallaxImage';
import { ScrollRunway, StickySlideContent, GradientBackground, SlideGrid, TextContent, ImageGroup } from './styles';

interface ParallaxSlideProps {
  config: SlideConfig;
  zIndex: number;
}

function ParallaxSlide({ config, zIndex }: ParallaxSlideProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(runwayRef);
  const isReducedMotion = usePrefersReducedMotion();

  const { theme, icon: Icon, title, description, bulletPoints, ctaButtons, images, layout } = config;

  return (
    <ScrollRunway ref={runwayRef} $zIndex={zIndex}>
      <StickySlideContent role="region" aria-label={title}>
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
              <Stack component="ul" spacing={0.5} sx={{ pl: 2.5, mb: 2, listStyleType: 'disc' }}>
                {bulletPoints.map((point) => (
                  <Typography component="li" variant="body2" key={point} sx={{ display: 'list-item' }}>
                    {point}
                  </Typography>
                ))}
              </Stack>
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
              <ParallaxImage key={image.alt} {...image} progress={progress} isReducedMotion={isReducedMotion} />
            ))}
          </ImageGroup>
        </SlideGrid>
      </StickySlideContent>
    </ScrollRunway>
  );
}

export default ParallaxSlide;
