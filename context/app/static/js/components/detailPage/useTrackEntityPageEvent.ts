import { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { useDetailContext } from 'js/components/detailPage/DetailContext';

interface TrackingEventType {
  action: string;
  label?: string;
  value?: number;
}

function useTrackEntityPageEvent() {
  const { hubmap_id, entity_type } = useDetailContext();

  return useCallback(
    (event: TrackingEventType) => {
      trackEvent(
        {
          category: `${entity_type} Page`,
          ...event,
        },
        hubmap_id,
      );
    },
    [hubmap_id, entity_type],
  );
}

export { useTrackEntityPageEvent };
