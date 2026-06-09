import React from 'react';
import Box from '@mui/material/Box';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import SelectableTableProvider, { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import {
  hubmapID,
  organCol,
  assayTypes,
  parentDonorAge,
  parentDonorRace,
  parentDonorSex,
} from 'js/shared-styles/tables/columns';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import SCFindDatasetTableActions from 'js/components/cells/SCFindResults/SCFindDatasetTableActions';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import { Dataset } from 'js/components/types';

const RNA_TAB = 0;
const ATAC_TAB = 1;

// The general dataset-search columns (no scFind-specific matching-gene / cell-count columns).
const columns = [hubmapID, organCol, assayTypes, parentDonorRace, parentDonorSex, parentDonorAge];

const sourceFields = [
  'hubmap_id',
  'uuid',
  'origin_samples_unique_mapped_organs',
  'mapped_data_types',
  'mapped_status',
  'mapped_data_access_level',
  'last_modified_timestamp',
  'donor',
  'entity_type',
];

/**
 * Expanded-row content: the dataset's own Vitessce visualization preview (no gene/cell-type context,
 * so no marker gene is passed). Mirrors `SCFindVitesscePreview` from the detail pages.
 */
function IndexedDatasetPreview(dataset: Dataset) {
  const { data: vitessceConf, isLoading } = useVitessceConf(dataset.uuid);

  return (
    <Box p={2} width="100%" height="700px">
      <ChartLoader isLoading={isLoading || !vitessceConf}>
        <VisualizationWrapper
          vitData={vitessceConf}
          uuid={dataset.uuid}
          hasNotebook={false}
          hasBeenMounted
          hideShare
          title="Visualization Preview"
          trackingInfo={{ action: 'scFind Method Page / Datasets' }}
        />
      </ChartLoader>
    </Box>
  );
}

/**
 * Selectable table of all scFind-indexed datasets for a modality. Rendered inside its own
 * SelectableTableProvider (one per tab), so the row selection + the "N selected"/actions header
 * reset when switching tabs.
 */
function IndexedDatasetsTable({ modality, label }: { modality?: string; label: string }) {
  const { data } = useIndexedDatasets(modality);
  const ids = useSCFindIDAdapter(data?.datasets ?? []);
  const numSelected = useSelectableTableStore((state) => state.selectedRows.size);

  return (
    <EntityTable<Dataset>
      maxHeight={800}
      minHeight={800}
      isSelectable
      numSelected={numSelected}
      headerActions={<SCFindDatasetTableActions />}
      columns={columns}
      query={{
        query: { bool: { must: { ids: { values: ids } } } },
        size: 10000,
        _source: sourceFields,
      }}
      expandedContent={IndexedDatasetPreview}
      estimatedExpandedRowHeight={665 /* preview = 700, padding = 64, border = 1 */}
      reverseExpandIndicator
      expandTooltip="View the dataset's visualization preview."
      collapseTooltip="Collapse row."
      initialSortState={{ columnId: 'hubmap_id', direction: 'asc' }}
      trackingInfo={{ category: 'scFind Method Page', action: 'Datasets / Results', label }}
    />
  );
}

/**
 * Collapsible "Datasets" section listing all scFind-indexed datasets, split into RNAseq / ATACseq
 * tabs with total counts. Each tab owns its selection (per-tab provider).
 */
export default function ScFindDatasetsSection() {
  const { openTabIndex, handleTabChange } = useTabs();
  const { data: rnaIndexed } = useIndexedDatasets(undefined);
  const { data: atacIndexed, isLoading: atacLoading } = useIndexedDatasets('ATAC');
  const rnaCount = rnaIndexed?.datasets.length ?? 0;
  const atacCount = atacIndexed?.datasets.length ?? 0;

  return (
    <CollapsibleDetailPageSection title="Datasets" id="datasets">
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab label={`RNAseq (${rnaCount})`} index={RNA_TAB} />
        <Tab label={`ATACseq (${atacCount})`} index={ATAC_TAB} disabled={!atacLoading && atacCount === 0} />
      </Tabs>
      <TabPanel value={openTabIndex} index={RNA_TAB} sx={{ mt: 0 }}>
        <SelectableTableProvider tableLabel="scFind Indexed Datasets - RNAseq">
          <IndexedDatasetsTable modality={undefined} label="RNAseq" />
        </SelectableTableProvider>
      </TabPanel>
      <TabPanel value={openTabIndex} index={ATAC_TAB} sx={{ mt: 0 }}>
        <SelectableTableProvider tableLabel="scFind Indexed Datasets - ATACseq">
          <IndexedDatasetsTable modality="ATAC" label="ATACseq" />
        </SelectableTableProvider>
      </TabPanel>
    </CollapsibleDetailPageSection>
  );
}
