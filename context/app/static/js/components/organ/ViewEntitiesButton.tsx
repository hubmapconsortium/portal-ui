import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';
import { SearchURLTypes, getSearchURL } from 'js/components/organ/utils';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { EventWithOptionalCategory } from 'js/components/types';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

interface ViewEntitiesButtonProps extends ButtonProps {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  filters: Omit<SearchURLTypes, 'entityType'>;
  trackingInfo?: EventWithOptionalCategory;
  count?: number;
  formatCount?: (count: number) => string;
}

function ViewEntitiesLabel({
  entityType,
  count,
  formatCount,
}: {
  entityType: string;
  count?: number;
  formatCount?: (count: number) => string;
}) {
  if (!count) {
    return `View ${entityType}s`;
  }
  if (count && formatCount) {
    return formatCount(count);
  }
  return `${entityType}s: ${count.toLocaleString()}`;
}

function ViewEntitiesButton({
  entityType,
  filters,
  trackingInfo,
  color = 'primary',
  variant = 'outlined',
  component = 'a',
  count,
  formatCount,
  ...rest
}: ViewEntitiesButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent('Organ Page');

  const handleTrack = useEventCallback(() => {
    if (!trackingInfo) {
      return;
    }

    trackEntityPageEvent({
      ...trackingInfo,
      action: `${trackingInfo.action} / View ${entityType}s`,
    });
  });

  const Icon = entityIconMap[entityType];

  return (
    <Button
      color={color}
      variant={variant}
      component={component}
      href={getSearchURL({ entityType, ...filters })}
      onClick={handleTrack}
      startIcon={<Icon color={color} />}
      {...rest}
    >
      <ViewEntitiesLabel entityType={entityType} count={count} formatCount={formatCount} />
    </Button>
  );
}

export default ViewEntitiesButton;
