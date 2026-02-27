import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';

import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import DataUseGuidelines from 'js/components/home/DataUseGuidelines';
import ResearchPoweredByHuBMAP from 'js/components/home/ResearchPoweredByHuBMAP';
import { useDownloadImage } from 'js/hooks/useDownloadImage';
import { trackEvent } from 'js/helpers/trackers';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { VisualizationIcon } from 'js/shared-styles/icons';

import EntityCounts from 'js/components/home/EntityCounts';
import HeroV3 from 'js/components/home/HeroV3';
import { LowerContainerGrid } from './style';
import { BiotechRounded, BuildRounded, FormatQuoteRounded, PrivacyTipRounded } from '@mui/icons-material';
import RelatedToolsAndResources from 'js/components/home/RelatedToolsAndResources';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import HomepageSection from 'js/components/home/HomepageSection';

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
      action: 'HuBMAP Datasets / Download Datasets Graph',
      label: selectionLabel,
    });
  }, [downloadPNG, selectionLabel]);

  return (
    <>
      <HeroV3 />
      <EntityCounts />
      <LowerContainerGrid maxWidth="lg">
        {isLargerThanMd && (
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
                tooltip="Download chart as PNG"
                aria-label="Download Chart as PNG"
              />
            }
          >
            <HuBMAPDatasetsChart chartRef={chartRef} onSelectionChange={setSelectionLabel} />
          </HomepageSection>
        )}
        <HomepageSection
          title="Analysis and Visualizations"
          icon={VisualizationIcon}
          gridArea="analysis-and-visualizations"
          id="analysis-and-visualizations"
        >
          <Typography variant="body1" color="text.secondary">
            Coming soon.
          </Typography>
        </HomepageSection>
        <HomepageSection
          title="Research Powered by HuBMAP"
          icon={BiotechRounded}
          gridArea="publications"
          id="publications"
        >
          <ResearchPoweredByHuBMAP />
        </HomepageSection>
        <HomepageSection title="Testimonials" icon={FormatQuoteRounded} gridArea="testimonials" id="testimonials">
          <Typography variant="body1" color="text.secondary">
            Coming soon.
          </Typography>
        </HomepageSection>
        <HomepageSection title="Data Use Guidelines" icon={PrivacyTipRounded} gridArea="guidelines">
          <DataUseGuidelines />
        </HomepageSection>
        <HomepageSection title="Related Tools & Resources" icon={BuildRounded} gridArea="related-tools-and-resources">
          <RelatedToolsAndResources />
        </HomepageSection>
      </LowerContainerGrid>
    </>
  );
}

export default Home;
