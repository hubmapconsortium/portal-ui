import React, { useMemo } from 'react';
import Box from '@mui/material/Box';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import { Dataset, Donor, Sample } from 'js/components/types';
import IntegratedDataTable from 'js/components/detailPage/IntegratedData/IntegratedDataTable';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

interface IntegratedDataTabProps {
  label: React.ReactNode;
  index: number;
  icon: React.ElementType;
}

function IntegratedDataTab({ label, index, icon: Icon, ...props }: IntegratedDataTabProps) {
  return (
    <Tab
      icon={<Icon fontSize="1.5rem" color="primary" />}
      label={label}
      index={index}
      iconPosition="start"
      {...props}
    />
  );
}

function IntegratedDataTabs({ entities }: { entities: (Donor | Dataset | Sample)[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  const entityIdsByType = useMemo(() => {
    const result: { Donor: string[]; Dataset: string[]; Sample: string[] } = {
      Dataset: [],
      Donor: [],
      Sample: [],
    };
    for (const { entity_type, uuid } of entities) result[entity_type].push(uuid);
    return result;
  }, [entities]);

  type EntityType = keyof typeof entityIdsByType;
  const entityTypes = (Object.keys(entityIdsByType) as EntityType[]).filter(
    (entityType) => entityIdsByType[entityType].length > 0,
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant="fullWidth">
        {entityTypes.map((entityType, index) => (
          <IntegratedDataTab
            label={`${entityType}s (${entityIdsByType[entityType].length})`}
            index={index}
            icon={entityIconMap[entityType]}
            key={entityType}
          />
        ))}
      </Tabs>
      {entityTypes.map((entityType, index) => (
        <TabPanel value={openTabIndex} index={index} key={entityType}>
          <IntegratedDataTable entityType={entityType} entityIds={entityIdsByType[entityType]} />
        </TabPanel>
      ))}
    </Box>
  );
}

export default IntegratedDataTabs;
