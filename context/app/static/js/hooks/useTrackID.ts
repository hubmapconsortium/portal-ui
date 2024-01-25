import { useEffect } from 'react';

import { trackEvent } from 'js/helpers/trackers';

interface UseTrackIDTypes {
  entity_type: string;
  hubmap_id: string;
}

function useTrackID({ entity_type, hubmap_id }: UseTrackIDTypes) {
  useEffect(() => {
    trackEvent({
      category: entity_type,
      action: 'Visited',
      label: hubmap_id,
      nonInteraction: true, // not triggered by user interaction
    });
  }, [entity_type, hubmap_id]);
}

export default useTrackID;
