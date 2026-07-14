import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import { MultiAssayEntity } from '../useRelatedMultiAssayDatasets';
import { TableRows } from '../../MetadataSection/MetadataSection';
import Stack from '@mui/material/Stack';

const noMetadataTooltip = 'Metadata is not available for this entity.';

// Disabled tabs suppress pointer events, so the tooltip wraps the tab in a span
// that can still receive hover/focus events. Match the tab's flex sizing when the
// surrounding Tabs use the `fullWidth` variant so disabled tabs stay evenly sized.
const DisabledTabWrapper = styled('span', { shouldForwardProp: (prop) => prop !== '$fullWidth' })<{
  $fullWidth?: boolean;
}>(({ $fullWidth }) => ({
  display: 'flex',
  ...($fullWidth && { flex: 1 }),
}));

interface MultiAssayEntityTabProps {
  label: React.ReactNode;
  uuid: string;
  index: number;
  icon: React.ElementType;
  disabled?: boolean;
}

function MetadataTab({ label, uuid, index, icon: Icon, disabled, ...props }: MultiAssayEntityTabProps) {
  const tab = (
    <Tab
      icon={<Icon fontSize="1.5rem" color={disabled ? 'inherit' : 'primary'} />}
      label={label}
      index={index}
      iconPosition="start"
      disabled={disabled}
      {...props}
    />
  );

  if (!disabled) {
    return tab;
  }

  // `fullWidth` is injected by the parent Tabs based on its variant.
  const { fullWidth } = props as { fullWidth?: boolean };
  return (
    <SecondaryBackgroundTooltip title={noMetadataTooltip}>
      <DisabledTabWrapper $fullWidth={fullWidth}>{tab}</DisabledTabWrapper>
    </SecondaryBackgroundTooltip>
  );
}

type MultiAssayEntityWithTableRows = Pick<MultiAssayEntity, 'uuid' | 'hubmap_id'> & {
  tableRows: TableRows;
  label: string;
  icon: React.ElementType;
  hasMetadata: boolean;
};

function MetadataTabs({ entities }: { entities: MultiAssayEntityWithTableRows[] }) {
  // Open the first tab that actually has metadata, since leading tabs (e.g. the
  // current entity) may be disabled when they lack metadata of their own.
  const initialTabIndex = Math.max(
    0,
    entities.findIndex(({ hasMetadata }) => hasMetadata),
  );
  const { openTabIndex, handleTabChange } = useTabs(initialTabIndex);

  // If multiple entities share the same label, append the entity's HuBMAP ID.
  // e.g. if there are multiple "SNARE-seq" entities, the tabs will be labeled
  // "SNARE-seq (HBM.XXX.XXXX.XXX)" to disambiguate them.
  const disambiguatedEntities = useMemo(() => {
    const labelCounts = entities.reduce<Record<string, number>>((acc, { label }) => {
      if (!acc[label]) {
        acc[label] = 1;
      } else {
        acc[label] += 1;
      }
      return acc;
    }, {});

    const disambiguatedLabelEntities = entities.map(({ label, hubmap_id, tableRows, ...rest }) => {
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
    return disambiguatedLabelEntities;
  }, [entities]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant={entities.length > 6 ? 'scrollable' : 'fullWidth'}>
        {disambiguatedEntities.map(({ label, uuid, icon, hasMetadata }, index) => (
          <MetadataTab label={label} uuid={uuid} index={index} key={uuid} icon={icon} disabled={!hasMetadata} />
        ))}
      </Tabs>
      {disambiguatedEntities.map(({ uuid, tableRows, hasMetadata }, index) =>
        hasMetadata ? (
          <TabPanel value={openTabIndex} index={index} key={uuid}>
            <MetadataTable tableRows={tableRows} />
          </TabPanel>
        ) : null,
      )}
    </Box>
  );
}

export default MetadataTabs;
