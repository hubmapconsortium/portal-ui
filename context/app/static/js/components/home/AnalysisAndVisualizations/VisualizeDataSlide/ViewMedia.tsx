import React from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { ViewConfig } from '../types';
import ParallaxImage from '../ParallaxImage';
import { ViewMediaWrapper, ViewVizButton } from './styles';

interface ViewMediaProps {
  view: ViewConfig;
  isReducedMotion: boolean;
}

// A non-carousel view's image/webm, with an optional CTA button overlaid on its
// bottom-right (mirrors the carousel's "View … Visualization" link).
function ViewMedia({ view, isReducedMotion }: ViewMediaProps) {
  const { imageCta } = view;

  return (
    <ViewMediaWrapper>
      {view.images.map((image) => (
        <ParallaxImage key={image.alt} {...image} isReducedMotion={isReducedMotion} />
      ))}
      {imageCta && (
        <ViewVizButton
          href={imageCta.href}
          size="small"
          onClick={() =>
            trackEvent({
              category: 'Homepage',
              action: 'Analysis and Visualizations / visualize-data',
              label: imageCta.trackingLabel,
            })
          }
        >
          {imageCta.label}
        </ViewVizButton>
      )}
    </ViewMediaWrapper>
  );
}

export default ViewMedia;
