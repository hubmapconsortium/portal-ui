import React from 'react';

import { Tab } from 'js/shared-styles/tabs';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { StyledTabs, StyledTabPanel, StyledAlert } from './style';

function RelatedEntitiesTabs({ entities, openIndex, setOpenIndex, ariaLabel, renderWarningMessage }) {
  const handleChange = (event, newIndex) => {
    setOpenIndex(newIndex);
  };

  return (
    <>
      <StyledTabs value={openIndex} onChange={handleChange} aria-label={ariaLabel}>
        {entities.map((entity, i) => (
          <Tab
            label={`${entity.tabLabel} (${entity.data.length})`}
            index={i}
            key={entity.tabLabel}
            data-testid={`${entity.tabLabel.toLowerCase()}-tab`}
          />
        ))}
      </StyledTabs>
      {entities.map(({ tabLabel, data, entityType: tableEntityType, columns }, i) => (
        <StyledTabPanel value={openIndex} index={i} key={tabLabel} data-testid={`${tabLabel.toLowerCase()}-panel`}>
          {data.length > 0 ? (
            <RelatedEntitiesTable columns={columns} entities={data} entityType={tableEntityType.toLowerCase()} />
          ) : (
            <StyledAlert severity="warning">{renderWarningMessage(tableEntityType)}</StyledAlert>
          )}
        </StyledTabPanel>
      ))}
    </>
  );
}

// RelatedEntitiesTabs.propTypes = {};

export default RelatedEntitiesTabs;
