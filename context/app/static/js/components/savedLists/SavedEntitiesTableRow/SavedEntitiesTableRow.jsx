import React from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';

import TableCell from '@material-ui/core/TableCell';
import { LightBlueLink } from 'js/shared-styles/Links';
import SelectableRowCell from '../../../shared-styles/tables/SelectableRowCell';

function SavedEntitiesTableRow({ uuid, rowData, index }) {
  const { hubmap_id, group_name, entity_type, dateSaved, dateAddedToList } = rowData;
  return (
    <TableRow>
      <SelectableRowCell rowKey={uuid} index={index} />
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
