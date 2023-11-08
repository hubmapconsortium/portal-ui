import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { DetailPageSection } from 'js/components/detailPage/style';

import GeneOrgans from './Organs';
import SelectedOrganContextProvider from './SelectedOrganContext';
import { AzimuthVisualization } from './Visualization';

export default function GenesAzimuth() {
  return (
    <SelectedOrganContextProvider>
      <DetailPageSection id="azimuth">
        <SectionHeader iconTooltipText="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment.">
          Azimuth Organ Reference Dataset
        </SectionHeader>
        <SectionPaper>
          <Stack direction="row" gap={1}>
            <StyledInfoIcon color="primary" />
            <Typography variant="body1">
              Below is a list of organs in which this gene have been shown to be expressed in. An organ is already
              pre-selected to begin with, so to explore a certain organ in the visualization below, select an organ of
              choice.
            </Typography>
          </Stack>
        </SectionPaper>
        <GeneOrgans />
        <AzimuthVisualization />
      </DetailPageSection>
    </SelectedOrganContextProvider>
  );
}
