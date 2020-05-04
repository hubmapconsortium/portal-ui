import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

function ProvTable(props) {
  const { data } = props;

  return (
    <List>
      {data.map((item) => (
        <ListItemLink key={item['hubmap:uuid']} href={`/browse/dataset/${item['hubmap:uuid']}`}>
          <ListItemText primary={`${item['prov:type']}: ${item['hubmap:displayDOI']}`} />
        </ListItemLink>
      ))}
    </List>
  );
}

ProvTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProvTable;
