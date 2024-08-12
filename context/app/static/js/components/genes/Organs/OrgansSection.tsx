import React from 'react';

import Stack from '@mui/material/Stack';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';

import { organs } from '../constants';

import GeneOrgansAccordion from './OrgansAccordion';
import SelectedOrganContextProvider from './SelectedOrganContext';
import GeneOrgansDescription from './GeneOrgansDescription';
import OrganCount from './OrganCount';

export default function GeneOrgans() {
  return (
    <SelectedOrganContextProvider>
      <DetailPageSection id={organs.id}>
        <Stack direction="column" gap={1}>
          <SectionHeader>{organs.title}</SectionHeader>
          <GeneOrgansDescription />
          <OrganCount />
          <GeneOrgansAccordion />
        </Stack>
      </DetailPageSection>
    </SelectedOrganContextProvider>
  );
}
