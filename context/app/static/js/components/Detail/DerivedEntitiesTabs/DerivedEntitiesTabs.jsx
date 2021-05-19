import React from 'react';

import { Tabs, Tab } from 'js/shared-styles/tabs';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { StyledTabPanel } from './style';

function DerivedEntitiesTabs({ entities, openIndex, setOpenIndex }) {
  const handleChange = (event, newIndex) => {
    setOpenIndex(newIndex);
  };
  return (
    <>
      <Tabs value={openIndex} onChange={handleChange} aria-label="Derived Datasets and Samples Tabs">
        {entities.map((entity, i) => (
          <Tab label={entity.tabLabel} index={i} />
        ))}
      </Tabs>
      {entities.map((entity, i) => (
        <StyledTabPanel value={openIndex} index={i}>
          <DerivedEntitiesTable entities={entity.data} entityType={entity.entityType} />
        </StyledTabPanel>
      ))}
    </>
  );
}

export default DerivedEntitiesTabs;
