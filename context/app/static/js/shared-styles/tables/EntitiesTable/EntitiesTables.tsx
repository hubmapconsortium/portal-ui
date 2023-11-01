import React, { useState, ComponentType, ElementType } from 'react';
import { SearchRequest, SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Tab } from 'js/shared-styles/tabs';
import EntityTable from './EntityTable';
import { StyledTabs, StyledTabPanel } from './style';

interface Column<Doc> {
  label: string;
  id: string;
  sort?: string;
  cellContent: ComponentType<{ hit: SearchHit<Doc> }> | ElementType;
}

interface EntityTableType<Doc> {
  query: SearchRequest;
  columns: Column<Doc>[];
  tabLabel: string;
}

interface EntitiesTablesProps<Doc> {
  initialTabIndex?: number;
  entities: EntityTableType<Doc>[];
}

function EntitiesTables<Doc>({ initialTabIndex = 0, entities }: EntitiesTablesProps<Doc>) {
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
          <EntityTable<Doc> query={query} columns={columns} />
        </StyledTabPanel>
      ))}
    </>
  );
}

export default EntitiesTables;
