import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import { useFlaskDataContext } from 'js/components/Contexts';
import { ESEntityType, Entity } from 'js/components/types';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { ErrorTile } from 'js/components/entity-tile/EntityTile/EntityTile';
import { FlexContainer, FlexColumn, TableColumn, StyledSvgIcon, ProvTableEntityHeader } from './style';
import ProvTableTile from '../ProvTableTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';

type ProvEntityType = 'Donor' | 'Sample' | 'Dataset';
function isProvEntityType(type: string): type is ProvEntityType {
  return ['Donor', 'Sample', 'Dataset'].includes(type);
}

interface ProvTableColumnProps {
  type: ProvEntityType;
  entities: Entity[];
  currentEntityUUID: string;
  descendantEntityCounts?: Record<string, number>;
  missingAncestors?: string[];
}

function ProvEntityColumn({
  type,
  entities,
  currentEntityUUID,
  descendantEntityCounts,
  missingAncestors,
}: ProvTableColumnProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  // Track expanded state for each sample category
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const displayMissingAncestors =
    missingAncestors && missingAncestors.length > 0 && entities.length === 0 && type !== 'Dataset';
  return (
    <TableColumn key={`provenance-list-${type.toLowerCase()}`}>
      <ProvTableEntityHeader>
        <StyledSvgIcon as={entityIconMap[type as ESEntityType]} color="primary" />
        <Typography variant="h5">{type}s</Typography>
      </ProvTableEntityHeader>
      <FlexColumn>
        {entities.length > 0 &&
          entities
            .sort((a, b) => a.created_timestamp - b.created_timestamp)
            .map((item, j, items) => {
              const isSampleSibling =
                j > 0 && item.entity_type === 'Sample' && items[j - 1]?.sample_category === item.sample_category;
              if (isSampleSibling && !isExpanded[item.sample_category as string]) {
                const siblings = items.filter((i) => i.sample_category === item.sample_category);
                const numberOfSiblings = siblings.length - 1;
                // Only draw the button once for the first sibling in the list
                // First element in the siblings list is the first item in the category,
                // so the second item in the list is the first sibling.
                const isFirstSibling = siblings.findIndex((i) => i.uuid === item.uuid) === 1;
                if (!isFirstSibling) return null;
                return (
                  <Button
                    key={item.uuid}
                    variant="contained"
                    onClick={() => setIsExpanded((s) => ({ ...s, [item.sample_category as string]: true }))}
                  >
                    View More in Category ({numberOfSiblings})
                  </Button>
                );
              }
              return (
                <ProvTableTile
                  key={item.uuid}
                  uuid={item.uuid}
                  id={item.hubmap_id}
                  entity_type={item.entity_type}
                  isCurrentEntity={currentEntityUUID === item.uuid}
                  isSampleSibling={isSampleSibling}
                  isFirstTile={j === 0}
                  isLastTile={j === type.length - 1}
                  onClick={() =>
                    trackEntityPageEvent({ action: 'Provenance / Table / Select Card', label: item.hubmap_id })
                  }
                  entityData={item}
                />
              );
            })}
        {descendantEntityCounts?.[type] && <ProvTableDerivedLink uuid={currentEntityUUID} type={type} />}
        {displayMissingAncestors && missingAncestors.map((id) => <ErrorTile key={id} entity_type={type} id={id} />)}
      </FlexColumn>
    </TableColumn>
  );
}

const provTableSource = [
  'uuid',
  'hubmap_id',
  'entity_type',
  'descendant_counts',
  'mapped_data_types',
  'last_modified_timestamp',
  'origin_samples_unique_mapped_organs',
  'mapped_metadata',
  'sample_category',
  'thumbnail_file',
];

function ProvTable() {
  // Make a new list rather modifying old one in place: Caused duplication in UI.
  const { entity: assayMetadata } = useFlaskDataContext();
  const { uuid, ancestor_ids } = assayMetadata;
  const ancestorAndSelfIds = [...ancestor_ids, uuid];
  const [ancestorsAndSelf, isLoadingAncestors] = useEntitiesData(ancestorAndSelfIds, provTableSource);

  if (isLoadingAncestors) {
    return <Skeleton variant="rectangular" height={300} />;
  }

  const missingAncestors = ancestorAndSelfIds.filter((id) => !ancestorsAndSelf.find((entity) => entity.uuid === id));

  const ancestorsAndSelfByType = ancestorsAndSelf.reduce(
    (acc, entity) => {
      const entityType: ESEntityType = entity.entity_type;
      if (isProvEntityType(entityType)) {
        acc[entityType].push(entity);
      }
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] } as Record<ProvEntityType, Entity[]>,
  );

  const descendantEntityCounts = assayMetadata.descendant_counts.entity_type || {};

  const entries = Object.entries(ancestorsAndSelfByType);

  return (
    <FlexContainer>
      {entries.map(([type, entities]) => (
        <ProvEntityColumn
          key={type}
          type={type as ProvEntityType}
          entities={entities}
          currentEntityUUID={uuid}
          descendantEntityCounts={descendantEntityCounts}
          missingAncestors={missingAncestors}
        />
      ))}
    </FlexContainer>
  );
}

export default ProvTable;
