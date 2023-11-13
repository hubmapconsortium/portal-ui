import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import React from 'react';
import format from 'date-fns/format';
import { StyledTableContainer } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';
import { useCellTypeDatasets } from './hooks';
import { TableSkeleton } from './CellTypes';

interface DatasetsTableProps {
  id: string;
}
const columns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'mapped_data_types', label: 'Data Type' },
  { id: 'origin_samples_unique_mapped_organs', label: 'Organ' },
  { id: 'group_name', label: 'Group' },
  { id: 'last_modified_timestamp', label: 'Last Modified' },
];
export default function DatasetsTable({ id }: DatasetsTableProps) {
  const { data, isLoading } = useCellTypeDatasets(id, true);

  return (
    <StyledTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(({ label }) => (
              <TableCell key={label}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton numberOfCols={columns.length} />
          ) : (
            data?.map((dataset) => (
              <TableRow key={dataset.uuid}>
                <TableCell>
                  <InternalLink href={`/browse/${dataset.hubmap_id}`}>{dataset.hubmap_id}</InternalLink>
                </TableCell>
                <TableCell>{dataset.mapped_data_types.join(' ')}</TableCell>
                <TableCell>{dataset.origin_samples_unique_mapped_organs}</TableCell>
                <TableCell>{dataset.group_name}</TableCell>
                <TableCell>{format(dataset.last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
