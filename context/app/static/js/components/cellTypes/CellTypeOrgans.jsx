import React from 'react';

import OrganTile from 'js/components/organ/OrganTile';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Refresh } from 'js/shared-styles/icons';

import { PageSectionContainer, OrganTilesContainer, CellTypesButton } from './style';

const CellTypeOrgans = () => {
  const { organs } = useFlaskDataContext();
  return (
    <PageSectionContainer>
      <CellTypesButton startIcon={<Refresh />}>Reset Filters</CellTypesButton>
      <OrganTilesContainer>
        {Object.entries(organs).map(([name, organ]) => (
          <OrganTile key={name} organ={organ} />
        ))}
      </OrganTilesContainer>
    </PageSectionContainer>
  );
};

export default CellTypeOrgans;
