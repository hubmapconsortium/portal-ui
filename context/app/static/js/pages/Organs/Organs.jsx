import React from 'react';

import OrganTile from 'js/components/organ/OrganTile';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

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
      {Object.values(organsWithDatasetCounts).map((organ) => (
        <>
          <OrganTile key={organ.name} organ={organ} />
        </>
      ))}
    </SectionContainer>
  );
}

export default Organs;
