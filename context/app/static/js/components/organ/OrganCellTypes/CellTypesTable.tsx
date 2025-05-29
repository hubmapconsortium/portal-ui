import React, { useMemo } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { InternalLink } from 'js/shared-styles/Links';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import { StyledTableContainer } from 'js/shared-styles/tables';
import Paper from '@mui/material/Paper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useCellTypeOntologyDetail } from 'js/hooks/useUBKG';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import useFindDatasetForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { percent } from 'js/helpers/number-format';
import { useIndexedDatasetsForOrgan } from 'js/pages/Organ/hooks';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { useSortState } from 'js/hooks/useSortState';
import EntityHeaderCell from 'js/shared-styles/tables/EntitiesTable/EntityTableHeaderCell';
import ViewEntitiesButton from '../ViewEntitiesButton';
import { useCLID, useFormattedCellTypeNames, useUUIDsFromHubmapIds } from '../hooks';

interface CellTypesTableProps {
  cellTypes: string[];
}

interface CellTypeProps {
  cellType: string;
}

function CellTypeLink({ cellType }: CellTypeProps) {
  const clid = useCLID(cellType);

  if (!clid) return cellType;

  return <InternalLink href={`/cell-types/${clid}`}>{cellType}</InternalLink>;
}

// TODO: Remove this when the cell types detail page is ready
const enableLinks = false;

function CellTypeCell({ cellType }: CellTypeProps) {
  if (!enableLinks) {
    return cellType;
  }

  return <CellTypeLink cellType={cellType} />;
}

interface CellTypeRowProps {
  cellType: string;
  clid?: string;
  matchedDatasets?: string[];
  percentage?: string;
  totalIndexedDatasets?: number;
}
interface CLIDCellProps {
  clid: string | undefined;
}

function CLIDCell({ clid }: CLIDCellProps) {
  if (!clid) return <Skeleton variant="text" width={100} />;
  return (
    <OutboundIconLink href={`https://www.ebi.ac.uk/ols4/search?q=${clid}&ontology=cl&exactMatch=true`}>
      {clid}
    </OutboundIconLink>
  );
}

function useMatchedDatasets(cellTypes: string[]) {
  const { data: matchedDatasets, isLoading } = useFindDatasetForCellTypes({
    cellTypes,
  });
  const matchedDatasetsCounts = matchedDatasets?.map(({ datasets }) => datasets.length) ?? [];
  return {
    matchedDatasets,
    matchedDatasetsCounts,
    isLoading,
  };
}

function MatchedDatasetsCell({
  totalIndexedDatasets,
  matchedDatasets,
  percentage,
}: Pick<CellTypeRowProps, 'matchedDatasets' | 'totalIndexedDatasets' | 'clid' | 'percentage'>) {
  const matchedDatasetsCount = matchedDatasets?.length ?? 0;

  if (!totalIndexedDatasets) {
    return <Skeleton variant="text" width={150} />;
  }

  return `${matchedDatasetsCount}/${totalIndexedDatasets} (${percentage})`;
}

function ViewDatasetsCell({ matchedDatasets }: Pick<CellTypeRowProps, 'matchedDatasets'>) {
  const { datasetUUIDs, isLoading } = useUUIDsFromHubmapIds(matchedDatasets ?? []);

  if (isLoading) {
    return <Skeleton variant="text" width={150} />;
  }

  return <ViewEntitiesButton entityType="Dataset" filters={{ datasetUUIDs }} />;
}

function CellTypeDescription({ clid }: CLIDCellProps) {
  const cellIdWithoutPrefix = clid ? clid.replace('CL:', '') : undefined;
  const { data, error, isLoading } = useCellTypeOntologyDetail(cellIdWithoutPrefix);
  const description = data?.cell_type.definition;

  if (error) {
    return (
      <Typography variant="body2" sx={{ p: 2 }}>
        Error loading description for cell type {clid}.
      </Typography>
    );
  }

  if (isLoading) {
    return <Skeleton variant="text" sx={{ p: 2 }} />;
  }

  return (
    <Typography variant="body2" sx={{ p: 2 }}>
      {description ?? 'No description available for this cell type.'}
    </Typography>
  );
}

function CellTypeRow({ cellType, clid, matchedDatasets, percentage, totalIndexedDatasets }: CellTypeRowProps) {
  return (
    <ExpandableRow numCells={5} expandedContent={<CellTypeDescription clid={clid} />} reverse>
      <ExpandableRowCell>
        <CellTypeCell cellType={cellType} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <CLIDCell clid={clid} />
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

function useCellTypeRows(cellTypes: string[]) {
  const formattedCellNames = useFormattedCellTypeNames(cellTypes);
  const { data: clids, isLoading: isLoadingClids } = useLabelsToCLIDs(formattedCellNames);
  const { matchedDatasets, isLoading: isLoadingMatchedDatasets } = useMatchedDatasets(formattedCellNames);
  const { datasets: totalIndexedDatasets, isLoading: isLoadingTotalDatasets } = useIndexedDatasetsForOrgan();

  const rows = useMemo(() => {
    return cellTypes.map((cellType, index) => {
      const matches = matchedDatasets?.[index]?.datasets ?? [];
      const matchedDatasetsCount = matches.length;
      const percentage = percent.format(matchedDatasetsCount / totalIndexedDatasets.length);

      return {
        cellType,
        clid: clids?.[index].CLIDs?.[0],
        matchedDatasets: matches,
        totalIndexedDatasets: totalIndexedDatasets.length,
        percentage,
      };
    });
  }, [cellTypes, clids, matchedDatasets, totalIndexedDatasets.length]);

  const isLoading = isLoadingClids || isLoadingMatchedDatasets || isLoadingTotalDatasets;

  return {
    rows,
    isLoading,
  };
}

function CellTypesTable({ cellTypes }: CellTypesTableProps) {
  const { rows } = useCellTypeRows(cellTypes);

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
                cellContent: CellTypeCell,
              }}
              setSort={setSort}
              sortState={sortState}
            />

            <EntityHeaderCell
              column={{
                id: 'clid',
                label: 'Cell Ontology ID',
                cellContent: CLIDCell,
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
                <DownloadButton tooltip="Download table in TSV format." sx={{ right: 1 }} />
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
