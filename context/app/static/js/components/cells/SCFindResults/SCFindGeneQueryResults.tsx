import React, { useEffect } from 'react';
import {
  lastModifiedTimestamp,
  assayTypes,
  organ,
  hubmapID,
  parentDonorAge,
  parentDonorRace,
  parentDonorSex,
} from 'js/shared-styles/tables/columns';
import { Dataset, EventInfo } from 'js/components/types';
import Skeleton from '@mui/material/Skeleton';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import Description from 'js/shared-styles/sections/Description';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ViewIndexedDatasetsButton from 'js/components/organ/OrganCellTypes/ViewIndexedDatasetsButton';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import { useUUIDsFromHubmapIds } from 'js/components/organ/hooks';
import DatasetsOverview from '../DatasetsOverview';

import { SCFindQueryResultsListProps } from './types';
import { useDeduplicatedResults, useSCFindGeneResults, useTableTrackingProps } from './hooks';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import SCFindGeneCharts from '../CellsCharts/SCFindGeneCharts';
import { CurrentGeneContextProvider } from './CurrentGeneContext';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { MatchingGeneContextProvider } from './MatchingGeneContext';
import { matchingGeneColumn } from './columns';

const columns = [hubmapID, organ, assayTypes, parentDonorAge, parentDonorRace, parentDonorSex, lastModifiedTimestamp];

const columnsWithMatchingGene = [
  hubmapID,
  organ,
  assayTypes,
  parentDonorAge,
  parentDonorRace,
  parentDonorSex,
  matchingGeneColumn,
  lastModifiedTimestamp,
];

function SCFindGeneQueryDatasetList({ datasetIds }: SCFindQueryResultsListProps) {
  const genes = useCellVariableNames();

  const columnsToUse = genes.length > 1 ? columnsWithMatchingGene : columns;

  return (
    <EntityTable<Dataset>
      maxHeight={800}
      isSelectable
      columns={columnsToUse}
      query={{
        query: {
          terms: {
            'hubmap_id.keyword': datasetIds.map(({ hubmap_id }) => hubmap_id),
          },
        },
        size: 10000,
        _source: [
          'hubmap_id',
          'origin_samples_unique_mapped_organs',
          'mapped_status',
          'mapped_data_types',
          'mapped_data_access_level',
          'uuid',
          'last_modified_timestamp',
          'donor',
        ],
      }}
      expandedContent={SCFindGeneCharts}
      {...useTableTrackingProps()}
      expandTooltip="View additional visualizations including gene expression levels and cell type distributions."
      collapseTooltip="Collapse row."
    />
  );
}

function DatasetListSection() {
  const { openTabIndex, handleTabChange } = useTabs();
  const genes = useCellVariableNames();

  const { order, categorizedResults, emptyResults, isLoading, error } = useSCFindGeneResults();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (error || !order) {
    return (
      <Stack spacing={1} pt={2}>
        <Description>No datasets were found for any of the selected genes: {emptyResults.join(', ')}.</Description>
      </Stack>
    );
  }

  return (
    <Stack spacing={1} pt={2}>
      <Description>
        Datasets expressing each selected gene are listed below. The number of datasets for each gene is shown in
        parentheses.
        {emptyResults.length > 0 && (
          <>
            <br />
            No datasets were found for {emptyResults.length} of the selected genes: {emptyResults.join(', ')}.
          </>
        )}
      </Description>
      <DatasetListHeader />
      <Tabs onChange={handleTabChange} value={openTabIndex} variant={order.length > 10 ? 'scrollable' : 'fullWidth'}>
        {order.map((gene, idx) => (
          <Tab key={gene} label={`${gene} (${categorizedResults[gene]?.length ?? 0})`} index={idx} />
        ))}
      </Tabs>
      {order.map((gene, idx) => (
        <TabPanel key={gene} value={openTabIndex} index={idx}>
          <CurrentGeneContextProvider value={genes.includes(gene) ? gene : undefined}>
            <SCFindGeneQueryDatasetList
              key={gene}
              datasetIds={categorizedResults[gene]?.map((hubmap_id) => ({ hubmap_id })) ?? []}
            />
          </CurrentGeneContextProvider>
        </TabPanel>
      ))}
    </Stack>
  );
}

interface SCFindGeneQueryResultsLoaderProps {
  trackingInfo?: EventInfo;
}

function SCFindGeneQueryResultsLoader({ trackingInfo }: SCFindGeneQueryResultsLoaderProps) {
  const { setResults } = useResultsProvider();

  const { datasets, isLoading, error, datasetToGeneMap } = useSCFindGeneResults();

  const { data: indexedDatasets = { datasets: [] } } = useIndexedDatasets();

  const indexedDatasetsButtonProps = useUUIDsFromHubmapIds(indexedDatasets.datasets);

  const deduplicatedResults = useDeduplicatedResults(datasets?.findDatasets);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  return (
    <MatchingGeneContextProvider value={datasetToGeneMap}>
      <Typography variant="subtitle1" component="p" gutterBottom>
        Datasets Overview
      </Typography>
      <DatasetsOverview
        datasets={deduplicatedResults}
        belowTheFold={<ViewIndexedDatasetsButton {...indexedDatasetsButtonProps} />}
        trackingInfo={trackingInfo}
      >
        This overview provides a summary of the matched datasets and their proportions relative to both indexed datasets
        and the total HuBMAP datasets. The summary is available in two formats: a visualization view and a tabular view.
        Both views can be downloaded, with the visualization available as a PNG and the table as a TSV file.
      </DatasetsOverview>
      <DatasetListSection />
    </MatchingGeneContextProvider>
  );
}

export default SCFindGeneQueryResultsLoader;
