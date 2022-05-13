import { useEffect } from 'react';
import { trackEvent } from 'js/helpers/trackers';

function useSendUUIDEvent(entity_type, uuid) {
  useEffect(() => {
    trackEvent({
      category: entity_type,
      action: 'Visited',
      label: uuid,
      nonInteraction: true, // not triggered by user interaction
    });
  }, [entity_type, uuid]);
}

export default useSendUUIDEvent;
