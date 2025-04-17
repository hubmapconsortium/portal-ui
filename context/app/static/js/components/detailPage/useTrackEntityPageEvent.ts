import { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { EventWithOptionalCategory } from 'js/components/types';
import { useFlaskDataContext } from '../Contexts';

function useTrackEntityPageEvent(pageType?: string) {
  const { entity = { hubmap_id: undefined, entity_type: undefined } } = useFlaskDataContext();
  const { hubmap_id, entity_type } = entity;

  const category = pageType ?? (entity_type ? `${entity_type} Page` : 'Detail Page');

  return useCallback(
    (event: EventWithOptionalCategory) => {
      trackEvent(
        {
          category,
          ...event,
        },
        hubmap_id,
      );
    },
    [hubmap_id, category],
  );
}

export { useTrackEntityPageEvent };
