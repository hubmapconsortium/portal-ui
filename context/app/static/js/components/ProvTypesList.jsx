import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';


function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

const CenteredListSubheader = styled(ListSubheader)`
  text-align: center;
`;

function ProvTable(props) {
  const { typeData, current } = props;
  return (
    <List subheader={(
      <CenteredListSubheader component="div">
        {typeData[0]['prov:type']}
      </CenteredListSubheader>
    )}
    >
      <Divider />
      {typeData.map((item) => (
        <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`} disabled={current === item['hubmap:uuid']}>
          <ListItemText primary={item['hubmap:displayDOI']} />
        </ListItemLink>
      ))}
    </List>
  );
}

ProvTable.propTypes = {
  typeData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProvTable;
