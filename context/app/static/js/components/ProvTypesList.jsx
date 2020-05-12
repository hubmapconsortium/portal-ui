import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';


function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

function ProvTable(props) {
  const { typeData } = props;
  return (
    <List subheader={(
      <ListSubheader component="div">
        {typeData[0]['prov:type']}
      </ListSubheader>
    )}
    >
      <Divider />
      {typeData.map((item) => (
        <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`} >
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
