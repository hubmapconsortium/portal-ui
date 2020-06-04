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

function DerivedLink(props) {
  const { uuid, type } = props;
  return (
    <ListItemLink href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}>
      <ListItemText primary={`Derived ${type}s`} />
    </ListItemLink>
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
        <React.Fragment key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
          <List
            /* eslint-disable prettier/prettier */
            subheader={(
              <CenteredListSubheader component="div" color="primary">
                {typesToSplit[i]}
              </CenteredListSubheader>
            )}
            /* eslint-enable prettier/prettier */
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
              <DerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
            {typesToSplit[i] === entity_type && entity_type !== 'Donor' && (
              <DerivedLink uuid={uuid} type={typesToSplit[i]} />
            )}
          </List>
          {i < types.length - 1 && <Divider orientation="vertical" flexItem />}
        </React.Fragment>
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
