import React, { useContext } from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import { AppContext } from 'js/components/Providers';
import useEntityData from 'js/hooks/useEntityData';
import TableCell from '@material-ui/core/TableCell';

function SavedEntitiesTableRow({ uuid, dateSaved, index, isSelected, addToSelectedRows, removeFromSelectedRows }) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const entityData = useEntityData(uuid, elasticsearchEndpoint, nexusToken);

  const handleClick = isSelected ? removeFromSelectedRows : addToSelectedRows;

  return entityData ? (
    <TableRow onClick={() => handleClick(uuid)}>
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected} inputProps={{ 'aria-labelledby': `saved-entities-row-${index}-checkbox` }} />
      </TableCell>
      <TableCell>{entityData.display_doi || ''}</TableCell>
      <TableCell>{entityData.entity_type || ''}</TableCell>
      <TableCell>{entityData.group_name || ''}</TableCell>
      <TableCell>{format(dateSaved, 'yyyy-MM-dd')}</TableCell>
    </TableRow>
  ) : null;
}

export default SavedEntitiesTableRow;
