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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useEventCallback } from '@mui/material/utils';
import Skeleton from '@mui/material/Skeleton';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';
import { StyledTableContainer } from 'js/shared-styles/tables';
import useHyperQueryCellTypes, { GeneSignatureStats } from 'js/api/scfind/useHyperQueryCellTypes';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { percent } from 'js/helpers/number-format';
import { CellTypeLink, CLIDCell } from 'js/components/organ/OrganCellTypes/CellTypesTableCells';
import { SortState, useSortState } from 'js/hooks/useSortState';
import EntityHeaderCell from 'js/shared-styles/tables/EntitiesTable/EntityTableHeaderCell';
import { useDownloadTable } from 'js/helpers/download';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import CellTypeDescription from 'js/components/organ/OrganCellTypes/CellTypeDescription';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import IndexedDatasetsSummary from 'js/components/organ/OrganCellTypes/IndexedDatasetsSummary';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import useSearchData from 'js/hooks/useSearchData';
import Description from 'js/shared-styles/sections/Description';
import Divider from '@mui/material/Divider';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import { trackEvent } from 'js/helpers/trackers';
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
import ScientificNotationDisplay from './ScientificNotationDisplay';
import { useGenePageContext, useGeneDetailPageTrackingInfo, useTrackGeneDetailPage } from '../hooks';
import { cellTypes as cellTypesSection } from '../constants';

const downloadLabels = ['Cell Type', 'Cell Ontology ID', 'Cells Hit', 'Total Cells', 'Percentage', 'p-value'];

const noop = () => null;

const columns = {
  cellType: {
    id: 'cell_type',
    label: 'Cell Type',
    cellContent: noop,
  },
  clid: {
    id: 'clid',
    label: 'Cell Ontology ID',
    cellContent: noop,
  },
  cellsHitPercent: {
    id: 'cell_hits',
    label: 'Cells Hit / Total Cells (%)',
    cellContent: noop,
    tooltipText:
      'Proportion of the amount of cells of this type that significantly express this marker gene relative to the total count of this cell type.',
  },
  pval: {
    id: 'adj-pval',
    label: 'p-value',
    cellContent: noop,
    tooltipText: 'Statistical significance of gene expression for this cell type in the context of the selected organ.',
  },
} as const;

const columnIdMap = Object.fromEntries(Object.entries(columns).map(([key, value]) => [key, value.id]));
const columnList = [columns.cellType, columns.clid, columns.cellsHitPercent, columns.pval];

