import React from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import TableCell from '@material-ui/core/TableCell';

function SavedEntitiesTableRow({ uuid, rowData, index, isSelected, addToSelectedRows, removeFromSelectedRows }) {
  const handleClick = isSelected ? removeFromSelectedRows : addToSelectedRows;

  const { display_doi, group_name, entity_type, dateSaved, dateAddedToList } = rowData;
  return (
    <TableRow onClick={() => handleClick(uuid)}>
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected} inputProps={{ 'aria-labelledby': `saved-entities-row-${index}-checkbox` }} />
      </TableCell>
      <TableCell>{display_doi}</TableCell>
      <TableCell>{group_name}</TableCell>
      <TableCell>{entity_type}</TableCell>
      <TableCell>{format(dateSaved || dateAddedToList, 'yyyy-MM-dd')}</TableCell>
    </TableRow>
  );
}

export default SavedEntitiesTableRow;
