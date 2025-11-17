import React, { useMemo } from 'react';
import Box from '@mui/material/Box';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import { TableRows } from '../../MetadataSection/MetadataSection';
import Stack from '@mui/material/Stack';

interface MultiAssayEntityTabProps {
  label: React.ReactNode;
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

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid' | 'hubmap_id'> & {
  tableRows: TableRows;
  label: string;
  icon: React.ElementType;
};

function MetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  // If multiple entities share the same label, append the entity.
  const deduplicatedEntities = useMemo(() => {
    const labelCounts: Record<string, number> = {};
    entities.forEach(({ label }) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    const deduplicated = entities.map(({ label, hubmap_id, tableRows, ...rest }) => {
      const count = labelCounts[label];
      return {
        hubmap_id,
        tableRows,
        label:
          count > 1 ? (
            <Stack key={hubmap_id} spacing={0} alignItems="center">
              <div>{label}</div>
              <div>({hubmap_id})</div>
            </Stack>
          ) : (
            label
          ),
        ...rest,
      };
    });
    return deduplicated;
  }, [entities]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant={entities.length > 4 ? 'scrollable' : 'fullWidth'}>
        {deduplicatedEntities.map(({ label, uuid, icon }, index) => (
          <MetadataTab label={label} uuid={uuid} index={index} key={uuid} icon={icon} />
        ))}
      </Tabs>
      {deduplicatedEntities.map(({ uuid, tableRows }, index) => (
        <TabPanel value={openTabIndex} index={index} key={uuid}>
          <MetadataTable tableRows={tableRows} />
        </TabPanel>
      ))}
    </Box>
  );
}

export default MetadataTabs;
