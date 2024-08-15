import React from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import { Typography } from '@mui/material';
import { StyledAccordion } from './style';

interface AdvancedConfigOptionsProps {
  title: string;
}

function AdvancedConfigOptions({ title }: AdvancedConfigOptionsProps) {
  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ArrowDropDownRounded color="primary" />}>
        <Typography sx={(theme) => ({ color: theme.palette.text.primary })} variant="subtitle2">
          Advanced Configurations (Optional)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{title}</Typography>
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default AdvancedConfigOptions;
