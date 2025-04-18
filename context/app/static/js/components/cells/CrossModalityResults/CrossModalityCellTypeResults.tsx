import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { CellTypeOrgansGraph } from 'js/components/cell-types/CellTypesVisualization';
import CellTypesProvider from 'js/components/cell-types/CellTypesContext';
import { lastModifiedTimestamp, assayTypes, status, organ, hubmapID } from 'js/shared-styles/tables/columns';
import { Tab, TabPanel, Tabs } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DisambiguationTextbox } from './DisambiguationTextbox';
import { useCellTypeOrgans, useCrossModalityResults } from './hooks';
import { extractCLID } from './utils';
import { CrossModalityCellTypesChart } from '../CellsCharts/CellTypesChart';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';

function CellTypeResult({ cellType }: { cellType: string }) {
  const { organs = [], error } = useCellTypeOrgans(cellType);

  if (error) {
    console.error(error);
    return null;
  }

  const clid = extractCLID(cellType);

  if (!clid) {
    console.error('Could not extract CLID from cell type name');
    return null;
  }

  return (
    <Box width="100%">
      <CellTypesProvider cellId={clid}>
        <DisambiguationTextbox cellName={cellType} />
        <Typography variant="h3" textAlign="center">
          Cell Type Distribution Across Organs
        </Typography>
        <CellTypeOrgansGraph organs={organs} />
      </CellTypesProvider>
    </Box>
  );
}

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
function CrossModalityCellTypeResults() {
  // For cell type queries, the results are displayed differently than for other queries.
  // The total number of datasets that match the query is displayed, out of all datasets.
  // A disambiguation textbox is displayed if a CLID resolves to multiple variants of a cell type.
  // A graph is displayed showing the distribution of the cell type across different organs.

  const {
    data: results,
    parameters: { cellVariableNames },
  } = useCrossModalityResults();

  const { list: resultsList, length: resultCounts } = useAugmentedResults(results.list);

  const { openTabIndex, handleTabChange } = useTabs();

  if (!results || !resultCounts) {
    return <Skeleton height={40} width="100%" />;
  }

  const ids = resultsList.map((r) => r._source.uuid);

  return (
    <div>
      <div>
        <Tabs value={openTabIndex} onChange={handleTabChange}>
          {cellVariableNames.map((cellTypeName, index) => (
            <Tab key={cellTypeName} index={index} label={cellTypeName} />
          ))}
        </Tabs>
        {cellVariableNames.map((cellTypeName, index) => (
          <TabPanel value={openTabIndex} index={index} key={cellTypeName}>
            <CellTypeResult key={cellTypeName} cellType={cellTypeName} />
          </TabPanel>
        ))}
      </div>
      <Divider sx={{ my: 2 }} />
      <div>
        <Typography variant="h3">Relevant Datasets</Typography>
        <EntitiesTables
          isSelectable
          entities={[
            {
              entityType: 'Dataset',
              query: {
                query: { ids: { values: ids } },
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
              columns,
              expandedContent: CrossModalityCellTypesChart,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default CrossModalityCellTypeResults;
