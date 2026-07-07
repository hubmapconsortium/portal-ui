import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { QueryStatsRounded } from '@mui/icons-material';

import { SectionHeader } from 'js/pages/Home/style';
import ParallaxSlide from './ParallaxSlide';
import VisualizeDataSlide from './VisualizeDataSlide';
import { useProminentSlideIndex } from './hooks';
import { CLOUD_WORKSPACES_SLIDE, BIOMARKERS_SLIDE, VISUALIZE_DATA_SLIDE } from './config';

function AnalysisAndVisualizations() {
  // Only the slide crossing the viewport middle is "prominent" — used to play its video.
  const { prominentIndex, slideRef } = useProminentSlideIndex(3);

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
        <ParallaxSlide
          config={CLOUD_WORKSPACES_SLIDE}
          zIndex={1}
          isProminent={prominentIndex === 0}
          stickyRef={slideRef(0)}
        />
        <ParallaxSlide
          config={BIOMARKERS_SLIDE}
          zIndex={2}
          isProminent={prominentIndex === 1}
          stickyRef={slideRef(1)}
        />
        <VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={3} stickyRef={slideRef(2)} />
      </Box>
    </Box>
  );
}

export default AnalysisAndVisualizations;
