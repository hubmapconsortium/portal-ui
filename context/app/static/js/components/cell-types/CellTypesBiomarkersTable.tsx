import React, { useCallback, useMemo } from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';

import { StyledTableContainer } from 'js/shared-styles/tables';
import Paper from '@mui/material/Paper';
import { InternalLink } from 'js/shared-styles/Links';
import { LineClamp } from 'js/shared-styles/text';
import { useSortState } from 'js/hooks/useSortState';
import EntityHeaderCell from 'js/shared-styles/tables/EntitiesTable/EntityTableHeaderCell';
import { useDownloadTable } from 'js/helpers/download';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { trackEvent } from 'js/helpers/trackers';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { useCellTypesDetailPageContext, useCellTypeMarkersData } from './CellTypesDetailPageContext';
import { CollapsibleDetailPageSection } from '../detailPage/DetailPageSection';
import { ScientificNotationDisplayCell } from '../genes/CellTypes/ScientificNotationDisplay';
import { useBiomarkersTableData } from './hooks';
import { makeScFindModalityLabel } from '../cells/MolecularDataQueryForm/hooks';

function GeneDescription({ description }: { description: React.ReactNode }) {
  return <LineClamp lines={2}>{description ?? 'No description available.'}</LineClamp>;
}
// noop for convenience
const cellContent = () => null;

const columns = [
  { id: 'name', label: 'Name', sort: 'name', cellContent },
  { id: 'description', label: 'Description', sort: 'description', cellContent },
  {
    id: 'precision',
    label: 'Precision',
    sort: 'precision',
    cellContent,
    tooltipText:
      'Statistical metric measuring the proportion of correctly identified positive cases and predicted positive cases. Higher precision indicates fewer false positives.',
  },
  {
    id: 'recall',
    label: 'Recall',
    sort: 'recall',
    cellContent,
    tooltipText:
      'Statistical metric measuring the proportion of actual positive cases and true positives. Higher recall indicates fewer false negatives.',
  },
  {
    id: 'f1',
    label: 'F1 Score',
    sort: 'f1',
    cellContent,
    tooltipText: 'Statistical metric balancing precision and recall. A higher F1 score indicates better performance.',
  },
];

function BiomarkersTable({ modality }: { modality?: SCFindModality }) {
  const { isLoading, isLoadingDescriptions, rows } = useBiomarkersTableData(modality);

  const { name, trackingInfo } = useCellTypesDetailPageContext();
  const modalityLabel = makeScFindModalityLabel(modality);

  const { sortState, setSort } = useSortState(
    {
      name: 'name',
      description: 'description',
      precision: 'precision',
      recall: 'recall',
      f1: 'f1',
    },
    {
      columnId: 'f1',
      direction: 'desc',
    },
  );

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const multiplier = sortState.direction === 'asc' ? 1 : -1;
      switch (sortState.columnId) {
        case 'name':
          return (a.genes ?? '').localeCompare(b.genes ?? '') * multiplier;
        case 'description':
          return (a.description ?? '').localeCompare(b.description ?? '') * multiplier;
        case 'precision':
          return (Number(a.precision ?? 0) - Number(b.precision ?? 0)) * multiplier;
        case 'recall':
          return (Number(a.recall ?? 0) - Number(b.recall ?? 0)) * multiplier;
        case 'f1':
          return (Number(a.f1 ?? 0) - Number(b.f1 ?? 0)) * multiplier;
        default:
          return 0; // No sorting applied
      }
    });
  }, [rows, sortState]);

  const download = useDownloadTable({
    fileName: `biomarkers_for_${name ?? 'unknown'}_${modalityLabel}.tsv`,
    columnNames: columns.map((column) => column.label),
    rows: sortedRows.map((row) => [
      row.genes,
      row.description,
      row.precision?.toString() ?? '',
      row.recall?.toString() ?? '',
      row.f1?.toString() ?? '',
    ]),
  });

  const onDownload = useCallback(() => {
    download();
    trackEvent({
      ...trackingInfo,
      action: 'Biomarkers / Download Table',
    });
  }, [download, trackingInfo]);

  const onSort = useCallback(
    (columnId: string) => {
      setSort(columnId);
      trackEvent({
        ...trackingInfo,
        action: 'Biomarkers / Sort Table',
        label: `${trackingInfo.label} / ${columns.find((column) => column.id === columnId)?.label ?? columnId}`,
      });
    },
    [setSort, trackingInfo],
  );

  return (
    <Paper>
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead sx={{ position: 'relative' }}>
            <TableRow>
              {columns.map((column) => (
                <EntityHeaderCell key={column.id} column={column} setSort={onSort} sortState={sortState} />
              ))}
              <TableCell sx={{ backgroundColor: 'background.paper' }} align="right">
                <DownloadButton
                  disabled={isLoading || isLoadingDescriptions}
                  tooltip="Download table in TSV format."
                  sx={{ right: 1 }}
                  onClick={onDownload}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <LoadingTableRows numberOfCols={5} numberOfRows={3} />}
            {sortedRows.map(({ genes, precision, recall, f1, description }) => (
              <TableRow key={genes}>
                <TableCell>
                  <InternalLink
                    href={`/genes/${genes}`}
                    onClick={() => {
                      trackEvent({ ...trackingInfo, action: 'Biomarkers / Select Biomarker', label: genes });
                    }}
                  >
                    {genes}
                  </InternalLink>
                </TableCell>
                <TableCell>
                  <GeneDescription description={description} />
                </TableCell>
                <ScientificNotationDisplayCell value={precision} />
                <ScientificNotationDisplayCell value={recall} />
                <ScientificNotationDisplayCell value={f1} />
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

function CellTypesBiomarkersTableSection() {
  const { trackingInfo } = useCellTypesDetailPageContext();
  const { openTabIndex, handleTabChange } = useTabs();
  // Counts for the tab labels come straight from the aggregate's per-modality marker lists.
  const rnaCount = useCellTypeMarkersData(undefined).markers.length;
  const atacCount = useCellTypeMarkersData('ATAC').markers.length;

  return (
    <CollapsibleDetailPageSection id="biomarkers" title="Biomarkers" trackingInfo={trackingInfo}>
      <Description>
        Explore marker genes associated with the cell type and its statistical metrics as computed by the scFind method.
        It calculates statistical metrics based on uniformly processed HuBMAP RNAseq and ATACseq datasets with cell type
        annotations. The table can be downloaded in TSV format for further analysis.
      </Description>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab label={`RNAseq (${rnaCount} Biomarkers)`} index={0} disabled={rnaCount === 0} />
        <Tab label={`ATACseq (${atacCount} Biomarkers)`} index={1} disabled={atacCount === 0} />
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <BiomarkersTable modality={undefined} />
      </TabPanel>
      <TabPanel value={openTabIndex} index={1}>
        <BiomarkersTable modality="ATAC" />
      </TabPanel>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesBiomarkersTableSection);
