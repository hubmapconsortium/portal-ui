import { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { useFlaskDataContext } from '../Contexts';

interface TrackingEventType {
  action: string;
  label?: string;
  value?: number;
}

function useTrackEntityPageEvent() {
  const {
    entity: { hubmap_id, entity_type },
  } = useFlaskDataContext();

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
