import React from 'react';
import Box from '@mui/material/Box';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import { TableRows } from '../../MetadataSection/MetadataSection';

interface MultiAssayEntityTabProps {
  label: string;
  uuid: string;
  index: number;
}

function MetadataTab({ label, uuid, index, ...props }: MultiAssayEntityTabProps) {
  return <Tab label={label} key={uuid} index={index} iconPosition="end" {...props} />;
}

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid'> & { tableRows: TableRows; label: string };

function MetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        {entities.map(({ label, uuid }, index) => (
          <MetadataTab label={label} uuid={uuid} index={index} key={uuid} />
        ))}
      </Tabs>
      {entities.map(({ uuid, tableRows }, index) => (
        <TabPanel value={openTabIndex} index={index} key={uuid}>
          <MetadataTable tableRows={tableRows} />
        </TabPanel>
      ))}
    </Box>
  );
}

export default MetadataTabs;
