import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';

const renderHubmapIdCell = ({ hubmap_id, entity_type, uuid }) => (
  <InternalLink href={`/browse/${entity_type.toLowerCase()}/${uuid}`} variant="body2">
    {hubmap_id}
  </InternalLink>
);

function RelatedEntitiesTable({ columns, entities, entityType }) {
  const allColumns = [
    {
      label: 'HuBMAP ID',
      id: 'hubmap_id',
      renderColumnCell: renderHubmapIdCell,
    },
    ...columns,
  ];

  return (
    <EntitiesTable
      headerCells={allColumns.map(({ id, label }) => (
        <HeaderCell data-testid={`${entityType}-${label}-header`} key={id}>
          {label}
        </HeaderCell>
      ))}
      tableRows={entities.map(({ _source }) => (
        <TableRow key={_source.hubmap_id} data-testid={`${entityType}-row`}>
          {allColumns.map(({ renderColumnCell }) => (
            <TableCell>{renderColumnCell(_source)}</TableCell>
          ))}
        </TableRow>
      ))}
    />
  );
}

// RelatedEntitiesTable.prototype = {};

export default RelatedEntitiesTable;
