import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';
import { DatasetIcon } from 'js/shared-styles/icons';
import { SearchURLTypes, getSearchURL } from 'js/components/organ/utils';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { EventWithOptionalCategory } from 'js/components/types';

interface ViewEntitiesButtonProps extends ButtonProps {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  filters: Omit<SearchURLTypes, 'entityType'>;
  trackingInfo?: EventWithOptionalCategory;
}
function ViewEntitiesButton({ entityType, filters, trackingInfo, ...rest }: ViewEntitiesButtonProps) {
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

  return (
    <Button
      color="primary"
      variant="outlined"
      component="a"
      href={getSearchURL({ entityType, ...filters })}
      onClick={handleTrack}
      startIcon={<DatasetIcon />}
      {...rest}
    >
      View {entityType}s
    </Button>
  );
}

export default ViewEntitiesButton;
