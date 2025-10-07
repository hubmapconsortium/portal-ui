import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import { RedirectAlert } from 'js/shared-styles/alerts/RedirectAlert';
import { OrganFile } from 'js/components/organ/types';
import Typography from '@mui/material/Typography';
import { useOrgansDatasetCounts, organNotFoundMessageTemplate } from './hooks';
import HuBMAPDatasetsChart from 'js/components/home/HuBMAPDatasetsChart';
import Description from 'js/shared-styles/sections/Description';
import Stack from '@mui/material/Stack';
import OrgansSearchProvider from 'js/components/organ/OrgansSearchContext';
import OrgansSearchBar from 'js/components/organ/OrgansSearchBar';
import OrgansPanelList from 'js/components/organ/OrgansPanelList';
import { useIsLargeDesktop } from 'js/hooks/media-queries';

interface OrgansProps {
  organs: Record<string, OrganFile>;
}

function Organs({ organs }: OrgansProps) {
  const { isLoading, organsWithDatasetCounts } = useOrgansDatasetCounts(organs);

  const isLargeDesktop = useIsLargeDesktop();

  if (isLoading) {
    return null;
  }

  return (
    <SectionContainer>
      <RedirectAlert messageTemplate={organNotFoundMessageTemplate} />
      <SectionHeader data-testid="organs-title" variant="h1" component="h1">
        Organs
      </SectionHeader>
      <Typography variant="subtitle1" component="h2" color="primary" mb={1.5}>
        {Object.keys(organs).length} Organs
      </Typography>
      <Stack gap={2} useFlexGap>
        <Description>
          Discover HuBMAP data by organ and interact with the data with visualizations including anatomical views and
          cell population plots.
        </Description>
        {isLargeDesktop && <HuBMAPDatasetsChart getBarHrefOverride={(d) => `/organs/${d.bar.data.organ}`} />}
        <OrgansSearchProvider>
          <OrgansSearchBar />
          <OrgansPanelList organs={organsWithDatasetCounts} isLoading={isLoading} />
        </OrgansSearchProvider>
      </Stack>
    </SectionContainer>
  );
}

export default Organs;