export function TableSkeleton({ numberOfCols = downloadLabels.length }: { numberOfCols?: number }) {
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

interface CellTypeRow {
  cell_type: string;
  clid: string | null;
  cell_hits: number;
  total_cells: number;
  percentage: string;
  'adj-pval': number;
}

const useCellTypeRows = (cellTypes: GeneSignatureStats[] = []) => {
  const { results: clids } = useLabelsToCLIDs(useMemo(() => cellTypes.map((ct) => ct.cell_type), [cellTypes]));

  return useMemo(() => {
    return cellTypes.map((cellType, idx) => ({
      cell_type: cellType.cell_type,
      clid: clids?.[idx]?.CLIDs?.[0] ?? null,
      cell_hits: cellType.cell_hits,
      total_cells: cellType.total_cells,
      percentage: percent.format(cellType.cell_hits / cellType.total_cells),
      'adj-pval': cellType['adj-pval'],
    }));
  }, [cellTypes, clids]);
};

function CellTypesRow({ cellType }: { cellType: CellTypeRow }) {
  const formattedCellName = useMemo(() => cellType.cell_type.split('.').slice(1).join('.'), [cellType.cell_type]);
  const trackExpandRow = useTrackGeneDetailPage({
    action: 'Cell Types / Expand Row',
    label: formattedCellName,
  });
  const trackCollapseRow = useTrackGeneDetailPage({
    action: 'Cell Types / Collapse Row',
    label: formattedCellName,
  });
  const trackCLIDClick = useTrackGeneDetailPage({
    action: 'Cell Types / Select CLID',
    label: formattedCellName,
  });
  const trackCellTypeClick = useTrackGeneDetailPage({
    action: 'Cell Types / Select Cell Type',
    label: formattedCellName,
  });
  return (
    <ExpandableRow
      numCells={6}
      expandedContent={
        cellType.clid ? <CellTypeDescription clid={cellType.clid} cellType={cellType.cell_type} /> : <Skeleton />
      }
      reverse
      onExpand={(isExpanded) => {
        const track = isExpanded ? trackExpandRow : trackCollapseRow;
        track();
      }}
    >
      <ExpandableRowCell>
        {cellType.clid ? (
          <CellTypeLink cellType={formattedCellName} clid={cellType.clid} onClick={trackCellTypeClick} />
        ) : (
          formattedCellName
        )}
      </ExpandableRowCell>
      <ExpandableRowCell>
        <CLIDCell onClick={trackCLIDClick} clid={cellType.clid} cellType={cellType.cell_type} />
      </ExpandableRowCell>
      <ExpandableRowCell>
        {cellType.cell_hits} / {cellType.total_cells} ({percent.format(cellType.cell_hits / cellType.total_cells)}){' '}
      </ExpandableRowCell>
      <ExpandableRowCell>
        <ScientificNotationDisplay value={cellType['adj-pval']} />
      </ExpandableRowCell>
      {/* Empty action column cell */}
      <ExpandableRowCell />
    </ExpandableRow>
  );
}

interface CellTypesTableHeaderProps {
  isLoading: boolean;
  handleTableDownload: () => void;
  handleSortChange: (sort: string) => void;
  sortState: SortState;
}

function CellTypesTableHeader({
  isLoading,
  handleTableDownload,
  handleSortChange,
  sortState,
}: CellTypesTableHeaderProps) {
  return (
    <TableHead>
      <TableRow>
        {/* Expand column */}
        <TableCell sx={{ backgroundColor: 'background.paper' }} />
        {columnList.map((column) => (
          <EntityHeaderCell column={column} key={column.id} setSort={handleSortChange} sortState={sortState} />
        ))}
        <TableCell sx={{ backgroundColor: 'background.paper' }} align="right">
          <DownloadButton
            disabled={isLoading}
            tooltip="Download table in TSV format."
            sx={{ right: 1 }}
            onClick={handleTableDownload}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function CellTypesTable() {
  const { geneSymbol } = useGenePageContext();

  const [selectedOrgan, setSelectedOrgan] = useState<string>('');

  const { sortState, setSort } = useSortState(columnIdMap, {
    columnId: 'adj-pval',
    direction: 'desc',
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

  const cellTypeRows = useCellTypeRows(cellTypes?.findGeneSignatures);

  const filteredSortedCellTypes = useMemo(() => {
    const sortedCellTypes = [...cellTypeRows].sort((a, b) => {
      if (!sortState.columnId) {
        return 0; // No sorting if no column is selected
      }
      const aValue = a[sortState.columnId as keyof CellTypeRow];
      const bValue = b[sortState.columnId as keyof CellTypeRow];
      if (aValue === bValue) return 0; // Equal values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * (sortState.direction === 'asc' ? 1 : -1);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * (sortState.direction === 'asc' ? 1 : -1);
      }
      return 0;
    });
    return sortedCellTypes.filter((cellType) => {
      if (cellType.cell_type.endsWith('other')) return false; // Hide 'other' cell types
      if (!selectedOrgan) return true; // Show all if no organ is selected
      return cellType.cell_type.startsWith(`${selectedOrgan}.`);
    });
  }, [cellTypeRows, selectedOrgan, sortState.columnId, sortState.direction]);

  const download = useDownloadTable({
    fileName: `cell_types_${geneSymbol ?? 'unknown'}_${selectedOrgan || 'all_organs'}.tsv`,
    columnNames: downloadLabels,
    rows: filteredSortedCellTypes.map((row) => [
      row.cell_type,
      row.clid ?? '',
      row.cell_hits.toString(),
      row.total_cells.toString(),
      row.percentage,
      row['adj-pval'].toString(),
    ]),
  });

  const isLoading = isLoadingAllCellTypes || isLoadingCurrentCellTypes;

  const trackDownloadTable = useTrackGeneDetailPage({
    action: 'Cell Types / Download Table',
  });

  const trackChangeOrgan = useTrackGeneDetailPage({
    action: 'Cell Types / Select Organ Sources',
  });

  const changeSortTrackingInfo = useGeneDetailPageTrackingInfo();

  const handleOrganChange = useEventCallback((event: SelectChangeEvent) => {
    setSelectedOrgan(event.target.value);
    trackChangeOrgan();
  });

  const handleTableDownload = useEventCallback(() => {
    download();
    trackDownloadTable();
  });

  const handleSortChange = useEventCallback((sort: string) => {
    setSort(sort);

    if (!sort) {
      return;
    }

    trackEvent({
      ...changeSortTrackingInfo,
      action: 'Cell Types / Sort Cell Type Table',
      label: columns[sort as keyof typeof columns]?.label ?? 'Unknown Column',
    });
  });

  if (!isLoading && !filteredSortedCellTypes.length) {
    return 'No cell types found.';
  }

  return (
    <Paper>
      <FormControl fullWidth sx={{ px: 2 }}>
        <InputLabel htmlFor="cell-types-organ-sources" variant="outlined" shrink sx={{ ml: 2 }}>
          Organ Sources
        </InputLabel>
        <Select
          id="cell-types-organ-sources"
          value={selectedOrgan}
          label="Organ Sources"
          defaultValue=""
          onChange={handleOrganChange}
          fullWidth
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="" aria-label="Display cell types from all organs">
            All Available Organs
          </MenuItem>
          {Array.from(new Set(cellTypeOrgans)).map((organ) => (
            <MenuItem key={organ} value={organ}>
              {organ}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Select organs from scFind indexed organs to identify cell types that express the marker gene. Selecting organs
          will recalculate statistical values.
        </FormHelperText>
      </FormControl>
      <StyledTableContainer>
        <Table stickyHeader>
          <CellTypesTableHeader
            isLoading={isLoading}
            handleSortChange={handleSortChange}
            handleTableDownload={handleTableDownload}
            sortState={sortState}
          />
          <TableBody>
            {isLoading && <TableSkeleton />}
            {filteredSortedCellTypes.map((cellType) => (
              <CellTypesRow key={cellType.cell_type} cellType={cellType} />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

interface DatasetGeneAggregations {
  datasetTypes: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
  organs: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
}

const useIndexedDatasetsForGene = () => {
  const { geneSymbol } = useGenePageContext();
  const { data: datasets, isLoading: isLoadingDatasets } = useFindDatasetForGenes({
    geneList: geneSymbol,
  });

  const ids = useSCFindIDAdapter(datasets?.findDatasets[geneSymbol] ?? []);

  const query =
    ids.length > 0
      ? {
          bool: {
            must: [
              {
                ids: {
                  values: ids,
                },
              },
            ],
          },
        }
      : undefined;

  const { searchData, isLoading: isLoadingDatasetTypes } = useSearchData<unknown, DatasetGeneAggregations>({
    query,
    aggs: {
      datasetTypes: {
        terms: {
          field: 'raw_dataset_type.keyword',
          order: {
            _term: 'asc',
          },
          size: 10000,
        },
      },
      organs: {
        terms: {
          field: 'origin_samples_unique_mapped_organs.keyword',
        },
      },
    },
    size: 10000,
    _source: ['hubmap_id'],
  });

  const datasetUUIDs = searchData?.hits?.hits.map((h) => h._id) ?? [];

  const datasetTypes = searchData?.aggregations?.datasetTypes?.buckets ?? [];

  const organs = searchData?.aggregations?.organs?.buckets ?? [];

  return {
    datasets: datasetUUIDs,
    datasetTypes,
    scFindParams: {
      genes: [geneSymbol],
    },
    organs,
    isLoading: isLoadingDatasets || isLoadingDatasetTypes,
  };
};

export default function CellTypes() {
  const { geneSymbolUpper } = useGenePageContext();
  const indexedDatasetsInfo = useIndexedDatasetsForGene();
  return (
    <CollapsibleDetailPageSection
      id={cellTypesSection.id}
      title={`Cell Types with ${geneSymbolUpper} as Marker Gene`}
      trackingInfo={useGeneDetailPageTrackingInfo()}
    >
      <Description
        belowTheFold={
          <IndexedDatasetsSummary {...indexedDatasetsInfo}>
            These results are derived from RNAseq datasets that were indexed by the <SCFindLink /> to identify cell
            types expressing this gene. Not all HuBMAP datasets are currently compatible with this method due to data
            modalities or the availability of cell annotations. This section gives a summary of the datasets that are
            used to compute these results.
          </IndexedDatasetsSummary>
        }
      >
        The table displays cell types expressing this marker gene as identified by the <SCFindLink />. It calculates
        cell count proportions and statistical metrics based on uniformly processed HuBMAP RNAseq datasets with cell
        type annotations.
        <Divider sx={{ opacity: 0, my: 1 }} />
        The table can be filtered by organs and available for download for further analysis. Filtering by organ will
        recompute the results and recalculate statistical values accordingly.
      </Description>
      <CellTypesTable />
    </CollapsibleDetailPageSection>
  );
}
