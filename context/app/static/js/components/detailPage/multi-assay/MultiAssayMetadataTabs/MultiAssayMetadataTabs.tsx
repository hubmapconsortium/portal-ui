import React from 'react';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import Box from '@mui/material/Box';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import MetadataTable from '../../MetadataTable';

function MultiAssayMetadataTabs({ datasets }: { datasets: MultiAssayEntity[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        {datasets.map(({ assay_display_name, uuid }, index) => (
          <Tab label={assay_display_name} index={index} key={uuid} disabled={false} isSingleTab={false} />
        ))}
      </Tabs>
      {datasets.map(({ uuid, metadata: { metadata } }, index) => (
        <TabPanel value={openTabIndex} index={index} key={uuid}>
          <MetadataTable metadata={metadata} />
        </TabPanel>
      ))}
    </Box>
  );
}

export default MultiAssayMetadataTabs;
