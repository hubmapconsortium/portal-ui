import React, { useEffect, useMemo } from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import { useSCFindCellTypeResults } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import CellTypeDistributionChart from './CellTypeDistributionChart';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';

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

  useEffect(() => {
    if (datasets) {
      const deduplicatedResults = Object.values(datasets)
        .flat()
        .reduce((acc, dataset) => {
          const { hubmap_id } = dataset;
          if (!acc.has(hubmap_id)) {
            acc.add(hubmap_id);
          }
          return acc;
        }, new Set<string>());
      const count = deduplicatedResults.size;
      setResults(count, isLoading, error);
    } else {
      setResults(0, isLoading, error);
    }
  }, [datasets, isLoading, error, setResults]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <>
      <OrganCellTypeDistributionCharts />
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {cellTypes.map((cellType, idx) => (
          <Tab key={cellType} label={`${cellType} (${datasets[cellType].length})`} index={idx} />
        ))}
      </Tabs>
      <DatasetListHeader />
      {cellTypes.map((cellType, idx) => (
        <TabPanel key={cellType} value={openTabIndex} index={idx}>
          <SCFindCellTypeQueryDatasetList key={cellType} datasetIds={datasets[cellType]} />
        </TabPanel>
      ))}
    </>
  );
}

export default SCFindCellTypeQueryResultsLoader;
