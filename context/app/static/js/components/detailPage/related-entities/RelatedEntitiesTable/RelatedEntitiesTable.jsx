import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import { LightBlueLink } from 'js/shared-styles/Links';

const renderHubmapIdCell = ({ hubmap_id, entity_type, uuid }) => (
  <LightBlueLink href={`/browse/${entity_type.toLowerCase()}/${uuid}`} variant="body2">
    {hubmap_id}
  </LightBlueLink>
);

function RelatedEntitiesTable({ columns, entities }) {
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
        <HeaderCell key={id}>{label}</HeaderCell>
      ))}
      tableRows={entities.map(({ _source }) => (
        <TableRow key={_source.hubmap_id}>
          {allColumns.map(({ renderColumnCell }) => (
            <TableCell>{renderColumnCell(_source)}</TableCell>
          ))}
        </TableRow>
      ))}
    />
  );
}

export default RelatedEntitiesTable;
