import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Tabs, Tab } from 'js/shared-styles/tabs';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { StyledDiv, StyledTabPanel, StyledCenteredLoaderWrapper } from './style';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, entityType }) {
  const [openIndex, setOpenIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenIndex(newIndex);
  };

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
        <Tabs value={openIndex} onChange={handleChange} aria-label="Provenance Tabs">
          {samples && <Tab label="Samples" index={0} />}
          {datasets && <Tab label="Datasets" index={1} />}
        </Tabs>
        {samples && (
          <StyledTabPanel value={openIndex} index={0}>
            <DerivedEntitiesTable entities={samples} entityType="Sample" />
          </StyledTabPanel>
        )}
        {datasets && (
          <StyledTabPanel value={openIndex} index={1}>
            <DerivedEntitiesTable entities={datasets} entityType="Dataset" />
          </StyledTabPanel>
        )}
      </StyledDiv>
    </SectionContainer>
  );
}

export default DerivedEntitiesSection;
