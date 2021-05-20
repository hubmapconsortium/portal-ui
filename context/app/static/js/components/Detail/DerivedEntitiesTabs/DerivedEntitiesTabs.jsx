import React from 'react';

import { Tabs, Tab } from 'js/shared-styles/tabs';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { StyledTabPanel, StyledAlert } from './style';

function DerivedEntitiesTabs({ entities, openIndex, setOpenIndex, entityType }) {
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
          {entities.length > 0 ? (
            <DerivedEntitiesTable entities={entity.data} entityType={entity.entityType} />
          ) : (
            <StyledAlert severity="warning">{`No derived ${entity.entityType.toLowerCase()}s for this ${entityType.toLowerCase()}.`}</StyledAlert>
          )}
        </StyledTabPanel>
      ))}
    </>
  );
}

export default DerivedEntitiesTabs;
