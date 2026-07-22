import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { QueryStatsRounded } from '@mui/icons-material';

import { SectionHeader } from 'js/pages/Home/style';
import { useAppContext } from 'js/components/Contexts';
import { useWorkspacesSignUpHref } from 'js/shared-styles/Links/SignUpForWorkspacesLink';
import ParallaxSlide from './ParallaxSlide';
import VisualizeDataSlide from './VisualizeDataSlide';
import { useProminentSlideIndex } from './hooks';
import {
  DATASETS_SEARCH_SLIDE,
  CLOUD_WORKSPACES_SLIDE,
  CLOUD_WORKSPACES_SLIDE_WITH_ACCESS,
  BIOMARKERS_SLIDE,
  VISUALIZE_DATA_SLIDE,
} from './config';

function AnalysisAndVisualizations() {
  const { isWorkspacesUser } = useAppContext();
  const signUpHref = useWorkspacesSignUpHref();

  // Users with workspace access get the variant without the Sign Up button; everyone else
  // gets a Sign Up link with their details prefilled when signed in. Memoized so the
  // memoized slide keeps a stable config identity.
  const workspacesSlide = useMemo(
    () =>
      isWorkspacesUser
        ? CLOUD_WORKSPACES_SLIDE_WITH_ACCESS
        : {
            ...CLOUD_WORKSPACES_SLIDE,
            ctaButtons: CLOUD_WORKSPACES_SLIDE.ctaButtons.map((button) =>
              button.label === 'Sign Up' ? { ...button, href: signUpHref } : button,
            ),
          },
    [isWorkspacesUser, signUpHref],
  );

  // Order drives each slide's zIndex and prominence index. The multi-view Explore slide below is
  // a different component with a different config type, so it stays explicit after the map.
  const parallaxSlides = [DATASETS_SEARCH_SLIDE, workspacesSlide, BIOMARKERS_SLIDE];

  // Only the slide crossing the viewport middle is "prominent" — used to play its video.
  const { prominentIndex, slideRef } = useProminentSlideIndex(parallaxSlides.length + 1);

  return (
    <Box component="section" id="analysis-and-visualizations" aria-label="Analysis and Visualizations">
      {/* Title/description are redundant on mobile where the slides carry their own headings */}
      <Container maxWidth="lg" sx={{ mb: 2, display: { xs: 'none', md: 'block' } }}>
        <SectionHeader variant="h2" component="h3" icon={QueryStatsRounded}>
          Analysis and Visualizations
        </SectionHeader>
        <Typography variant="body1" color="text.secondary">
          See how researchers use HuBMAP&apos;s data and tools to map human organs, cell types, and biomarkers.
        </Typography>
      </Container>

      {/* Parallax scroll container - tall enough for all 3 slides to scroll through */}
      <Box>
        {parallaxSlides.map((config, index) => (
          <ParallaxSlide
            key={config.id}
            config={config}
            zIndex={index + 1}
            isProminent={prominentIndex === index}
            stickyRef={slideRef(index)}
          />
        ))}
        <VisualizeDataSlide
          config={VISUALIZE_DATA_SLIDE}
          zIndex={parallaxSlides.length + 1}
          stickyRef={slideRef(parallaxSlides.length)}
        />
      </Box>
    </Box>
  );
}

export default AnalysisAndVisualizations;
