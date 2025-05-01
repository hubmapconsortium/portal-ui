import React, { useEffect, useMemo } from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSCFindCellTypeResults } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import CellTypeDistributionChart from '../CellTypeDistributionChart/CellTypeDistributionChart';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetsOverview from '../DatasetsOverview';

interface SCFindCellTypeQueryResultsProps {
  datasetIds: { hubmap_id: string }[];
}

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];

function SCFindCellTypeQueryDatasetList({ datasetIds }: SCFindCellTypeQueryResultsProps) {
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
          <DatasetsOverview datasets={datasetsByTissue[tissue]} />
        </TabPanel>
      ))}
    </>
  );
}

function SCFindCellTypeQueryResultsLoader() {
  const { datasets, isLoading, error } = useSCFindCellTypeResults();
  const cellTypes = useCellVariableNames();
  const { openTabIndex, handleTabChange } = useTabs();
  const { setResults } = useResultsProvider();

  const deduplicatedResults = useMemo(() => {
    if (datasets) {
      const uniqueResults = Object.values(datasets)
        .flat()
        .reduce((acc, dataset) => {
          const { hubmap_id } = dataset;
          if (!acc.has(hubmap_id)) {
            acc.add(hubmap_id);
          }
          return acc;
        }, new Set<string>());
      return Array.from(uniqueResults);
    }
    return [];
  }, [datasets]);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <Stack spacing={1} py={2}>
      <Typography variant="subtitle1">Cell Type Distribution Across Organs</Typography>
      <OrganCellTypeDistributionCharts />
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {cellTypes.map((cellType, idx) => (
          <Tab key={cellType} label={`${cellType} (${datasets[cellType].length})`} index={idx} />
        ))}
      </Tabs>
      <div>
        <DatasetListHeader />
        {cellTypes.map((cellType, idx) => (
          <TabPanel key={cellType} value={openTabIndex} index={idx}>
            <SCFindCellTypeQueryDatasetList key={cellType} datasetIds={datasets[cellType]} />
          </TabPanel>
        ))}
      </div>
    </Stack>
  );
}

export default SCFindCellTypeQueryResultsLoader;
