import React, { useMemo, useState } from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';
import { StyledTableContainer } from 'js/shared-styles/tables';
import useHyperQueryCellTypes, { GeneSignatureStats } from 'js/api/scfind/useHyperQueryCellTypes';
import useLabelToCLID from 'js/api/scfind/useLabelToCLID';
import { percent } from 'js/helpers/number-format';
import { CLIDCell } from 'js/components/organ/OrganCellTypes/CellTypesTableCells';
import { useEventCallback } from '@mui/material/utils';
import { cellTypes as cellTypesSection } from '../constants';
import { useGenePageContext } from '../hooks';

const columnLabels = ['Cell Type', 'Cell Ontology ID', 'Cells Hit / Total Cells (%)', 'p-value'];

export function TableSkeleton({ numberOfCols = columnLabels.length }: { numberOfCols?: number }) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={numberOfCols}>
          <LinearProgress />
        </TableCell>
      </TableRow>
      <LoadingTableRows numberOfRows={4} numberOfCols={numberOfCols} />
    </>
  );
}

function CellTypesRow({ cellType }: { cellType: GeneSignatureStats }) {
  const { data: clid } = useLabelToCLID({ cellType: cellType.cell_type });
  const formattedCellName = cellType.cell_type.split('.').slice(1).join('.');
  return (
    <TableRow>
      <TableCell>{formattedCellName}</TableCell>
      <TableCell>
        <CLIDCell clid={clid?.CLIDs?.[0]} />
      </TableCell>
      <TableCell>
        {cellType.cell_hits} / {cellType.total_cells} ({percent.format(cellType.cell_hits / cellType.total_cells)}){' '}
      </TableCell>
      <TableCell>{cellType['adj-pval']}</TableCell>
    </TableRow>
  );
}

function CellTypesTable() {
  const { geneSymbol } = useGenePageContext();

  const [selectedOrgan, setSelectedOrgan] = useState<string>('');
  const handleOrganChange = useEventCallback((event: SelectChangeEvent<string>) => {
    setSelectedOrgan(event.target.value);
  });

  const { data: allCellTypesForGene, isLoading: isLoadingAllCellTypes } = useHyperQueryCellTypes({
    geneList: geneSymbol,
    datasetName: undefined, // Fetch all datasets
  });

  const { data: cellTypes, isLoading: isLoadingCurrentCellTypes } = useHyperQueryCellTypes({
    geneList: geneSymbol,
    datasetName: selectedOrgan,
  });

  const cellTypeOrgans = useMemo(
    () =>
      Array.from(
        new Set(
          allCellTypesForGene?.findGeneSignatures
            ? allCellTypesForGene.findGeneSignatures.map((ct) => ct.cell_type.split('.')[0])
            : [],
        ),
      ),
    [allCellTypesForGene],
  );

  const filteredCellTypes = useMemo(() => {
    if (!selectedOrgan) {
      return cellTypes?.findGeneSignatures ?? [];
    }
    return cellTypes?.findGeneSignatures?.filter((ct) => ct.cell_type.startsWith(`${selectedOrgan}.`)) ?? [];
  }, [cellTypes, selectedOrgan]);

  const isLoading = isLoadingAllCellTypes || isLoadingCurrentCellTypes;

  if (!isLoading && !filteredCellTypes.length) {
    return 'No cell types found.';
  }

  return (
    <StyledTableContainer component={Paper}>
      <Select
        value={selectedOrgan}
        label="Organ Sources"
        onChange={handleOrganChange}
        displayEmpty
        fullWidth
        variant="outlined"
      >
        <MenuItem value="">All Available Organs</MenuItem>
        {Array.from(new Set(cellTypeOrgans)).map((organ) => (
          <MenuItem key={organ} value={organ}>
            {organ}
          </MenuItem>
        ))}
      </Select>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columnLabels.map((label) => (
              <TableCell key={label}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {filteredCellTypes.map((cellType) => (
            <CellTypesRow key={cellType.cell_type} cellType={cellType} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default function CellTypes() {
  const { geneSymbolUpper } = useGenePageContext();
  return (
    <CollapsibleDetailPageSection id={cellTypesSection.id} title={`Cell Types with ${geneSymbolUpper} as Marker Gene`}>
      <CellTypesTable />
    </CollapsibleDetailPageSection>
  );
}
