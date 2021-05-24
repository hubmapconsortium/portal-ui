import React from 'react';

import { Tab } from 'js/shared-styles/tabs';
import DerivedDatasetsTable from 'js/components/Detail/DerivedDatasetsTable';
import DerivedSamplesTable from 'js/components/Detail/DerivedSamplesTable';

import { StyledTabs, StyledTabPanel, StyledAlert } from './style';

function DerivedEntitiesTabs({ entities, openIndex, setOpenIndex, entityType }) {
  const handleChange = (event, newIndex) => {
    setOpenIndex(newIndex);
  };
  return (
    <>
      <StyledTabs value={openIndex} onChange={handleChange} aria-label="Derived Datasets and Samples Tabs">
        {entities.map((entity, i) => (
          <Tab label={entity.tabLabel} index={i} />
        ))}
      </StyledTabs>
      {entities.map((entity, i) => (
        <StyledTabPanel value={openIndex} index={i}>
          {entities.length > 0 ? (
            <>
              {entity.entityType === 'Dataset' && <DerivedDatasetsTable entities={entity.data} />}
              {entity.entityType === 'Sample' && <DerivedSamplesTable entities={entity.data} />}
            </>
          ) : (
            <StyledAlert severity="warning">{`No derived ${entity.entityType.toLowerCase()}s for this ${entityType.toLowerCase()}.`}</StyledAlert>
          )}
        </StyledTabPanel>
      ))}
    </>
  );
}

export default DerivedEntitiesTabs;
