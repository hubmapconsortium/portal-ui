import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';

import { OutboundLink } from 'js/shared-styles/Links';

export default function GeneOrgansDescription() {
  return (
    <SectionPaper>
      <Stack direction="row" gap={1}>
        <StyledInfoIcon color="primary" />
        <Typography variant="body1">
          This is a list of organs in which this gene have been shown to be expressed within HuBMAP data. Some organs
          may have a <OutboundLink href="https://azimuth.hubmapconsortium.org/">Azimuth</OutboundLink> reference-based
          analysis visualization associated with the organ.
        </Typography>
      </Stack>
    </SectionPaper>
  );
}
