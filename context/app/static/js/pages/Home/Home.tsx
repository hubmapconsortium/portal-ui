import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import ResearchPoweredByHuBMAP from 'js/components/home/ResearchPoweredByHuBMAP';
import AnalysisAndVisualizations from 'js/components/home/AnalysisAndVisualizations';
import Testimonials from 'js/components/home/Testimonials';
import { useDownloadImage } from 'js/hooks/useDownloadImage';
import { trackEvent } from 'js/helpers/trackers';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';

import EntityCounts from 'js/components/home/EntityCounts';
import Hero from 'js/components/home/Hero';
import { UpperLowerGrid, BottomLowerGrid, ParallaxCover } from './style';
import { BiotechRounded, BuildRounded, StarRounded, PrivacyTipRounded } from '@mui/icons-material';
import RelatedToolsAndResources from 'js/components/home/RelatedToolsAndResources';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import HomepageSection from 'js/components/home/HomepageSection';
import { InternalLink } from 'js/shared-styles/Links';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Home() {
  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));

  const scrollToBarChart = useCallback((node: HTMLElement | null) => {
    if (node !== null && document.location.hash === '#hubmap-datasets') {
      node.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  const chartRef = useRef<HTMLDivElement>(null);
  const [selectionLabel, setSelectionLabel] = useState('Dataset vs Assay Type');

  const chartName = `HuBMAP Datasets - ${selectionLabel} - ${new Date().toISOString().slice(0, 10)}`;
  const downloadPNG = useDownloadImage(chartRef, chartName);

  const handleDownload = useCallback(() => {
    downloadPNG();
    trackEvent({
      category: 'Homepage',
      // "HubMAP" (lowercase b) matches the graph's other events (see ChartDropdown's
      // default action) and the analytics tracking sheet.
      action: 'HubMAP Datasets Graph/Download Datasets Graph',
      label: selectionLabel,
    });
  }, [downloadPNG, selectionLabel]);

  return (
    <>
      <Hero />
      <Box gridArea="counts">
        <EntityCounts />
      </Box>
      {isLargerThanMd && (
        <UpperLowerGrid maxWidth="lg">
          <HomepageSection
            title="HuBMAP Datasets"
            icon={entityIconMap.Dataset}
            gridArea="bar-chart"
            useOffset
            id="hubmap-datasets"
            headerRef={scrollToBarChart}
            actionButtons={
              <DownloadButton
                onClick={handleDownload}
                tooltip="Download chart as PNG."
                aria-label="Download Chart as PNG."
              />
            }
          >
            <Typography variant="body1" color="text.secondary" mb={2}>
              Explore HuBMAP datasets through the Filter &amp; Browse Mode or ask questions about our data with natural
              language with our new{' '}
              <InternalLink
                href="/search/datasets?mode=say-see"
                onClick={() =>
                  trackEvent({ category: 'Homepage', action: 'HuBMAP Datasets', label: 'Say & See Mode Link' })
                }
              >
                Say &amp; See Mode.
              </InternalLink>
            </Typography>
            <HuBMAPDatasetsChart chartRef={chartRef} onSelectionChange={setSelectionLabel} />
          </HomepageSection>
        </UpperLowerGrid>
      )}
      <AnalysisAndVisualizations />
      {/* Scrolls up over the last parallax slide (see ParallaxCover), continuing the parallax. */}
      <ParallaxCover>
        <BottomLowerGrid maxWidth="lg">
          <HomepageSection
            title="Research Powered by HuBMAP"
            icon={BiotechRounded}
            gridArea="research-powered-by-hubmap"
            id="publications"
          >
            <ResearchPoweredByHuBMAP />
          </HomepageSection>
          <HomepageSection
            title="Why Researchers Use the HuBMAP Data Portal"
            icon={StarRounded}
            gridArea="testimonials"
            id="testimonials"
          >
            <Testimonials />
          </HomepageSection>
          <HomepageSection title="Data Use Guidelines" icon={PrivacyTipRounded} gridArea="guidelines">
            <DataUseGuidelines />
          </HomepageSection>
          <HomepageSection title="Related Tools & Resources" icon={BuildRounded} gridArea="related-tools-and-resources">
            <RelatedToolsAndResources />
          </HomepageSection>
        </BottomLowerGrid>
      </ParallaxCover>
    </>
  );
}

export default Home;
