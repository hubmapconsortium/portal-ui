import React from 'react';

import OrganTile, { tileWidth } from 'js/components/organ/OrganTile';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import TileGrid from 'js/shared-styles/tiles/TileGrid';
import { RedirectAlert } from 'js/shared-styles/alerts/RedirectAlert';
import { StyledTypography } from './style';
import { useOrgansDatasetCounts } from './hooks';

function redirectMessageTemplate(redirectedOrganName) {
  return `The organ you selected, ${redirectedOrganName}, is not available. You have been redirected to the list of available organs.`;
}

function Organs({ organs }) {
  const { isLoading, organsWithDatasetCounts } = useOrgansDatasetCounts(organs);

  if (isLoading) {
    return null;
  }

  return (
    <SectionContainer>
      <RedirectAlert messageTemplate={redirectMessageTemplate} />
      <SectionHeader variant="h1" component="h1">
        Organs
      </SectionHeader>
      <StyledTypography variant="subtitle1" component="h2" color="primary">
        {Object.keys(organs).length} Organs
      </StyledTypography>
      <TileGrid $tileWidth={tileWidth}>
        {Object.entries(organsWithDatasetCounts).map(([path, organ]) => (
          <OrganTile key={organ.name} organ={organ} path={path} />
        ))}
      </TileGrid>
    </SectionContainer>
  );
}

export default Organs;
