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
      label: href,
    });
  });

  return (
    <OutboundLink onClick={handleTrack} href={href}>
      {children}
    </OutboundLink>
  );
}

export default HomepageOutboundLink;
