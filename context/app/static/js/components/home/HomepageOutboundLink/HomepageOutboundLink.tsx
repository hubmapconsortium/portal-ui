import React, { PropsWithChildren } from 'react';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

interface HomepageOutboundLinkProps extends PropsWithChildren {
  href: string;
}
function HomepageOutboundLink({ href, children }: HomepageOutboundLinkProps) {
  const handleTrack = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: 'Data Use Guidelines',
      // The tracking sheet expects the link's text as the label; fall back to the href
      // for the rare non-string children.
      label: typeof children === 'string' ? children : href,
    });
  });

  return (
    <OutboundLink onClick={handleTrack} href={href}>
      {children}
    </OutboundLink>
  );
}

export default HomepageOutboundLink;
