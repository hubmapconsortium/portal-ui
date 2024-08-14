import React from 'react';

import Stack from '@mui/material/Stack';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

import { organs } from '../constants';

import GeneOrgansAccordion from './OrgansAccordion';
import SelectedOrganContextProvider from './SelectedOrganContext';
import GeneOrgansDescription from './GeneOrgansDescription';
import OrganCount from './OrganCount';

export default function GeneOrgans() {
  return (
    <SelectedOrganContextProvider>
      <CollapsibleDetailPageSection id={organs.id} title={organs.title}>
        <Stack direction="column" gap={1}>
          <GeneOrgansDescription />
          <OrganCount />
          <GeneOrgansAccordion />
        </Stack>
      </CollapsibleDetailPageSection>
    </SelectedOrganContextProvider>
  );
}
