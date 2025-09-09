import React from 'react';

import OrganTile, { tileWidth } from 'js/components/organ/OrganTile';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import TileGrid from 'js/shared-styles/tiles/TileGrid';
import { RedirectAlert } from 'js/shared-styles/alerts/RedirectAlert';
import { OrganFile } from 'js/components/organ/types';
import Typography from '@mui/material/Typography';
import { useOrgansDatasetCounts, organNotFoundMessageTemplate } from './hooks';

interface OrgansProps {
  organs: Record<string, OrganFile>;
}

function Organs({ organs }: OrgansProps) {
  const { isLoading, organsWithDatasetCounts } = useOrgansDatasetCounts(organs);

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
      <TileGrid $tileWidth={tileWidth}>
        {Object.entries(organsWithDatasetCounts).map(([path, organ]) => (
          <OrganTile key={organ.name} organ={organ} path={path} />
        ))}
      </TileGrid>
    </SectionContainer>
  );
}

export default Organs;
