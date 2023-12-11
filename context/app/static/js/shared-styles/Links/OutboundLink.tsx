import React from 'react';
import { LinkProps } from '@mui/material/Link';

import { useTrackOutboundLink } from 'js/hooks/useTrackOutboundLink';
import InternalLink from './InternalLink';

function OutboundLink({ children, onClick, ...props }: LinkProps) {
  const handleClick = useTrackOutboundLink(onClick);
  return (
    <InternalLink {...props} onClick={handleClick} rel="noopener noreferrer" target="_blank">
      {children}
    </InternalLink>
  );
}

export default OutboundLink;
