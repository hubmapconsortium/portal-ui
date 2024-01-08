import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { DetailPageSection } from 'js/components/detailPage/style';

import { OutboundLink } from 'js/shared-styles/Links';
import GeneOrgans from './Organs';
import SelectedOrganContextProvider from './SelectedOrganContext';
import { AzimuthVisualization } from './Visualization';

import { organs } from '../constants';

export default function GenesAzimuth() {
  return (
    <SelectedOrganContextProvider>
      <DetailPageSection id={organs.id}>
        <SectionHeader>{organs.title}</SectionHeader>
        <SectionPaper>
          <Stack direction="row" gap={1}>
            <StyledInfoIcon color="primary" />
            <Typography variant="body1">
              This is a list of organs in which this gene have been shown to be expressed within HuBMAP data. Some
              organs may have a <OutboundLink href="https://azimuth.hubmapconsortium.org/">Azimuth</OutboundLink>{' '}
              reference-based analysis visualization associated with the organ.
            </Typography>
          </Stack>
        </SectionPaper>
        <GeneOrgans />
        <AzimuthVisualization />
      </DetailPageSection>
    </SelectedOrganContextProvider>
  );
}
