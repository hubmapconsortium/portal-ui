import React, { useEffect, useMemo } from 'react';
import {
  assayTypes,
  organCol,
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
import { CurrentGeneContextProvider, useOptionalGeneContext } from './CurrentGeneContext';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { MatchingGeneContextProvider } from './MatchingGeneContext';
import { GeneCountsContextProvider } from './GeneCountsContext';
import { matchingGeneColumn, matchingGenesColumn, totalCellCountColumn } from './columns';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';

const columns = [hubmapID, organCol, assayTypes, parentDonorAge, parentDonorRace, parentDonorSex];

const columnsWithMatchingGene = (
  hasIndividualGene: boolean,
  countsMap?: Record<string, number | string>,
  allCountsMap?: Record<string, number | string>,
  geneCountMap?: Record<string, number>,
) => [
  ...columns,
  totalCellCountColumn(allCountsMap),
  hasIndividualGene ? matchingGeneColumn(countsMap) : matchingGenesColumn(geneCountMap),
];

interface SCFindGeneQueryDatasetListProps extends SCFindQueryResultsListProps {
  geneCountMap?: Record<string, number>;
}

function SCFindGeneQueryDatasetList({ datasetIds, countsMap, geneCountMap }: SCFindGeneQueryDatasetListProps) {
  const ids = useSCFindIDAdapter(datasetIds.map(({ hubmap_id }) => hubmap_id));
  const gene = useOptionalGeneContext();
  const hasIndividualGene = Boolean(gene);

  const { data } = useIndexedDatasets();

  const allCountsMap = data?.countsMap;

  const estimatedExpandedRowHeight = gene ? 1365 : 665; // Chart 1 = 700px, Chart 2 = 600px, padding = 64px, border = 1px

  return (
    <EntityTable<Dataset>
      maxHeight={800}
      isSelectable
      columns={columnsWithMatchingGene(hasIndividualGene, countsMap, allCountsMap, geneCountMap)}
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
      estimatedExpandedRowHeight={estimatedExpandedRowHeight}
      {...useTableTrackingProps()}
      expandTooltip="View additional visualizations including gene expression levels and cell type distributions."
      collapseTooltip="Collapse row."
      reverseExpandIndicator
      initialSortState={{ columnId: hasIndividualGene ? 'matching_gene' : 'matching_genes', direction: 'desc' }}
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

  const { order, categorizedResults, emptyResults, isLoading, error, countsMaps, datasetToGeneMap } =
    useSCFindGeneResults();

  // Create a map of dataset UUID to number of matching genes for multi-gene sorting
  const datasetToGeneCountMap = useMemo(() => {
    const geneCountMap: Record<string, number> = {};
    // Only proceed if there's no error and datasetToGeneMap exists
    if (!error && datasetToGeneMap) {
      try {
        Object.entries(datasetToGeneMap).forEach(([datasetUuid, geneSet]) => {
          if (geneSet && typeof geneSet.size === 'number') {
            geneCountMap[datasetUuid] = geneSet.size;
          }
        });
      } catch (e) {
        console.warn('Error processing dataset to gene map:', e);
      }
    }
    return geneCountMap;
  }, [datasetToGeneMap, error]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (error || !order || emptyResults.length === order.length) {
    return <NoMatchesText emptyResults={genes} />;
  }

  return (
    <MatchingGeneContextProvider value={datasetToGeneMap}>
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
        {order.map((gene, idx) => {
          // Get dataset IDs for this tab
          const tabDatasetIds = categorizedResults[gene]?.map((hubmap_id) => ({ hubmap_id })) ?? [];

          return (
            <TabPanel key={gene} value={openTabIndex} index={idx} sx={{ mt: 0, height: 800 }}>
              <CurrentGeneContextProvider value={genes.includes(gene) ? gene : undefined}>
                <SCFindGeneQueryDatasetList
                  key={gene}
                  datasetIds={tabDatasetIds}
                  countsMap={countsMaps[gene]}
                  geneCountMap={datasetToGeneCountMap}
                />
              </CurrentGeneContextProvider>
            </TabPanel>
          );
        })}
      </Stack>
    </MatchingGeneContextProvider>
  );
}

interface SCFindGeneQueryResultsLoaderProps {
  trackingInfo?: EventInfo;
}

function SCFindGeneQueryResultsLoader({ trackingInfo }: SCFindGeneQueryResultsLoaderProps) {
  const { setResults } = useResultsProvider();

  const { datasets, isLoading, error, noResults, countsMaps } = useSCFindGeneResults();

  const deduplicatedResults = useDeduplicatedResults(datasets?.findDatasets);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  // countsMaps is Record<string, Record<string, number>> - gene -> dataset -> count
  const geneCountsContextValue = countsMaps || {};

  return (
    <GeneCountsContextProvider value={geneCountsContextValue}>
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
    </GeneCountsContextProvider>
  );
}

export default SCFindGeneQueryResultsLoader;
