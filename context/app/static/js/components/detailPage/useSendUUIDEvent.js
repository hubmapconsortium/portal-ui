import { useEffect } from 'react';
import ReactGA from 'react-ga';

function useSendUUIDEvent(entity_type, uuid) {
  useEffect(() => {
    ReactGA.event({
      category: entity_type,
      action: 'Visited',
      label: uuid,
      nonInteraction: true, // not triggered by user interaction
    });
  }, [entity_type, uuid]);
}

export default useSendUUIDEvent;
