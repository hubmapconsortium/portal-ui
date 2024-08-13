import React, { PropsWithChildren } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import Skeleton from '@mui/material/Skeleton';

import { VisualizationIcon } from 'js/shared-styles/icons';

import { datasetSectionId } from 'js/pages/Dataset/utils';
import { useInView } from 'react-intersection-observer';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import StatusIcon from '../../StatusIcon';
import { ProcessedDatasetSectionAccordion } from './styles';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import useProcessedDataStore from '../store';

const iconPlaceholder = <Skeleton variant="circular" width={24} height={24} animation="pulse" />;

function LoadingFallback() {
  return <Skeleton variant="rectangular" height={200} />;
}

export function ProcessedDatasetAccordion({ children }: PropsWithChildren) {
  const { defaultExpanded, dataset, sectionDataset, conf, isLoading } = useProcessedDatasetContext();
  const visualizationIcon = conf ? <VisualizationIcon /> : null;
  const track = useTrackEntityPageEvent();

  const { setCurrentDataset } = useProcessedDataStore((state) => ({
    setCurrentDataset: state.setCurrentDataset,
  }));
  const { ref } = useInView({
    threshold: 0,
    initialInView: false,
    onChange: (visible) => {
      if (visible && dataset) {
        setCurrentDataset(dataset);
      }
    },
  });
  return (
    <ProcessedDatasetSectionAccordion
      defaultExpanded={defaultExpanded}
      id={datasetSectionId(sectionDataset, 'section')}
      onChange={(_, expanded) =>
        track({ action: `${expanded ? 'Expand' : 'Collapse'} Main Dataset Section`, label: sectionDataset.hubmap_id })
      }
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
        {isLoading ? iconPlaceholder : visualizationIcon}
        <Typography variant="subtitle1" color="inherit" component="h4">
          {sectionDataset.pipeline}
        </Typography>
        <Typography variant="body1" ml="auto" component="div" display="flex" alignItems="center" gap={1}>
          <StatusIcon status={sectionDataset.status} noColor sx={{ fontSize: 16 }} />
          {dataset?.hubmap_id}
        </Typography>
      </AccordionSummary>
      {dataset && !isLoading ? <AccordionDetails ref={ref}>{children}</AccordionDetails> : <LoadingFallback />}
    </ProcessedDatasetSectionAccordion>
  );
}
