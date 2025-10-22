import React, { useMemo } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import { StyledTableContainer } from 'js/shared-styles/tables';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import { useSortState } from 'js/hooks/useSortState';
import EntityHeaderCell from 'js/shared-styles/tables/EntitiesTable/EntityTableHeaderCell';
import { useDownloadTable } from 'js/helpers/download';
import { useCellTypeRows } from './hooks';
import { CellTypeRowProps, CellTypesTableProps } from './types';
import { OrganCellTypeCell, CLIDLink, MatchedDatasetsCell, ViewDatasetsCell } from './CellTypesTableCells';
import { useOrganContext } from '../contexts';
import CellTypeDescription from './CellTypeDescription';

function CellTypeRow({ cellType, clid, matchedDatasets, percentage, totalIndexedDatasets }: CellTypeRowProps) {
  return (
    <ExpandableRow numCells={5} expandedContent={<CellTypeDescription cellType={cellType} clid={clid} />} reverse>
      <ExpandableRowCell>
        <OrganCellTypeCell cellType={cellType} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <CLIDLink clid={clid} cellType={cellType} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <MatchedDatasetsCell
          matchedDatasets={matchedDatasets}
          totalIndexedDatasets={totalIndexedDatasets}
          percentage={percentage}
        />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <ViewDatasetsCell matchedDatasets={matchedDatasets} />
      </ExpandableRowCell>
    </ExpandableRow>
  );
}

function CellTypesTable({ cellTypes }: CellTypesTableProps) {
  const { rows, isLoading } = useCellTypeRows(cellTypes);

  const { organ } = useOrganContext();

  const { sortState, setSort } = useSortState(
    {
      cellType: 'cellType',
      clid: 'clid',
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
        case 'clid':
          return (a.clid ?? '').localeCompare(b.clid ?? '') * (sortState.direction === 'asc' ? 1 : -1);
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
    columnNames: ['Cell Type', 'Cell Ontology ID', 'Matched Datasets', 'Percentage', 'Total Indexed Datasets'],
    rows: sortedRows.map((row) => [
      row.cellType,
      row.clid ?? '',
      row.matchedDatasets?.length.toString() ?? '0',
      row.percentage?.toString() ?? '0',
      row.totalIndexedDatasets?.toString() ?? '0',
    ]),
  });

  return (
    <StyledTableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'background.paper' }}>&nbsp; {/* Expansion cell column */} </TableCell>
            <EntityHeaderCell
              column={{
                id: 'cellType',
                label: 'Cell Type',
                cellContent: OrganCellTypeCell,
              }}
              setSort={setSort}
              sortState={sortState}
            />

            <EntityHeaderCell
              column={{
                id: 'clid',
                label: 'Cell Ontology ID',
                cellContent: CLIDLink,
              }}
              setSort={setSort}
              sortState={sortState}
            />
            <EntityHeaderCell
              column={{
                id: 'matchedDatasets',
                label: 'Matched Datasets',
                cellContent: MatchedDatasetsCell,
              }}
              setSort={setSort}
              sortState={sortState}
            />
            <TableCell sx={{ backgroundColor: 'background.paper' }}>
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
            <CellTypeRow key={row.cellType} {...row} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default CellTypesTable;
