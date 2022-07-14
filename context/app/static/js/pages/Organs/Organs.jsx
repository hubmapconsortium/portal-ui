import React from 'react';

import OrganTile, { tileWidth } from 'js/components/organ/OrganTile';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import TileGrid from 'js/shared-styles/tiles/TileGrid';
import { useOrgansDatasetCounts } from './hooks';

function Organs({ organs }) {
  const { isLoading, organsWithDatasetCounts } = useOrgansDatasetCounts(organs);

  if (isLoading) {
    return null;
  }
  return (
    <SectionContainer>
      <SectionHeader variant="h1" component="h1">
        Organs
      </SectionHeader>
      <TileGrid $tileWidth={tileWidth}>
        {Object.values(organsWithDatasetCounts).map((organ) => (
          <OrganTile key={organ.name} organ={organ} />
        ))}
      </TileGrid>
    </SectionContainer>
  );
}

export default Organs;
