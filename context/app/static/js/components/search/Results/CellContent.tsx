import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import WarningRounded from '@mui/icons-material/WarningRounded';
import ArrowRight from '@mui/icons-material/ChevronRightRounded';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import { VitessceIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import { Entity } from 'js/components/types';

export interface HuBMAPIdDisplayInfo {
  hasVisualization?: boolean;
  isSuperseded?: boolean;
  isRetracted?: boolean;
  latestRevisionUrl?: string;
}

/**
 * Derives display-time flags from an entity source. Centralized so result tables
 * and tiles render identical state for the same entity.
 */
export function getHuBMAPIdDisplayInfo(source: Partial<Entity>): HuBMAPIdDisplayInfo {
  const nextRevisionUuid = typeof source.next_revision_uuid === 'string' ? source.next_revision_uuid : undefined;
  const isSuperseded = Boolean(nextRevisionUuid);
  const isRetracted = Boolean(source.sub_status);
  const hasVisualization = Boolean(source.visualization);
  const latestRevisionUrl =
    nextRevisionUuid && source.entity_type
      ? `/browse/${source.entity_type.toLowerCase()}/${nextRevisionUuid}`
      : undefined;
  return { isSuperseded, isRetracted, hasVisualization, latestRevisionUrl };
}

/**
 * Renders the HuBMAP ID text, prefixing a warning icon and tooltip when the
 * entity is superseded or retracted. Stays presentation-only so callers can
 * wrap it in whatever link/title element fits their context.
 */
export function HuBMAPIdLabel({
  hubmapId,
  isSuperseded,
  isRetracted,
}: { hubmapId: string } & Pick<HuBMAPIdDisplayInfo, 'isSuperseded' | 'isRetracted'>) {
  const isStale = isSuperseded || isRetracted;
  if (!isStale) {
    return <>{hubmapId}</>;
  }
  return (
    <SecondaryBackgroundTooltip
      title={isSuperseded ? 'A newer revision of this entity exists.' : 'This entity has been retracted.'}
    >
      <Stack direction="row" gap={0.5} alignItems="center" component="span">
        <WarningRounded fontSize="small" />
        {hubmapId}
      </Stack>
    </SecondaryBackgroundTooltip>
  );
}

interface ViewLatestChipProps {
  latestRevisionUrl: string;
}

export function ViewLatestVersionChip({ latestRevisionUrl }: ViewLatestChipProps) {
  return (
    <SecondaryBackgroundTooltip title="A newer revision of this entity exists. Click to navigate to it.">
      <Chip
        label="View Latest Version"
        size="small"
        color="success"
        variant="outlined"
        data-testid="superseded-chip"
        icon={<ArrowRight />}
        clickable
        sx={{ flexDirection: 'row-reverse', pr: 1, '.MuiChip-label': { paddingRight: 0 } }}
        href={latestRevisionUrl}
        component="a"
      />
    </SecondaryBackgroundTooltip>
  );
}

export function RetractedChip() {
  return (
    <SecondaryBackgroundTooltip title="This entity has been retracted.">
      <Chip label="Retracted" size="small" color="warning" variant="outlined" data-testid="retracted-chip" />
    </SecondaryBackgroundTooltip>
  );
}

interface HuBMAPIDCellContentProps extends HuBMAPIdDisplayInfo {
  hubmapId: string;
}

/**
 * Full HuBMAP ID rendering for the search results table cell: a link to the
 * entity detail page, an optional Vitessce icon, and superseded/retracted chips.
 */
export function HuBMAPIDCellContent({
  hubmapId,
  hasVisualization,
  isSuperseded,
  isRetracted,
  latestRevisionUrl,
}: HuBMAPIDCellContentProps) {
  const isStale = isSuperseded || isRetracted;
  return (
    <Stack direction="column" gap={0.5} alignItems="flex-start">
      <Stack direction="row" gap={0.5} alignItems="center">
        <InternalLink
          href={`/browse/${hubmapId}`}
          data-testid="hubmap-id-link"
          sx={isStale ? { color: 'warning.main' } : undefined}
        >
          <HuBMAPIdLabel hubmapId={hubmapId} isSuperseded={isSuperseded} isRetracted={isRetracted} />
        </InternalLink>
        {hasVisualization && (
          <SecondaryBackgroundTooltip title="This dataset has a Vitessce visualization available.">
            <VitessceIcon display="inline-block" color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Stack>
      {isSuperseded && latestRevisionUrl && <ViewLatestVersionChip latestRevisionUrl={latestRevisionUrl} />}
      {isRetracted && !isSuperseded && <RetractedChip />}
    </Stack>
  );
}

interface CellContentProps extends HuBMAPIdDisplayInfo {
  field: string;
  fieldValue: string;
}

export function CellContent({
  field,
  fieldValue,
  hasVisualization,
  isSuperseded,
  isRetracted,
  latestRevisionUrl,
}: CellContentProps) {
  switch (field.split('.').pop()) {
    case 'hubmap_id':
      return (
        <HuBMAPIDCellContent
          hubmapId={fieldValue}
          hasVisualization={hasVisualization}
          isSuperseded={isSuperseded}
          isRetracted={isRetracted}
          latestRevisionUrl={latestRevisionUrl}
        />
      );
    case 'last_modified_timestamp':
    case 'published_timestamp':
    case 'created_timestamp':
      // Handle datasets without published timestamps.
      if (!fieldValue) {
        return null;
      }
      return <>{format(fieldValue, 'yyyy-MM-dd')}</>;
    case 'age':
      return <DonorAgeTooltip donorAge={fieldValue}>{fieldValue}</DonorAgeTooltip>;
    default:
      return <>{fieldValue}</>;
  }
}
