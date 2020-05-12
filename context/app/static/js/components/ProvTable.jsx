import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const FlexContainer = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content:space-around;
`;

function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

function ProvTable(props) {
  const { provData, typesToSplit } = props;

  const types = Object.values(provData.entity).reduce((acc, item) => {
    acc[typesToSplit.indexOf(item['prov:type'])].push(item);
    return acc;
  }, [[], [], []]).filter((arr) => arr.length > 0);

  return (
    <FlexContainer>
      <List>
        {types[0].map((item) => (
          <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`}>
            <ListItemText primary={`${item['prov:type']}: ${item['hubmap:displayDOI']}`} />
          </ListItemLink>
        ))}
      </List>
      <Divider orientation="vertical" flexItem />
      <List>
        {
          types[1]
            ? types[1].map((item) => (
              <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`}>
                <ListItemText primary={`${item['prov:type']}: ${item['hubmap:displayDOI']}`} />
              </ListItemLink>
            ))
            : 'TODO'
        }
      </List>
      <Divider orientation="vertical" flexItem />
      <List>
        {
          types[2]
            ? types[2].map((item) => (
              <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`}>
                <ListItemText primary={`${item['prov:type']}: ${item['hubmap:displayDOI']}`} />
              </ListItemLink>
            ))
            : 'TODO'
        }
      </List>
    </FlexContainer>
  );
}

ProvTable.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
  typesToSplit: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProvTable;
