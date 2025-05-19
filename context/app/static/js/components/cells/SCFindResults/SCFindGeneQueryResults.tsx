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
import { Dataset } from 'js/components/types';
import Skeleton from '@mui/material/Skeleton';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import Description from 'js/shared-styles/sections/Description';
import Stack from '@mui/material/Stack';
import DatasetsOverview from '../DatasetsOverview';

import { SCFindQueryResultsListProps } from './types';
import { useDeduplicatedResults, useSCFindGeneResults, useTableTrackingProps } from './hooks';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import SCFindGeneCharts from '../CellsCharts/SCFindGeneCharts';
import { CurrentGeneContextProvider } from './CurrentGeneContext';

const columns = [hubmapID, organ, assayTypes, parentDonorAge, parentDonorRace, parentDonorSex, lastModifiedTimestamp];

function SCFindGeneQueryDatasetList({ datasetIds }: SCFindQueryResultsListProps) {
  return (
    <EntityTable<Dataset>
      maxHeight={800}
      isSelectable
      columns={columns}
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
    />
  );
}

function DatasetListSection() {
  const { openTabIndex, handleTabChange } = useTabs();

  const { order, categorizedResults, emptyResults, isLoading } = useSCFindGeneResults();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!order) {
    return <div>No datasets found for any of the selected genes: {emptyResults.join(', ')}.</div>;
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
      <Tabs onChange={handleTabChange} value={openTabIndex} variant={order.length > 10 ? 'scrollable' : 'fullWidth'}>
        {order.map((gene, idx) => (
          <Tab key={gene} label={`${gene} (${categorizedResults[gene]?.length ?? 0})`} index={idx} />
        ))}
      </Tabs>
      <DatasetListHeader />
      {order.map((gene, idx) => (
        <TabPanel key={gene} value={openTabIndex} index={idx}>
          <CurrentGeneContextProvider value={gene}>
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

function SCFindGeneQueryResultsLoader() {
  const { setResults } = useResultsProvider();

  const { datasets, isLoading, error } = useSCFindGeneResults();

  const deduplicatedResults = useDeduplicatedResults(datasets?.findDatasets);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  return (
    <>
      <DatasetsOverview datasets={deduplicatedResults}>
        This overview provides a summary of the matched datasets and their proportions relative to both indexed datasets
        and the total HuBMAP datasets. The summary is available in two formats: a visualization view and a tabular view.
        Both views can be downloaded, with the visualization available as a PNG and the table as a TSV file.
      </DatasetsOverview>
      <DatasetListSection />
    </>
  );
}

export default SCFindGeneQueryResultsLoader;
