import React from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import TableCell from '@material-ui/core/TableCell';
import { LightBlueLink } from 'js/shared-styles/Links';

function SavedEntitiesTableRow({ uuid, rowData, index, isSelected, addToSelectedRows, removeFromSelectedRows }) {
  const handleClick = isSelected ? removeFromSelectedRows : addToSelectedRows;

  const { hubmap_id, group_name, entity_type, dateSaved, dateAddedToList } = rowData;
  return (
    <TableRow>
      <TableCell padding="checkbox" onClick={() => handleClick(uuid)}>
        <Checkbox checked={isSelected} inputProps={{ 'aria-labelledby': `saved-entities-row-${index}-checkbox` }} />
      </TableCell>
      <TableCell>
        <LightBlueLink href={`/browse/${hubmap_id}`}>{hubmap_id}</LightBlueLink>
      </TableCell>
      <TableCell>{group_name}</TableCell>
      <TableCell>{entity_type}</TableCell>
      <TableCell>{format(dateSaved || dateAddedToList, 'yyyy-MM-dd')}</TableCell>
    </TableRow>
  );
}

export default SavedEntitiesTableRow;
