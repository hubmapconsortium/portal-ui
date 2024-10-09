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
  icon: React.ElementType;
}

function MetadataTab({ label, uuid, index, icon: Icon, ...props }: MultiAssayEntityTabProps) {
  return (
    <Tab
      icon={<Icon fontSize="1.5rem" color="primary" />}
      label={label}
      key={uuid}
      index={index}
      iconPosition="start"
      {...props}
    />
  );
}

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid'> & {
  tableRows: TableRows;
  label: string;
  icon: React.ElementType;
};

function MetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant={entities.length > 4 ? 'scrollable' : 'fullWidth'}>
        {entities.map(({ label, uuid, icon }, index) => (
          <MetadataTab label={label} uuid={uuid} index={index} key={uuid} icon={icon} />
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
