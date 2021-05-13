import React from 'react';
import Button from '@material-ui/core/Button';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';

function DerivedEntitiesSection({ entities, uuid, entityType }) {
  return entities.length > 0 ? (
    <SectionContainer id="{entityType}-table">
      <SectionHeader>Derived {entityType}s</SectionHeader>
      <StyledButtonRow
        leftText={
          <BottomAlignedTypography variant="subtitle1" color="primary">
            {entities.length} {entityType}s
          </BottomAlignedTypography>
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
      <DerivedEntitiesTable entities={entities} />
    </SectionContainer>
  ) : null;
}

export default DerivedEntitiesSection;
