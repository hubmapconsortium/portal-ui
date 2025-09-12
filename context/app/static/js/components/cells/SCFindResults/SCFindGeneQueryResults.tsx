import React, { useEffect } from 'react';
import {
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
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
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

const columns = [hubmapID, organ, assayTypes, parentDonorAge, parentDonorRace, parentDonorSex];

const columnsWithMatchingGene = [
  hubmapID,
  organ,
  assayTypes,
  parentDonorAge,
  parentDonorRace,
  parentDonorSex,
  matchingGeneColumn,
];

function SCFindGeneQueryDatasetList({ datasetIds }: SCFindQueryResultsListProps) {
  const genes = useCellVariableNames();

  const columnsToUse = genes.length > 1 ? columnsWithMatchingGene : columns;

  const ids = useSCFindIDAdapter(datasetIds.map(({ hubmap_id }) => hubmap_id));

  return (
    <EntityTable<Dataset>
      maxHeight={800}
      isSelectable
      columns={columnsToUse}
      query={{
        query: {
          bool: {
            must: {
              ids: {
                values: ids,
              },
            },
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
          'entity_type',
        ],
      }}
      expandedContent={SCFindGeneCharts}
      estimatedExpandedRowHeight={1364 /* Chart 1 = 700px, Chart 2 = 600px, padding = 64px */}
      {...useTableTrackingProps()}
      expandTooltip="View additional visualizations including gene expression levels and cell type distributions."
      collapseTooltip="Collapse row."
      reverseExpandIndicator
    />
  );
}

function NoMatchesText({ emptyResults }: { emptyResults: string[] }) {
  return (
    <Stack spacing={1} pt={2}>
      <Description>
        No datasets were found for the selected genes:{' '}
        <Typography component="span" color="warning">
          {emptyResults.join(', ')}
        </Typography>
        .
      </Description>
    </Stack>
  );
}

function DatasetListSection() {
  const { openTabIndex, handleTabChange } = useTabs();
  const genes = useCellVariableNames();

  const { order, categorizedResults, emptyResults, isLoading, error } = useSCFindGeneResults();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (error || !order || emptyResults.length === order.length) {
    return <NoMatchesText emptyResults={genes} />;
  }

  return (
    <Stack spacing={1} pt={2}>
      <DatasetListHeader />
      <Description>
        Datasets expressing each selected gene are listed below. The number of datasets for each gene is shown in
        parentheses.
        {emptyResults.length > 0 && (
          <div>
            No datasets were found for{' '}
            <Typography component="span" color="warning">
              {emptyResults.length}
            </Typography>{' '}
            of the selected genes:{' '}
            <Typography component="span" color="warning">
              {emptyResults.join(', ')}
            </Typography>
            .
          </div>
        )}
      </Description>
      <Tabs onChange={handleTabChange} value={openTabIndex} variant={order.length > 10 ? 'scrollable' : 'fullWidth'}>
        {order.map((gene, idx) => (
          <Tab key={gene} label={`${gene} (${categorizedResults[gene]?.length ?? 0})`} index={idx} />
        ))}
      </Tabs>
      {order.map((gene, idx) => (
        <TabPanel key={gene} value={openTabIndex} index={idx} sx={{ mt: 0, height: 800 }}>
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

  const { datasets, isLoading, error, datasetToGeneMap, noResults } = useSCFindGeneResults();

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
      {!noResults && (
        <DatasetsOverview
          datasets={deduplicatedResults}
          belowTheFold={
            <ViewIndexedDatasetsButton
              scFindParams={{
                scFindOnly: true,
              }}
              isLoading={false}
            />
          }
          trackingInfo={trackingInfo}
        >
          This overview provides a summary of the matched datasets and their proportions relative to both indexed
          datasets and the total HuBMAP datasets. The summary is available in two formats: a visualization view and a
          tabular view. Both views can be downloaded, with the visualization available as a PNG and the table as a TSV
          file.
        </DatasetsOverview>
      )}
      <DatasetListSection />
    </MatchingGeneContextProvider>
  );
}

export default SCFindGeneQueryResultsLoader;
