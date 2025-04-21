import React from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import Typography from '@mui/material/Typography';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { Dataset } from 'js/components/types';
import Stack from '@mui/material/Stack';
import BulkDownloadButtonFromSearch from 'js/components/bulkDownload/buttons/BulkDownloadButtonFromSearch';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { Copy } from 'js/shared-styles/tables/actions';
import { useSCFindCellTypeResults } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';

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

function SCFindCellTypeQueryResultsLoader() {
  const { datasets, isLoading } = useSCFindCellTypeResults();
  const cellTypes = useCellVariableNames();
  const { openTabIndex, handleTabChange } = useTabs();
  const selectedUuids = useSelectableTableStore((state) => state.selectedRows);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <>
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {cellTypes.map((cellType, idx) => (
          <Tab key={cellType} label={`${cellType} (${datasets[cellType].length})`} index={idx} />
        ))}
      </Tabs>
      {cellTypes.map((cellType, idx) => (
        <TabPanel key={cellType} value={openTabIndex} index={idx}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1">Datasets</Typography>
            <Stack ml="auto" direction="row" gap={1.5} alignItems="center">
              <SaveEntitiesButton fromMolecularQuery entity_type="Dataset" uuids={selectedUuids} />
              <Copy />
              <BulkDownloadButtonFromSearch type="dataset" />
            </Stack>
          </Stack>
          <SCFindCellTypeQueryDatasetList key={cellType} datasetIds={datasets[cellType]} />
        </TabPanel>
      ))}
    </>
  );
}

export default SCFindCellTypeQueryResultsLoader;
