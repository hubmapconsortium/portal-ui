import React, { useMemo } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableContainer } from 'js/shared-styles/tables';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { useSortState } from 'js/hooks/useSortState';
import EntityHeaderCell from 'js/shared-styles/tables/EntitiesTable/EntityTableHeaderCell';
import { useDownloadTable } from 'js/helpers/download';
import { useCellTypeRows } from './hooks';
import { CellTypeRowProps, CellTypesTableProps } from './types';
import { CellTypeWithCLIDCell, MatchedDatasetsCell, ViewDatasetsCell, DescriptionCell } from './CellTypesTableCells';
import { useOrganContext } from '../contexts';

function CellTypeRow({
  cellType,
  clid,
  matchedDatasets,
  percentage,
  totalIndexedDatasets,
  description,
  isLoadingDescriptions,
}: CellTypeRowProps & { isLoadingDescriptions: boolean }) {
  return (
    <TableRow>
      <TableCell>
        <CellTypeWithCLIDCell cellType={cellType} clid={clid} />
      </TableCell>
      <TableCell>
        <DescriptionCell description={description || ''} isLoadingDescriptions={isLoadingDescriptions} />
      </TableCell>
      <TableCell width={150}>
        <MatchedDatasetsCell
          matchedDatasets={matchedDatasets}
          totalIndexedDatasets={totalIndexedDatasets}
          percentage={percentage}
        />
      </TableCell>
      <TableCell>
        <ViewDatasetsCell matchedDatasets={matchedDatasets} />
      </TableCell>
    </TableRow>
  );
}

function CellTypesTable({ cellTypes }: CellTypesTableProps) {
  const { rows, isLoading, isLoadingDescriptions } = useCellTypeRows(cellTypes);

  const { organ } = useOrganContext();

  const { sortState, setSort } = useSortState(
    {
      cellType: 'cellType',
      description: 'description',
      matchedDatasets: 'matchedDatasets',
    },
    {
      columnId: 'cellType',
      direction: 'asc',
    },
  );

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      switch (sortState.columnId) {
        case 'cellType':
          return a.cellType.localeCompare(b.cellType) * (sortState.direction === 'asc' ? 1 : -1);
        case 'description':
          return (a.description ?? '').localeCompare(b.description ?? '') * (sortState.direction === 'asc' ? 1 : -1);
        case 'matchedDatasets':
          return (
            (a.matchedDatasets?.length ?? 0) -
            (b.matchedDatasets?.length ?? 0) * (sortState.direction === 'asc' ? 1 : -1)
          );
        default:
          return 0; // No sorting applied
      }
    });
  }, [rows, sortState]);

  const download = useDownloadTable({
    fileName: `cell_types_${organ?.name ?? 'unknown'}.tsv`,
    columnNames: [
      'Cell Type',
      'Cell Ontology ID',
      'Description',
      'Matched Datasets',
      'Percentage',
      'Total Indexed Datasets',
      'Matched Dataset IDs',
    ],
    rows: sortedRows.map((row) => [
      row.cellType,
      row.clid ?? '',
      row.description || 'No description available',
      row.matchedDatasets?.length.toString() ?? '0',
      row.percentage?.toString() ?? '0',
      row.totalIndexedDatasets?.toString() ?? '0',
      (row.matchedDatasets ?? []).join(', '),
    ]),
  });

  return (
    <StyledTableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <EntityHeaderCell
              column={{
                id: 'cellType',
                label: 'Cell Type',
                cellContent: () => null,
              }}
              setSort={setSort}
              sortState={sortState}
            />
            <EntityHeaderCell
              column={{
                id: 'description',
                label: 'Description',
                cellContent: () => null,
                tooltipText: 'Cell type description from the Cell Ontology.',
              }}
              setSort={setSort}
              sortState={sortState}
            />
            <EntityHeaderCell
              column={{
                id: 'matchedDatasets',
                label: 'Matched Datasets',
                cellContent: () => null,
                width: 150,
              }}
              setSort={setSort}
              sortState={sortState}
            />
            <TableCell sx={{ backgroundColor: 'background.paper' }} width={200}>
              <Stack alignItems="end">
                <DownloadButton
                  disabled={isLoading}
                  tooltip="Download table in TSV format."
                  sx={{ right: 1 }}
                  onClick={download}
                />
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <CellTypeRow key={row.cellType} {...row} isLoadingDescriptions={isLoadingDescriptions} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default CellTypesTable;
