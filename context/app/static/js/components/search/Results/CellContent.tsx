import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import WarningRounded from '@mui/icons-material/WarningRounded';
import ArrowRight from '@mui/icons-material/ChevronRightRounded';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import { VitessceIcon } from 'js/shared-styles/icons';
import SeverityIcon from 'js/shared-styles/icons/SeverityIcon';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import { Entity } from 'js/components/types';
import { isRetractedStatus } from 'js/components/detailPage/utils';
import Typography from '@mui/material/Typography';

export interface HuBMAPIdDisplayInfo {
  hasVisualization?: boolean;
  isSuperseded?: boolean;
  isRetracted?: boolean;
  isSupport?: boolean;
  latestRevisionUrl?: string;
}

/**
 * Derives display-time flags from an entity source. Centralized so result tables
 * and tiles render identical state for the same entity.
 */
export function getHuBMAPIdDisplayInfo(source: Partial<Entity>): HuBMAPIdDisplayInfo {
  const nextRevisionUuid = typeof source.next_revision_uuid === 'string' ? source.next_revision_uuid : undefined;
  const isSuperseded = Boolean(nextRevisionUuid);
  const isRetracted = isRetractedStatus(
    typeof source.mapped_status === 'string' ? source.mapped_status : source.status,
  );
  const isSupport = source.entity_type === 'Support';
  const hasVisualization = Boolean(source.visualization);
  const latestRevisionUrl =
    nextRevisionUuid && source.entity_type
      ? `/browse/${source.entity_type.toLowerCase()}/${nextRevisionUuid}`
      : undefined;
  return { isSuperseded, isRetracted, isSupport, hasVisualization, latestRevisionUrl };
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
      title={isRetracted ? 'This dataset has been retracted.' : 'A newer revision of this entity exists.'}
    >
      <Stack direction="row" gap={0.5} alignItems="center" component="span">
        {isRetracted ? <SeverityIcon status="retracted" fontSize="small" /> : <WarningRounded fontSize="small" />}
        {hubmapId}
      </Stack>
    </SecondaryBackgroundTooltip>
  );
}

interface ViewLatestChipProps {
  latestRevisionUrl: string;
  isRetracted?: boolean;
}

export function ViewLatestVersionChip({ latestRevisionUrl, isRetracted }: ViewLatestChipProps) {
  return (
    <SecondaryBackgroundTooltip
      title={
        isRetracted
          ? 'A replacement for this retracted dataset exists. Click to navigate to it.'
          : 'A newer revision of this entity exists. Click to navigate to it.'
      }
    >
      <Chip
        label={isRetracted ? 'View Replacement' : 'View Latest Version'}
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

export function SupportChip() {
  return (
    <SecondaryBackgroundTooltip title="Support datasets are created to enable visualizations and do not contain independent analysis results.">
      <Chip
        label="Support"
        size="small"
        color="info"
        variant="outlined"
        data-testid="support-chip"
        sx={{ maxWidth: 'fit-content' }}
      />
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
  return (
    <Stack direction="column" gap={0.5} alignItems="flex-start">
      <Stack direction="row" gap={0.5} alignItems="center">
        <InternalLink
          href={`/browse/${hubmapId}`}
          data-testid="hubmap-id-link"
          sx={isRetracted ? { color: 'retracted.main' } : isSuperseded ? { color: 'warning.main' } : undefined}
        >
          <HuBMAPIdLabel hubmapId={hubmapId} isSuperseded={isSuperseded} isRetracted={isRetracted} />
        </InternalLink>
        {hasVisualization && (
          <SecondaryBackgroundTooltip title="This dataset has a Vitessce visualization available.">
            <VitessceIcon display="inline-block" color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Stack>
      {isSuperseded && latestRevisionUrl && (
        <ViewLatestVersionChip latestRevisionUrl={latestRevisionUrl} isRetracted={isRetracted} />
      )}
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
  isSupport,
  latestRevisionUrl,
}: CellContentProps) {
  if (!fieldValue) {
    // Placeholder so columns without a value (e.g. a donor missing age/BMI/sex/race) aren't blank.
    return <>—</>;
  }

  switch (field.split('.').pop() ?? '') {
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
    case 'mapped_status':
      // Add the retracted icon + color only for retracted datasets, for extra emphasis.
      if (isRetracted) {
        return (
          <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: 'retracted.main' }}>
            <SeverityIcon status="retracted" fontSize="small" />
            {fieldValue}
          </Stack>
        );
      }
      return <>{fieldValue}</>;
    case 'last_modified_timestamp':
    case 'published_timestamp':
    case 'created_timestamp':
      return <>{format(fieldValue, 'yyyy-MM-dd')}</>;
    case 'age':
      return <DonorAgeTooltip donorAge={fieldValue}>{fieldValue}</DonorAgeTooltip>;
    case 'assay_display_name':
      return (
        <Stack direction="column" gap={0.5}>
          <Typography variant="body2">{fieldValue}</Typography>
          {isSupport && <SupportChip />}
        </Stack>
      );
    default:
      return <>{fieldValue}</>;
  }
}
