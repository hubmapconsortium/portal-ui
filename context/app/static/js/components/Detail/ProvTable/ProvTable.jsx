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
  const { provData, uuid, entity_type, typesToSplit } = props;

  const types = Object.values(provData.entity).reduce(
    (acc, item) => {
      acc[typesToSplit.indexOf(item['prov:type'])].push(item);
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
              type
                .reverse()
                .map((item) => (
                  <ProvTableTile
                    key={item['hubmap:uuid']}
                    uuid={item['hubmap:uuid']}
                    id={item['hubmap:displayDOI']}
                    entityType={item['prov:type']}
                    isCurrentEntity={uuid === item['hubmap:uuid']}
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
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
  typesToSplit: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProvTable;
