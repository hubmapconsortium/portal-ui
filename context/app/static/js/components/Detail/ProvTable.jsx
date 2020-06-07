/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}
const CenteredListSubheader = styled(ListSubheader)`
  text-align: center;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
`;

function ProvTable(props) {
  const { provData, assayMetadata, typesToSplit } = props;
  const { uuid, entity_type } = assayMetadata;

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
        <React.Fragment key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
          <List
            subheader={
              <CenteredListSubheader component="div" color="primary">
                {typesToSplit[i]}
              </CenteredListSubheader>
            }
          >
            <Divider />
            {type && type.length ? (
              type.map((item) => (
                <ListItemLink
                  key={item['hubmap:uuid']}
                  href={`/browse/dataset/${item['hubmap:uuid']}`}
                  disabled={uuid === item['hubmap:uuid']}
                >
                  <ListItemText primary={item['hubmap:displayDOI']} />
                </ListItemLink>
              ))
            ) : (
              <ListItemLink href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${typesToSplit[i]}`}>
                <ListItemText primary={`Derived ${typesToSplit[i]}s`} />
              </ListItemLink>
            )}
            {typesToSplit[i] === entity_type && entity_type !== 'Donor' ? (
              <ListItemLink href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${typesToSplit[i]}`}>
                <ListItemText primary={`Derived ${typesToSplit[i]}s`} />
              </ListItemLink>
            ) : null}
          </List>
          {i < types.length - 1 && <Divider orientation="vertical" flexItem />}
        </React.Fragment>
      ))}
    </FlexContainer>
  );
}

ProvTable.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  assayMetadata: PropTypes.object.isRequired,
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
  typesToSplit: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default ProvTable;
