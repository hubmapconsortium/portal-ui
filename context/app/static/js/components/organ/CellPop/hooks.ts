import { trackEvent } from 'js/helpers/trackers';
import { useCallback } from 'react';

export function useTrackCellpop() {
  return useCallback((action: string, detail: string, extra: Record<string, unknown> = {}) => {
    trackEvent({
      category: 'CellPop',
      action,
      label: `${action} - ${detail}`,
      ...extra,
    });
  }, []);
}
