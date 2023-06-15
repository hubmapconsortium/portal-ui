/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import { FlexContainer, FlexColumn, TableColumn, EntityColumnTitle } from './style';
import ProvTableTile from '../ProvTableTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';

function ProvTable({ uuid, ancestors, assayMetadata }) {
  // Make a new list rather modifying old one in place: Caused duplication in UI.
  const ancestorsAndSelf = [...ancestors, assayMetadata];

  const ancestorsAndSelfByType = ancestorsAndSelf.reduce(
    (acc, entity) => {
      if (acc?.[entity.entity_type]) {
        acc[entity.entity_type].push(entity);
      }
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] },
  );

  const descendantEntityCounts = assayMetadata.descendant_counts.entity_type || {};

  return (
    <FlexContainer>
      {Object.entries(ancestorsAndSelfByType).map(([type, entities]) => (
        <TableColumn key={`provenance-list-${type.toLowerCase()}`}>
          <EntityColumnTitle variant="h5">{type}s</EntityColumnTitle>
          <FlexColumn>
            {entities.length > 0 &&
              entities
                .sort((a, b) => a.created_timestamp - b.created_timestamp)
                .map((item, j, items) => (
                  <ProvTableTile
                    key={item.uuid}
                    uuid={item.uuid}
                    id={item.hubmap_id}
                    entity_type={item.entity_type}
                    isCurrentEntity={uuid === item.uuid}
                    isSampleSibling={
                      j > 0 && item.entity_type === 'Sample' && items[j - 1]?.sample_category === item.sample_category
                    }
                    isFirstTile={j === 0}
                    isLastTile={j === type.length - 1}
                  />
                ))}
            {descendantEntityCounts?.[type] && <ProvTableDerivedLink uuid={uuid} type={type} />}
          </FlexColumn>
        </TableColumn>
      ))}
    </FlexContainer>
  );
}

ProvTable.propTypes = {
  uuid: PropTypes.string.isRequired,
  ancestors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
};

export default ProvTable;
