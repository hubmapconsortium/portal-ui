import React from 'react';
import Box from '@mui/material/Box';

import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import { SuccessIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import { TableRows } from '../../MetadataSection/MetadataSection';

function getIconProps(isCurrentEntity: boolean) {
  return isCurrentEntity
    ? {
        icon: <SuccessIcon sx={(theme) => ({ color: theme.palette.success.light, fontSize: '1.5rem' })} />,
      }
    : { icon: undefined };
}

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid'> & { tableRows: TableRows; label: string };

function MultiAssayMetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  const {
    entity: { uuid: currentEntityUUID },
  } = useFlaskDataContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        {entities.map(({ label, uuid }, index) => {
          const isCurrentEntity = currentEntityUUID === uuid;
          return (
            <SecondaryBackgroundTooltip
              title={isCurrentEntity ? "This is the current dataset's metadata." : undefined}
              key={uuid}
            >
              <Tab label={label} key={uuid} index={index} {...getIconProps(isCurrentEntity)} iconPosition="end" />
            </SecondaryBackgroundTooltip>
          );
        })}
      </Tabs>
      {entities.map(({ uuid, tableRows }, index) => (
        <TabPanel value={openTabIndex} index={index} key={uuid}>
          <MetadataTable tableRows={tableRows} />
        </TabPanel>
      ))}
    </Box>
  );
}

export default MultiAssayMetadataTabs;