import React, { PropsWithChildren, useEffect, useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import Skeleton from '@mui/material/Skeleton';

import { VisualizationIcon } from 'js/shared-styles/icons';
import PrimaryColorAccordion from 'js/shared-styles/accordions/PrimaryColorAccordion';

import { datasetSectionId } from 'js/pages/Dataset/utils';
import { useInView } from 'react-intersection-observer';
import { useHash } from 'js/hooks/useHash';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import StatusIcon from '../../StatusIcon';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import useProcessedDataStore from '../store';
import { DetailPageSection } from '../../DetailPageSection';

const iconPlaceholder = <Skeleton variant="circular" width={24} height={24} animation="pulse" />;
const inViewThreshold = 0.1;

function LoadingFallback() {
  return <Skeleton variant="rectangular" height={200} />;
}

export function ProcessedDatasetAccordion({ children }: PropsWithChildren) {
  const { defaultExpanded, dataset, sectionDataset, conf, isLoading } = useProcessedDatasetContext();
  const visualizationIcon = conf ? <VisualizationIcon /> : null;
  const track = useTrackEntityPageEvent();
  const [threshold, setThreshold] = useState(inViewThreshold);

  const { setCurrentDataset, removeVisibleDataset } = useProcessedDataStore((state) => ({
    setCurrentDataset: state.setCurrentDataset,
    removeVisibleDataset: state.removeFromVisibleDatasets,
  }));
  const { ref } = useInView({
    threshold,
    initialInView: false,
    onChange: (visible) => {
      if (visible && dataset) {
        setThreshold(0);
        setCurrentDataset(dataset);
      }
      if (!visible) {
        setThreshold(inViewThreshold);
        removeVisibleDataset(sectionDataset.hubmap_id);
      }
    },
  });
  const datasetIdSubstring = datasetSectionId(sectionDataset);
  const [hash] = useHash();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || hash.includes(datasetIdSubstring));

  useEffect(() => {
    const datasetId = datasetSectionId(sectionDataset);
    if (hash.includes(datasetId)) {
      setIsExpanded(true);
    }
  }, [hash, sectionDataset]);

  return (
    <DetailPageSection id={datasetSectionId(sectionDataset, 'section')}>
      <PrimaryColorAccordion
        defaultExpanded={defaultExpanded}
        expanded={isExpanded}
        onChange={(_, expanded) => {
          track({
            action: `${expanded ? 'Expand' : 'Collapse'} Main Dataset Section`,
            label: sectionDataset.hubmap_id,
          });
          setIsExpanded(expanded);
        }}
        slotProps={{ transition: { unmountOnExit: true } }}
      >
        <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
          {isLoading ? iconPlaceholder : visualizationIcon}
          <Typography variant="subtitle1" color="inherit" component="h4">
            {sectionDataset.pipeline ?? sectionDataset.assay_display_name[0]}
          </Typography>
          <Typography variant="body1" ml="auto" component="div" display="flex" alignItems="center" gap={1}>
            <StatusIcon status={sectionDataset.status} noColor={isExpanded} tooltip />
            {dataset?.hubmap_id}
          </Typography>
        </AccordionSummary>
        {dataset && !isLoading ? <AccordionDetails ref={ref}>{children}</AccordionDetails> : <LoadingFallback />}
      </PrimaryColorAccordion>
    </DetailPageSection>
  );
}
