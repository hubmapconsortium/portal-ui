import React from 'react';

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
import ViewEntitiesButton from '../ViewEntitiesButton';
import { useCLID, useFormattedCellTypeName, useUUIDsFromHubmapIds } from '../hooks';

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

function MatchedDatasetsCell({ cellType }: CellTypeProps) {
  const { datasets: indexedDatasets, isLoading: isLoadingAllIndexed } = useIndexedDatasetsForOrgan();
  const formattedCellName = useFormattedCellTypeName(cellType);
  const { data: datasetsCountWithCellType, isLoading: isLoadingCellType } = useFindDatasetForCellTypes({
    cellTypes: [formattedCellName],
  });

  const isLoading = isLoadingAllIndexed || isLoadingCellType;

  if (isLoading) {
    return <Skeleton variant="text" width={150} />;
  }

  const totalIndexedDatasets = indexedDatasets.length;
  const matchedDatasetsCount = datasetsCountWithCellType?.[0]?.datasets?.length ?? 0;

  return `${matchedDatasetsCount}/${totalIndexedDatasets} (${percent.format(matchedDatasetsCount / totalIndexedDatasets)})`;
}

function ViewDatasetsCell({ cellType }: CellTypeProps) {
  const formattedCellName = useFormattedCellTypeName(cellType);
  const { data: [{ datasets: hubmapIds }] = [{ datasets: [] }], isLoading: isLoadingCellType } =
    useFindDatasetForCellTypes({
      cellTypes: [formattedCellName],
    });

  const { datasetUUIDs, isLoading: isLoadingUUIDs } = useUUIDsFromHubmapIds(hubmapIds);

  const isLoading = isLoadingCellType || isLoadingUUIDs;

  if (isLoading) {
    return <Skeleton variant="text" width={150} />;
  }

  return <ViewEntitiesButton entityType="Dataset" filters={{ datasetUUIDs }} />;
}

function CellTypeDescription({ clid }: CLIDCellProps) {
  const cellIdWithoutPrefix = clid ? clid.replace('CL:', '') : undefined;
  const { data, error } = useCellTypeOntologyDetail(cellIdWithoutPrefix);
  const description = data?.cell_type.definition;

  if (error) {
    return (
      <Typography variant="body2" sx={{ p: 2 }}>
        Error loading description for cell type {clid}.
      </Typography>
    );
  }

  return (
    <Typography variant="body2" sx={{ p: 2 }}>
      {description ?? <Skeleton variant="text" sx={{ p: 2 }} />}
    </Typography>
  );
}

function CellTypeRow({ cellType }: CellTypeProps) {
  const clid = useCLID(cellType);
  return (
    <ExpandableRow numCells={5} expandedContent={<CellTypeDescription clid={clid} />}>
      <ExpandableRowCell>
        <CellTypeCell cellType={cellType} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <CLIDCell clid={clid} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <MatchedDatasetsCell cellType={cellType} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        <ViewDatasetsCell cellType={cellType} />
      </ExpandableRowCell>
    </ExpandableRow>
  );
}

function CellTypesTable({ cellTypes }: CellTypesTableProps) {
  return (
    <StyledTableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {/* <TableCell>&nbsp; Expansion column </TableCell> */}
            <TableCell>Cell Type</TableCell>
            <TableCell>Cell Ontology ID</TableCell>
            <TableCell>Matched Datasets</TableCell>
            <TableCell colSpan={2}>
              <Stack alignItems="end">
                <DownloadButton tooltip="Download table in TSV format." sx={{ right: 1 }} />
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cellTypes.map((cellType) => (
            <CellTypeRow key={cellType} cellType={cellType} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default CellTypesTable;
