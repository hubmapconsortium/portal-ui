/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { FlexContainer, FlexColumn, EntityColumnTitle } from './style';
import ProvTableTile from '../ProvTableTile';

function DerivedLink(props) {
  const { uuid, type } = props;
  return (
    <Button
      component="a"
      href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}
      size="large"
      color="primary"
      variant="contained"
    >
      View Derived {type}s
    </Button>
  );
}

function ProvTable(props) {
  const { uuid, entity_type, typesToSplit, ancestors, assayMetadata } = props;

  ancestors.push(assayMetadata);

  const types = ancestors.reduce(
    (acc, item) => {
      acc[typesToSplit.indexOf(item.entity_type)].push(item);
      return acc;
    },
    [[], [], []],
  );

  return (
    <FlexContainer>
      {types.map((type, i) => (
        <div key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
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
              <DerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
            {typesToSplit[i] === entity_type && entity_type !== 'Donor' && (
              <DerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
          </FlexColumn>
        </div>
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
