import React, { PropsWithChildren } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import { VisualizationIcon } from 'js/shared-styles/icons';
import Skeleton from '@mui/material/Skeleton';
import { formatSectionHash } from 'js/shared-styles/sections/TableOfContents/utils';
import StatusIcon from '../../StatusIcon';
import { ProcessedDataVisualizationProps } from './types';
import { ProcessedDatasetSectionAccordion } from './styles';

const iconPlaceholder = <Skeleton variant="circular" width={24} height={24} animation="pulse" />;

export function ProcessedDatasetAccordion({
  dataset,
  conf,
  isLoading,
  children,
}: PropsWithChildren<ProcessedDataVisualizationProps>) {
  const visualizationIcon = conf ? <VisualizationIcon /> : null;
  return (
    <ProcessedDatasetSectionAccordion defaultExpanded id={formatSectionHash(`section-${dataset.hubmap_id}`)}>
      <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
        {isLoading ? iconPlaceholder : visualizationIcon}
        <Typography variant="subtitle1" color="inherit" component="h4">
          {dataset.pipeline}
        </Typography>
        <Typography variant="body1" ml="auto" component="div" display="flex" alignItems="center" gap={1}>
          <StatusIcon status={dataset.status} noColor sx={{ fontSize: 16 }} />
          {dataset.hubmap_id}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </ProcessedDatasetSectionAccordion>
  );
}
