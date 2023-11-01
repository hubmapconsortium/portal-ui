import React, { useState } from 'react';

import { Tab } from 'js/shared-styles/tabs';
import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { StyledTabs, StyledTabPanel } from './style';

interface EntitiesTablesProps<Doc> {
  isSelectable: boolean;
  initialTabIndex?: number;
  entities: EntitiesTabTypes<Doc>[];
}

function EntitiesTables<Doc>({ isSelectable = true, initialTabIndex = 0, entities }: EntitiesTablesProps<Doc>) {
  const [openTabIndex, setOpenTabIndex] = useState(initialTabIndex);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTabIndex(newValue);
  };
  return (
    <>
      <StyledTabs value={openTabIndex} onChange={handleTabChange} aria-label="Published and preprint publications">
        {entities.map(({ tabLabel }, i) => {
          return <Tab label={tabLabel} index={i} key={`${tabLabel}-tab`} />;
        })}
      </StyledTabs>
      {entities.map(({ query, columns, tabLabel }, i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={`${tabLabel}-table`}>
          <EntityTable<Doc> query={query} columns={columns} isSelectable={isSelectable} />
        </StyledTabPanel>
      ))}
    </>
  );
}

export default EntitiesTables;
