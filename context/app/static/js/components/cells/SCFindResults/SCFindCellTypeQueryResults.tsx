import React, { useEffect, useMemo } from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { lastModifiedTimestamp, assayTypes, organ, hubmapID } from 'js/shared-styles/tables/columns';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useDeduplicatedResults, useSCFindCellTypeResults, useTableTrackingProps } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import CellTypeDistributionChart from '../CellTypeDistributionChart/CellTypeDistributionChart';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetsOverview from '../DatasetsOverview';
import { SCFindQueryResultsListProps } from './types';
import { targetCellCountColumn, totalCellCountColumn } from './columns';

const columns = [hubmapID, organ, assayTypes, targetCellCountColumn, totalCellCountColumn, lastModifiedTimestamp];

function SCFindCellTypeQueryDatasetList({ datasetIds }: SCFindQueryResultsListProps) {
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
            ],
          },
          expandedContent: SCFindCellTypesChart,
        },
      ]}
      {...useTableTrackingProps()}
    />
  );
}

function OrganCellTypeDistributionCharts() {
  const { openTabIndex, handleTabChange } = useTabs();
  const cellTypes = useCellVariableNames();
  const tissues = useMemo(() => {
    const uniqueTissues = new Set<string>();
    cellTypes.forEach((cellType) => {
      const tissue = cellType.split('.')[0];
      uniqueTissues.add(tissue);
    });
    return Array.from(uniqueTissues);
  }, [cellTypes]);

  const { datasets } = useSCFindCellTypeResults();

  const datasetsByTissue = useMemo(() => {
    const tissueMap: Record<string, string[]> = {};
    tissues.forEach((tissue) => {
      tissueMap[tissue] = [];
    });

    Object.entries(datasets).forEach(([cellType, datasetList]) => {
      const tissue = cellType.split('.')[0];
      if (tissueMap[tissue]) {
        tissueMap[tissue].push(...datasetList.map((dataset) => dataset.hubmap_id));
      }
    });

    return tissueMap;
  }, [datasets, tissues]);

  return (
    <>
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {tissues.map((tissue, idx) => (
          <Tab key={tissue} label={tissue} index={idx} />
        ))}
      </Tabs>
      {tissues.map((tissue, idx) => (
        <TabPanel key={tissue} value={openTabIndex} index={idx}>
          <CellTypeDistributionChart tissue={tissue} />
          <Typography variant="subtitle1" component="p">
            Datasets Overview
          </Typography>
          <DatasetsOverview datasets={datasetsByTissue[tissue]}>
            These results are derived from RNAseq datasets that were indexed by the scFind method. Not all HuBMAP
            datasets are currently compatible with this method due to data modalities or the availability of cell
            annotations. The table below summarizes the number of matched datasets and the proportions relative to
            scFind-indexed datasets and total HuBMAP datasets.
          </DatasetsOverview>
        </TabPanel>
      ))}
    </>
  );
}

function DatasetListSection() {
  const { datasets, cellTypeCategories, isLoading } = useSCFindCellTypeResults();
  const { openTabIndex, handleTabChange } = useTabs();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <>
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {cellTypeCategories.map((cellType, idx) => (
          <Tab key={cellType} label={`${cellType} (${datasets[cellType]?.length ?? 0})`} index={idx} />
        ))}
      </Tabs>
      <DatasetListHeader />
      {cellTypeCategories.map((cellType, idx) => (
        <TabPanel key={cellType} value={openTabIndex} index={idx}>
          <SCFindCellTypeQueryDatasetList key={cellType} datasetIds={datasets[cellType] ?? []} />
        </TabPanel>
      ))}
    </>
  );
}

function SCFindCellTypeQueryResultsLoader() {
  const { datasets, isLoading, error } = useSCFindCellTypeResults();
  const { setResults } = useResultsProvider();

  const deduplicatedResults = useDeduplicatedResults(datasets);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <Stack spacing={1} py={2}>
      <Typography variant="subtitle1">Cell Type Distribution Across Organs</Typography>
      <OrganCellTypeDistributionCharts />
      <DatasetListSection />
    </Stack>
  );
}

export default SCFindCellTypeQueryResultsLoader;
