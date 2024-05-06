import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { CellTypeOrgansGraph } from 'js/components/cell-types/CellTypesVisualization';
import CellTypesProvider from 'js/components/cell-types/CellTypesContext';

import { Tab, TabPanel, Tabs } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import { useStore } from '../store';
import { DisambiguationTextbox } from './DisambiguationTextbox';
import { useCellTypeOrgans } from './hooks';
import { extractCLID } from './utils';
import DatasetsTable from '../DatasetsTable';
import CellTypesChart from '../CellsCharts/CellTypesCharts';

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
    <Box height={640} width="100%">
      <CellTypesProvider cellId={clid}>
        <DisambiguationTextbox cellName={cellType} />
        <CellTypeOrgansGraph organs={organs} />
      </CellTypesProvider>
    </Box>
  );
}

function CellTypeResults() {
  // For cell type queries, the results are displayed differently than for other queries.
  // The total number of datasets that match the query is displayed, out of all datasets.
  // A disambiguation textbox is displayed if a CLID resolves to multiple variants of a cell type.
  // A graph is displayed showing the distribution of the cell type across different organs.

  const { results, resultCounts, cellVariableNames } = useStore();

  const { openTabIndex, handleTabChange } = useTabs();

  if (!results || !resultCounts) {
    return <Skeleton height={40} width="100%" />;
  }

  return (
    <div>
      <div>
        <p>
          {resultCounts.matching} out of {resultCounts.total} datasets match the query.
        </p>
      </div>
      <div>
        <Typography variant="h3">Cell Type Distribution Across Organs</Typography>
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
      <div>
        <DatasetsTable datasets={results} expandedContent={CellTypesChart} />
      </div>
    </div>
  );
}

export default CellTypeResults;
