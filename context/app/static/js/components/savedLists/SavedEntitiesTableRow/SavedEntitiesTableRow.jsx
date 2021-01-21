import React, { useContext } from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';

import { AppContext } from 'js/components/Providers';
import useEntityData from 'js/hooks/useEntityData';
import TableCell from '@material-ui/core/TableCell';

function SavedEntitiesTableRow({ uuid, dateSaved }) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const entityData = useEntityData(uuid, elasticsearchEndpoint, nexusToken);
  return entityData ? (
    <TableRow>
      <TableCell>{entityData.display_doi || ''}</TableCell>
      <TableCell>{entityData.entity_type || ''}</TableCell>
      <TableCell>{entityData.group_name || ''}</TableCell>
      <TableCell>{format(dateSaved, 'yyyy-MM-dd')}</TableCell>
    </TableRow>
  ) : null;
}

export default SavedEntitiesTableRow;
