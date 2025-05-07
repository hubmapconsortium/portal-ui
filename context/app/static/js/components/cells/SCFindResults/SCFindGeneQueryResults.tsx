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
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import Skeleton from '@mui/material/Skeleton';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
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
    <EntitiesTables<Dataset>
      maxHeight={800}
      isSelectable
      entities={[
        {
          entityType: 'Dataset',
          columns,
          query: {
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
          },
          expandedContent: SCFindGeneCharts,
        },
      ]}
      {...useTableTrackingProps()}
    />
  );
}

function DatasetListSection() {
  const { openTabIndex, handleTabChange } = useTabs();
  const genes = useCellVariableNames();

  const { data: { findDatasets: datasets } = { findDatasets: {} }, isLoading } = useSCFindGeneResults();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <>
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {genes.map((cellType, idx) => (
          <Tab key={cellType} label={`${cellType} (${datasets[cellType].length})`} index={idx} />
        ))}
      </Tabs>
      <DatasetListHeader />
      {genes.map((gene, idx) => (
        <TabPanel key={gene} value={openTabIndex} index={idx}>
          <CurrentGeneContextProvider value={gene}>
            <SCFindGeneQueryDatasetList key={gene} datasetIds={datasets[gene].map((hubmap_id) => ({ hubmap_id }))} />
          </CurrentGeneContextProvider>
        </TabPanel>
      ))}
    </>
  );
}

function SCFindGeneQueryResultsLoader() {
  const { setResults } = useResultsProvider();

  const { data: { findDatasets: datasets } = { findDatasets: {} }, isLoading, error } = useSCFindGeneResults();

  const deduplicatedResults = useDeduplicatedResults(datasets);

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
