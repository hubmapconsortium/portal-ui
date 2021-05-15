import React, { useState } from 'react';

import { Tabs, Tab } from 'js/shared-styles/tabs';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { StyledTabPanel } from './style';

function DerivedEntitiesTabs({ samples, datasets }) {
  const [openIndex, setOpenIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenIndex(newIndex);
  };
  return (
    <>
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
    </>
  );
}

export default DerivedEntitiesTabs;
