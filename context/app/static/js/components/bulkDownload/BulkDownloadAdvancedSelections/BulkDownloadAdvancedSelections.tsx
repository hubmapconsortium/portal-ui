import React from 'react';

import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import AccordionDetails from '@mui/material/AccordionDetails';
import { StyledAccordion, StyledSubtitle1 } from 'js/components/bulkDownload/BulkDownloadAdvancedSelections/style';

function BulkDownloadAdvancedSelections() {
  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ArrowDropDownRounded color="primary" />}>
        <StyledSubtitle1>Advanced Selections (Optional)</StyledSubtitle1>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>TODO</Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default BulkDownloadAdvancedSelections;
