import React from 'react';

import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { Typography } from '@mui/material';

function HuBMAPDescription() {
  return (
    <SectionPaper>
      <Typography variant="h6">
        The HuBMAP Data Portal is the central resource for discovery, visualization, and download of single-cell tissue
        data generated by the consortium. A standardized data curation and processing workflow ensure that only high
        quality is released.
      </Typography>
    </SectionPaper>
  );
}

export default HuBMAPDescription;
