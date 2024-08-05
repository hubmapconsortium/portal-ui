import React, { PropsWithChildren } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMoreRounded';
import Typography from '@mui/material/Typography';
import { formatSectionHash } from 'js/shared-styles/sections/TableOfContents/utils';
import { SubsectionAccordion } from './styles';

interface SubsectionProps extends PropsWithChildren {
  title: string;
  icon: React.ReactNode;
  id: string;
}

export function Subsection({ title, icon, id, children }: SubsectionProps) {
  return (
    <SubsectionAccordion defaultExpanded id={formatSectionHash(id)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {icon}
        <Typography variant="subtitle1" component="h4">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </SubsectionAccordion>
  );
}
