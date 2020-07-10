/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import { FlexContainer, FlexColumn, TableColumn, EntityColumnTitle } from './style';
import ProvTableTile from '../ProvTableTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';

function ProvTable(props) {
  const { uuid, entity_type, typesToSplit, ancestors, assayMetadata } = props;

  // Make a new list rather modifying old one in place: Caused duplication in UI.
  const entities = [...ancestors, assayMetadata];

  const types = entities.reduce(
    (acc, item) => {
      acc[typesToSplit.indexOf(item.entity_type)].push(item);
      return acc;
    },
    [[], [], []],
  );

  return (
    <FlexContainer>
      {types.map((type, i) => (
        <TableColumn key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
          <EntityColumnTitle variant="h5">{typesToSplit[i]}s</EntityColumnTitle>
          <FlexColumn>
            {type && type.length ? (
              type.map((item, j) => (
                <ProvTableTile
                  key={item.uuid}
                  uuid={item.uuid}
                  id={item.display_doi}
                  entity_type={item.entity_type}
                  isCurrentEntity={uuid === item.uuid}
                  isNotSibling={j > 0 ? type[j - 1].specimen_type !== item.specimen_type : false}
                />
              ))
            ) : (
              <ProvTableDerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
            {typesToSplit[i] === entity_type && entity_type !== 'Donor' && (
              <ProvTableDerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
          </FlexColumn>
        </TableColumn>
      ))}
    </FlexContainer>
  );
}

ProvTable.propTypes = {
  uuid: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  typesToSplit: PropTypes.arrayOf(PropTypes.string).isRequired,
  ancestors: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
};

export default ProvTable;
