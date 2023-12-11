import { useCallback } from 'react';

import { trackLink } from 'js/helpers/trackers';

function sendOutboundEvent(event: React.MouseEvent<HTMLElement, MouseEvent>) {
  trackLink((event.target as HTMLAnchorElement).href);
}

function useTrackOutboundLink(onClick?: React.MouseEventHandler<HTMLElement>) {
  return useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (onClick) {
        onClick(event);
      }
      sendOutboundEvent(event);
    },
    [onClick],
  );
}

export { useTrackOutboundLink };
