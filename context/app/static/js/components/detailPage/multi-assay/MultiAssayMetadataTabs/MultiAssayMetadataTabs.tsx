import React from 'react';
import Box from '@mui/material/Box';

import { useFlaskDataContext } from 'js/components/Contexts';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import { SuccessIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';

function getIconProps(isCurrentEntity: boolean) {
  return isCurrentEntity
    ? {
        icon: <SuccessIcon sx={(theme) => ({ color: theme.palette.success.light, fontSize: '1.5rem' })} />,
      }
    : { icon: undefined };
}

function MultiAssayMetadataTabs({ datasets }: { datasets: MultiAssayEntity[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  const {
    entity: { uuid: currentEntityUUID },
  } = useFlaskDataContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        {datasets.map(({ assay_display_name, uuid }, index) => {
          const isCurrentEntity = currentEntityUUID === uuid;
          return (
            <SecondaryBackgroundTooltip
              title={isCurrentEntity ? "This is the current dataset's metadata." : undefined}
              key={uuid}
            >
              <Tab
                label={assay_display_name}
                key={uuid}
                index={index}
                {...getIconProps(isCurrentEntity)}
                iconPosition="end"
              />
            </SecondaryBackgroundTooltip>
          );
        })}
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
