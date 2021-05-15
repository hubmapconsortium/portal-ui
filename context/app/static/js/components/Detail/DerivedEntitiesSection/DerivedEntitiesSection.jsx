import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';
import DerivedEntitiesTabs from 'js/components/Detail/DerivedEntitiesTabs';
import { StyledDiv, StyledCenteredLoaderWrapper } from './style';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, entityType }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <SectionContainer id="derived-entities">
      <StyledDiv>
        <StyledButtonRow
          leftText={
            <div>
              <SectionHeader>Derived Entities</SectionHeader>
              <BottomAlignedTypography variant="subtitle1" color="primary">
                {[`${samples.length} Samples`, `${datasets.length} Datasets`].join(' | ')}
              </BottomAlignedTypography>
            </div>
          }
          buttons={
            <Button
              variant="contained"
              color="primary"
              component="a"
              href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entityType}`}
            >
              View Data on Search Page
            </Button>
          }
        />
        <DerivedEntitiesTabs samples={samples} datasets={datasets} />
      </StyledDiv>
    </SectionContainer>
  );
}

export default DerivedEntitiesSection;
