import React, { useEffect, useMemo } from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { lastModifiedTimestamp, assayTypes, organ, hubmapID, CellContentProps } from 'js/shared-styles/tables/columns';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import { DatasetDocument } from 'js/typings/search';
import { decimal, percent } from 'js/helpers/number-format';
import { useSCFindCellTypeResults } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import CellTypeDistributionChart from '../CellTypeDistributionChart/CellTypeDistributionChart';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetsOverview from '../DatasetsOverview';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';

interface SCFindCellTypeQueryResultsProps {
  datasetIds: { hubmap_id: string }[];
}

function TargetCellCountColumn({ hit: { hubmap_id } }: CellContentProps<DatasetDocument>) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });
  const cellTypes = useCellVariableNames();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  const { cellTypeCounts } = data;
  const cellTypeCountsMap = cellTypeCounts.reduce(
    (acc, { index, count }) => {
      acc[index] = count;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <div>
      {Object.entries(cellTypeCountsMap).map(([cellType, count]) =>
        cellTypes.includes(cellType) ? (
          <Typography key={cellType} variant="body2" component="p">
            {cellType.split('.')[1]}: {count} ({percent.format(count / totalCells)})
          </Typography>
        ) : null,
      )}
    </div>
  );
}

function TotalCellCountColumn({ hit: { hubmap_id } }: CellContentProps<DatasetDocument>) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  const { cellTypeCounts } = data;
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <Typography variant="body2" component="p">
      {decimal.format(totalCells)}
    </Typography>
  );
}

const targetCellCountColumn = {
  id: 'cell_count',
  label: 'Target Cell Count',
  cellContent: TargetCellCountColumn,
  noSort: true,
};

const totalCellCountColumn = {
  id: 'total_cell_count',
  label: 'Total Cell Count',
  cellContent: TotalCellCountColumn,
  noSort: true,
};

const columns = [hubmapID, organ, assayTypes, targetCellCountColumn, totalCellCountColumn, lastModifiedTimestamp];

function SCFindCellTypeQueryDatasetList({ datasetIds }: SCFindCellTypeQueryResultsProps) {
  const { track, sessionId } = useMolecularDataQueryFormTracking();
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
      onSelectAllChange={(e) => {
        const isSelected = e.target.checked;
        if (isSelected) {
          track('Results / Select All Datasets');
        }
      }}
      onSelectChange={(e, id) => {
        const isSelected = e.target.checked;
        if (isSelected) {
          track('Results / Select Dataset', id);
        }
      }}
      trackingInfo={{
        category: 'Molecular and Cellular Query',
        action: 'Results',
        label: sessionId,
      }}
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
