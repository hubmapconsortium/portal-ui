import { useEffect, useRef } from 'react';

import { trackEvent } from 'js/helpers/trackers';

/**
 * Executes a single tracking event on mount with the given category and action.
 * @param category
 * @param action
 */
export default function useTrackMount(category: string, action: string, label = '') {
  // Track the mount event once per page
  const hasTrackedMount = useRef(false);

  useEffect(() => {
    if (!hasTrackedMount.current) {
      hasTrackedMount.current = true;
      trackEvent({
        category,
        action,
        label,
      });
    }
  }, [action, category, label]);
}
