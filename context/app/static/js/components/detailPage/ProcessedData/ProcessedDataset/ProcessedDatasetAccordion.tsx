import React, { PropsWithChildren } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import { VisualizationIcon } from 'js/shared-styles/icons';
import Skeleton from '@mui/material/Skeleton';
import { formatSectionHash } from 'js/shared-styles/sections/TableOfContents/utils';
import StatusIcon from '../../StatusIcon';
import { ProcessedDatasetSectionAccordion } from './styles';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';

const iconPlaceholder = <Skeleton variant="circular" width={24} height={24} animation="pulse" />;

function LoadingFallback() {
  return <Skeleton variant="rectangular" height={200} />;
}

export function ProcessedDatasetAccordion({ children }: PropsWithChildren) {
  const { defaultExpanded, dataset, sectionDataset, conf, isLoading } = useProcessedDatasetContext();
  const visualizationIcon = conf ? <VisualizationIcon /> : null;
  return (
    <ProcessedDatasetSectionAccordion
      defaultExpanded={defaultExpanded}
      id={formatSectionHash(`section-${sectionDataset.hubmap_id}`)}
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
      {dataset && !isLoading ? <AccordionDetails>{children}</AccordionDetails> : <LoadingFallback />}
    </ProcessedDatasetSectionAccordion>
  );
}
