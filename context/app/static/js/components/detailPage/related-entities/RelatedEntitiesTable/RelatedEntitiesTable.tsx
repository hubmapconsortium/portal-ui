import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { PartialEntity } from 'js/components/types';

interface ColumnCellProps {
  hubmap_id: string;
  entity_type: string;
  uuid: string;
}

export interface RelatedEntitiesColumn {
  label: string;
  id: string;
  renderColumnCell: (_source: PartialEntity) => React.ReactNode;
}

interface RelatedEntitiesTableProps {
  columns: RelatedEntitiesColumn[];
  entities: { _source: PartialEntity }[];
  entityType: string;
}

function HubmapIDCell({ hubmap_id, entity_type, uuid }: ColumnCellProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <InternalLink
      href={`/browse/${entity_type.toLowerCase()}/${uuid}`}
      onClick={() =>
        trackEntityPageEvent({ label: uuid, action: `Derived ${entity_type} Navigation / Selected ${entity_type}` })
      }
      variant="body2"
    >
      {hubmap_id}
    </InternalLink>
  );
}

function RelatedEntitiesTable({ columns, entities, entityType }: RelatedEntitiesTableProps) {
  const allColumns = [
    {
      label: 'HuBMAP ID',
      id: 'hubmap_id',
      renderColumnCell: HubmapIDCell,
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
          {allColumns.map(({ id, renderColumnCell }) => (
            <TableCell key={id}>{renderColumnCell(_source)}</TableCell>
          ))}
        </TableRow>
      ))}
    />
  );
}

export default RelatedEntitiesTable;
