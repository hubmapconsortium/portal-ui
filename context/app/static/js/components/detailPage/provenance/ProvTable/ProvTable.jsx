/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import { FlexContainer, FlexColumn, TableColumn, EntityColumnTitle } from './style';
import ProvTableTile from '../ProvTableTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';

function ProvTable(props) {
  const { uuid, typesToSplit, ancestors, assayMetadata } = props;

  // Make a new list rather modifying old one in place: Caused duplication in UI.
  const entities = [...ancestors, assayMetadata];

  const types = entities.reduce(
    (acc, item) => {
      acc[typesToSplit.indexOf(item.entity_type)].push(item);
      return acc;
    },
    typesToSplit.map(() => []),
  );

  const descendantCounts = assayMetadata.descendant_counts.entity_type || {};

  return (
    <FlexContainer>
      {types.map((type, i) => (
        <TableColumn key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
          {(type.length > 0 || descendantCounts[typesToSplit[i]] > 0) && (
            <>
              <EntityColumnTitle variant="h5">{typesToSplit[i]}s</EntityColumnTitle>
              <FlexColumn>
                {type.length > 0 ? (
                  type
                    .sort((a, b) => a.created_timestamp - b.created_timestamp)
                    .map((item, j) => (
                      <ProvTableTile
                        key={item.uuid}
                        uuid={item.uuid}
                        id={item.hubmap_id}
                        entity_type={item.entity_type}
                        isCurrentEntity={uuid === item.uuid}
                        isSampleSibling={
                          j > 0 && item.entity_type === 'Sample' && type[j - 1].specimen_type === item.specimen_type
                        }
                        isFirstTile={j === 0}
                        isLastTile={j === type.length - 1}
                      />
                    ))
                ) : (
                  <ProvTableDerivedLink uuid={uuid} type={[typesToSplit[i]]} />
                )}
              </FlexColumn>
            </>
          )}
        </TableColumn>
      ))}
    </FlexContainer>
  );
}

ProvTable.propTypes = {
  uuid: PropTypes.string.isRequired,
  typesToSplit: PropTypes.arrayOf(PropTypes.string).isRequired,
  ancestors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
};

export default ProvTable;
