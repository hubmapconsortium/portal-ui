import React, { PropsWithChildren } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMoreRounded';
import Typography from '@mui/material/Typography';
import { datasetSectionId } from 'js/pages/Dataset/utils';
import { StyledSubsectionAccordion } from './styles';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import DetailPageSection from '../../DetailPageSection';

interface SubsectionProps extends PropsWithChildren {
  title: string;
  icon: React.ReactNode;
  idTitleOverride?: string;
}

export function Subsection({ title, idTitleOverride, icon, children }: SubsectionProps) {
  const track = useTrackEntityPageEvent();
  const { dataset, sectionDataset } = useProcessedDatasetContext();
  return (
    <DetailPageSection id={datasetSectionId(sectionDataset, idTitleOverride ?? title)}>
      <StyledSubsectionAccordion
        defaultExpanded
        onChange={(_, expanded) =>
          track({
            action: `${expanded ? 'Expand' : 'Collapse'} ${title} Section`,
            label: dataset.hubmap_id,
          })
        }
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          {icon}
          <Typography variant="subtitle1" component="h4">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </StyledSubsectionAccordion>
    </DetailPageSection>
  );
}
