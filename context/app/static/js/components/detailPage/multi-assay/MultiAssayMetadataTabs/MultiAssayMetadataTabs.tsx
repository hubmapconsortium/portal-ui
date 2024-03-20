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

interface MultiAssayEntityTabProps {
  label: string;
  uuid: string;
  index: number;
}

function MultiAssayEntityTab({ label, uuid, index }: MultiAssayEntityTabProps) {
  const {
    entity: { uuid: currentEntityUUID },
  } = useFlaskDataContext();
  const isCurrentEntity = currentEntityUUID === uuid;

  const iconProps = getIconProps(isCurrentEntity);
  return (
    <SecondaryBackgroundTooltip title={isCurrentEntity ? "This is the current dataset's metadata." : undefined}>
      <Tab label={label} key={uuid} index={index} {...iconProps} iconPosition="end" />
    </SecondaryBackgroundTooltip>
  );
}

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid'> & { tableRows: TableRows; label: string };

function MultiAssayMetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        {entities.map(({ label, uuid }, index) => (
          <MultiAssayEntityTab label={label} uuid={uuid} index={index} key={uuid} />
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

export default MultiAssayMetadataTabs;
