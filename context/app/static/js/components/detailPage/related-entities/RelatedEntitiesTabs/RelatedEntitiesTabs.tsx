import React from 'react';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { Tab } from 'js/shared-styles/tabs';
import { ESEntityType, PartialEntity } from 'js/components/types';
import { StyledTabs, StyledTabPanel, StyledAlert, StyledSvgIcon } from './style';
import { RelatedEntitiesColumn } from '../RelatedEntitiesTable/RelatedEntitiesTable';

interface RelatedEntitiesTabProps {
  entities: {
    tabLabel: string;
    data: { _source: PartialEntity }[];
    entityType: ESEntityType;
    columns: RelatedEntitiesColumn[];
  }[];
  openIndex: number;
  setOpenIndex: (index: number) => void;
  ariaLabel: string;
  renderWarningMessage: (entityType: string) => string;
}

function RelatedEntitiesTabs({
  entities,
  openIndex,
  setOpenIndex,
  ariaLabel,
  renderWarningMessage,
}: RelatedEntitiesTabProps) {
  const handleChange = (_: unknown, newIndex: number) => {
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
            icon={<StyledSvgIcon as={entityIconMap[entity.entityType]} color="primary" />}
            iconPosition="start"
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

export default RelatedEntitiesTabs;
