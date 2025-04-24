import React, { PropsWithChildren } from 'react';
import { useEventCallback } from '@mui/material';
import { trackEvent } from 'js/helpers/trackers';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

interface HomepageOutboundLinkProps extends PropsWithChildren {
  url: string;
}
function HomepageOutboundLink({ url, children }: HomepageOutboundLinkProps) {
  const handleTrack = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: 'Data Use Guidelines',
      label: url,
    });
  });

  return (
    <OutboundLink onClick={handleTrack} href={url}>
      {children}
    </OutboundLink>
  );
}

export default HomepageOutboundLink;
