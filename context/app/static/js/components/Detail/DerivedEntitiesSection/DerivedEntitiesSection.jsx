import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import DerivedEntitiesTabs from 'js/components/Detail/DerivedEntitiesTabs';
import DerivedEntitiesSectionHeader from 'js/components/Detail/DerivedEntitiesSectionHeader';

import { StyledDiv, StyledCenteredLoaderWrapper } from './style';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, entityType }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <SectionContainer id="derived">
      <StyledDiv>
        <DerivedEntitiesSectionHeader
          header="Derived Entities"
          entityCountsText={[`${samples.length} Samples`, `${datasets.length} Datasets`].join(' | ')}
          uuid={uuid}
          entityType={entityType}
        />
        <DerivedEntitiesTabs samples={samples} datasets={datasets} />
      </StyledDiv>
    </SectionContainer>
  );
}

export default DerivedEntitiesSection;
